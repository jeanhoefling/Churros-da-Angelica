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
        return render_template("admin.html")

@app.route("/vendas")
def vendas():
    data_inicio = request.args.get("data_inicio")
    data_fim = request.args.get("data_fim")

    params = ["Concluído"]
    query_ultimas_vendas = 'SELECT nome, tradicional, valor_total, data_pedido FROM pedidos WHERE status = ?'
    query_mais_vendidos = 'SELECT SUM(tradicional) FROM pedidos WHERE status = ?'
    query3 = 'SELECT SUM(valor_total) AS soma_valor, COUNT(*) AS num_pedidos, AVG(valor_total) AS ticket, SUM(tradicional) AS num_produtos FROM pedidos WHERE status = ?'
    query_graph = 'SELECT date(data_pedido), SUM(valor_total) FROM pedidos WHERE status = ?'

    if data_inicio:
        params.append(data_inicio)
        query_ultimas_vendas += ' AND date(data_pedido) >= ?'
        query_mais_vendidos += ' AND date(data_pedido) >= ?'
        query3 += ' AND date(data_pedido) >= ?'
        query_graph += ' AND date(data_pedido) >= ?'

    if data_fim:
        params.append(data_fim)
        query_ultimas_vendas += ' AND date(data_pedido) <= ?'
        query_mais_vendidos += ' AND date(data_pedido) <= ?'
        query3 += ' AND date(data_pedido) <= ?'
        query_graph += ' AND date(data_pedido) <= ?'

    query_graph += ' GROUP BY date(data_pedido) ORDER BY date(data_pedido)'

    db.execute(query_ultimas_vendas, params)
    ultimas_vendas = db.fetchall()
    db.execute(query_mais_vendidos, params)
    unidades = db.fetchall()
    db.execute(query3, params)
    data_cards = db.fetchall()
    db.execute(query_graph, params)
    graph = db.fetchall()

    datas_graph = [linha[0] for linha in graph]
    datas_graph = [
        f"{data[8:10]}/{data[5:7]}"
        for data in datas_graph
    ]

    valores_graph = [linha[1] for linha in graph]

    return render_template("vendas.html", ultimas_vendas=ultimas_vendas, unidades=unidades, data_cards=data_cards, data_inicio=data_inicio, data_fim=data_fim, datas_graph=datas_graph, valores_graph=valores_graph)

@app.route("/pedidos", methods=["GET"])
def pedidos():
    db.execute('SELECT COUNT(*) as num_pedidos FROM pedidos WHERE status = (?)', ("Em andamento",))
    num_pedidos = int(db.fetchone()[0])
    db.execute('SELECT id, nome, whatsapp, tradicional, valor_total, tele, endereco, data_pedido FROM pedidos WHERE status = (?)', ("Em andamento",))
    items = db.fetchall()
    items = [list(item) for item in items]
    for item in items:
        item[7] = (datetime.now() - datetime.strptime(item[7], "%Y-%m-%d %H:%M:%S.%f")).total_seconds() / 60
    return render_template("pedidos.html", num_pedidos=num_pedidos, items=items)
    
@app.route("/cancelar-pedido", methods=["POST"])
def cancelarPedido():
    if request.method == "POST":
        id = request.form["id_pedido"]
        db.execute('DELETE FROM pedidos WHERE id = ?', (id,))
        conn.commit()
        return redirect("/pedidos")
    
@app.route("/concluir-pedido", methods=["POST"])
def concluirPedido():
    if request.method == "POST":
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

        produtos = {}
        produtos_lista = request.form.getlist("produtos[]")
        quantidades_lista = request.form.getlist("quantidades[]")
        for i in range (len(produtos_lista)):
            produtos[produtos_lista[i]] = int(quantidades_lista[i])

        valor_total = produtos.get("tradicional", 0) * 7

        if tele:
            valor_total += 8

        db.execute('''INSERT INTO pedidos 
                   (nome, whatsapp, tradicional, valor_total, tele, endereco, observacao, data_pedido, status) VALUES
                   (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        nome,
                        whatsapp,
                        produtos.get("tradicional", 0),
                        valor_total,
                        int(tele),
                        endereco if tele else None,
                        observacao,
                        datetime.now(),
                        "Em andamento"
                        )
                    )
        conn.commit()

        return render_template("inserir-pedido.html")
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