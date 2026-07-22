import os
import sqlite3
from flask import Flask, flash, redirect, render_template, request
from datetime import datetime
import webbrowser
import threading

app = Flask(__name__)

# Database
conn = sqlite3.connect("churros.db", check_same_thread=False)
db = conn.cursor()

db.execute('''CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT NOT NULL, 
            whatsapp TEXT, 
            tele BOOLEAN,
            endereco TEXT,
            valor_total INTEGER,
            observacao TEXT,
            data_pedido TIMESTAMP,
            status TEXT)
           ''')

db.execute('''CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            nome TEXT NOT NULL,
            valor INTEGER NOT NULL,
            sabor TEXT)
           ''')

db.execute('''CREATE TABLE IF NOT EXISTS pedido_produto (
            pedido_id INTEGER,
            produto_id INTEGER,
            quantidade INTEGER NOT NULL,
            PRIMARY KEY (pedido_id, produto_id),
            FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY (produto_id) REFERENCES produtos(id))
           ''')

conn.commit()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "POST":
        nome = request.form.get("nome")
        sabor = request.form.get("sabor")
        valor = int(request.form.get("valor"))

        db.execute("INSERT INTO produtos (nome, valor, sabor) VALUES (?, ?, ?)",
                   (nome, valor, sabor if sabor else None))

        conn.commit()

        return redirect("/admin")
    else:
        db.execute("SELECT id, nome, sabor, valor FROM produtos ORDER BY nome, sabor")
        produtos = db.fetchall()
        return render_template("admin.html", produtos=produtos)

@app.route("/remover-produto", methods=["POST"])
def removerProduto():
    id = request.form["id_produto"]

    db.execute("SELECT COUNT(*) FROM pedido_produto WHERE produto_id = ?", (id,))
    em_uso = db.fetchone()[0]

    if em_uso > 0:
        return "Este produto já foi usado em pedidos e não pode ser removido", 400

    db.execute("DELETE FROM produtos WHERE id = ?", (id,))
    conn.commit()
    return redirect("/admin")

@app.route("/vendas")
def vendas():
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")

    params = ["Concluído"]
    filtro_data = ""

    if data_inicio:
        filtro_data += " AND date(p.data_pedido) >= ?"
        params.append(data_inicio)

    if data_fim:
        filtro_data += " AND date(p.data_pedido) <= ?"
        params.append(data_fim)

    # Cards: total vendido, numero de pedidos, ticket medio
    db.execute(f'''SELECT SUM(valor_total), COUNT(*), AVG(valor_total)
                   FROM pedidos p WHERE status = ? {filtro_data}''', params)
    data_cards = db.fetchall()

    # Produtos vendidos (soma das quantidades)
    db.execute(f'''SELECT SUM(pp.quantidade)
                   FROM pedido_produto pp
                   JOIN pedidos p ON p.id = pp.pedido_id
                   WHERE p.status = ? {filtro_data}''', params)
    produtos_vendidos = db.fetchone()[0] or 0

    # Mais vendidos (agrupado por nome do produto, juntando sabores)
    db.execute(f'''SELECT pr.nome, SUM(pp.quantidade) as total
                   FROM pedido_produto pp
                   JOIN pedidos p ON p.id = pp.pedido_id
                   JOIN produtos pr ON pr.id = pp.produto_id
                   WHERE p.status = ? {filtro_data}
                   GROUP BY pr.nome
                   ORDER BY total DESC
                   LIMIT 3''', params)
    mais_vendidos = db.fetchall()

    # Gráfico: faturamento por dia
    db.execute(f'''SELECT date(p.data_pedido), SUM(p.valor_total)
                   FROM pedidos p
                   WHERE p.status = ? {filtro_data}
                   GROUP BY date(p.data_pedido)
                   ORDER BY date(p.data_pedido)''', params)
    graph = db.fetchall()

    datas_graph = [f"{linha[0][8:10]}/{linha[0][5:7]}" for linha in graph]
    valores_graph = [linha[1] for linha in graph]

    # Últimas vendas (itens já formatados em uma string)
    db.execute(f'''SELECT p.id, p.nome, p.valor_total, p.data_pedido,
                   GROUP_CONCAT(pp.quantidade || 'x ' || pr.nome ||
                       CASE WHEN pr.sabor IS NOT NULL THEN ' (' || pr.sabor || ')' ELSE '' END, ', ') as itens
                   FROM pedidos p
                   JOIN pedido_produto pp ON pp.pedido_id = p.id
                   JOIN produtos pr ON pr.id = pp.produto_id
                   WHERE p.status = ? {filtro_data}
                   GROUP BY p.id
                   ORDER BY p.data_pedido''', params)
    ultimas_vendas = db.fetchall()

    return render_template("vendas.html",
                           ultimas_vendas=ultimas_vendas,
                           mais_vendidos=mais_vendidos,
                           produtos_vendidos=produtos_vendidos,
                           data_cards=data_cards,
                           data_inicio=data_inicio,
                           data_fim=data_fim,
                           datas_graph=datas_graph,
                           valores_graph=valores_graph)

@app.route("/pedidos", methods=["GET"])
def pedidos():
    db.execute('SELECT id, nome, whatsapp, valor_total, tele, endereco, data_pedido FROM pedidos WHERE status = ?',
               ("Em andamento",))
    pedidos_rows = db.fetchall()

    items = []
    for pid, nome, whatsapp, valor_total, tele, endereco, data_pedido in pedidos_rows:
        db.execute('''SELECT pr.nome, pr.sabor, pp.quantidade
                      FROM pedido_produto pp
                      JOIN produtos pr ON pr.id = pp.produto_id
                      WHERE pp.pedido_id = ?''', (pid,))
        produtos_pedido = db.fetchall()

        tempo = (datetime.now() - datetime.strptime(data_pedido, "%Y-%m-%d %H:%M:%S.%f")).total_seconds() / 60

        items.append({
            "id": pid,
            "nome": nome,
            "whatsapp": whatsapp,
            "valor_total": valor_total,
            "tele": bool(tele),
            "endereco": endereco,
            "tempo": tempo,
            "produtos": [{"nome": n, "sabor": s, "quantidade": q} for n, s, q in produtos_pedido]
        })

    return render_template("pedidos.html", items=items)

@app.route("/cancelar-pedido", methods=["POST"])
def cancelarPedido():
    id = request.form["id_pedido"]
    db.execute('DELETE FROM pedido_produto WHERE pedido_id = ?', (id,))
    db.execute('DELETE FROM pedidos WHERE id = ?', (id,))
    conn.commit()
    return redirect("/pedidos")

@app.route("/concluir-pedido", methods=["POST"])
def concluirPedido():
    id = request.form["id_pedido"]
    db.execute('UPDATE pedidos SET status = ? WHERE id = ?', ("Concluído", id))
    conn.commit()
    return redirect("/pedidos")

@app.route("/inserir-pedido", methods=["GET", "POST"])
def inserirPedido():
    if request.method == "POST":

        nome = request.form["nome"]
        if not nome.strip():
            return "Nome é obrigatório", 400

        whatsapp = request.form["whatsapp"].strip()
        if whatsapp and (len(whatsapp) != 11 or not whatsapp.isdigit()):
            return "Formato de whatsapp inválido", 400
        observacao = request.form["observacao"]

        tele = "tele" in request.form
        endereco = request.form.get("endereco", "").strip()

        produtos_ids = request.form.getlist("produtos[]")
        quantidades_lista = request.form.getlist("quantidades[]")

        if not produtos_ids:
            return "Pedido deve conter ao menos um produto", 400

        # agrupa caso o mesmo produto apareça em mais de uma linha
        itens = {}
        for produto_id, quantidade in zip(produtos_ids, quantidades_lista):
            produto_id = int(produto_id)
            quantidade = int(quantidade)
            itens[produto_id] = itens.get(produto_id, 0) + quantidade

        placeholders = ",".join("?" * len(itens))
        db.execute(f"SELECT id, valor FROM produtos WHERE id IN ({placeholders})", list(itens.keys()))
        precos = dict(db.fetchall())

        valor_total = sum(precos.get(pid, 0) * qtd for pid, qtd in itens.items())

        if tele:
            valor_total += 8

        db.execute('''INSERT INTO pedidos 
                   (nome, whatsapp, tele, endereco, valor_total, observacao, data_pedido, status) VALUES
                   (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        nome,
                        whatsapp,
                        int(tele),
                        endereco if tele else None,
                        valor_total,
                        observacao,
                        datetime.now(),
                        "Em andamento"
                        )
                    )

        pedido_id = db.lastrowid

        for produto_id, quantidade in itens.items():
            db.execute('INSERT INTO pedido_produto (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)',
                       (pedido_id, produto_id, quantidade))

        conn.commit()

        return redirect("/pedidos")
    else:
        db.execute("SELECT * FROM produtos")
        rows = db.fetchall()

        produtos = {}

        for id, nome, valor, sabor in rows:

            if nome not in produtos:
                produtos[nome] = {
                    "nome": nome,
                    "valor": valor,
                    "id": id,
                    "sabores": []
                }

            if sabor:
                produtos[nome]["sabores"].append({
                    "id": id,
                    "nome": sabor
                })

        return render_template("inserir-pedido.html", produtos=list(produtos.values()))

def abrir_browser():
    webbrowser.open("http://127.0.0.1:5000")

if __name__ == "__main__":
    threading.Timer(1, abrir_browser).start()
    app.run(host="127.0.0.1", port=5000)