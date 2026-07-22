function createCards (items) {
    const num = items.length
    const rows = Math.ceil(num / 4)

    const start = document.querySelector('#pedidos-page div')
    for (let i = 0; i < rows; i++) {
        start.insertAdjacentHTML('afterend', `
                <div class="cards-row">
                </div>
            `)
    }

    let cont = 0
    const tag_rows = document.querySelectorAll('.cards-row')
    tag_rows.forEach((tag_row) => {
        for (let i = 0; i < 4; i++) {
            if (cont >= num) return

            const pedido = items[cont]

            const produtosHtml = pedido.produtos.map((p) => {
                const label = p.sabor ? `${p.nome} (${p.sabor})` : p.nome
                return `<li>${label}: ${p.quantidade}x</li>`
            }).join("")

            const teleHtml = pedido.tele
                ? `<li>Tele: Sim</li><li>Endereço: ${pedido.endereco || "Não informado"}</li>`
                : `<li>Tele: Não</li>`

            tag_row.insertAdjacentHTML('beforeend', `
                    <div class="card">
                    <div>
                    <h3>ID: #${pedido.id}</h3>
                    <p>TEMPO: ${Math.trunc(pedido.tempo)} min</p>
                    </div>
                    <h4>${pedido.nome}</h4>
                    <ul>
                    ${produtosHtml}
                    ${teleHtml}
                    <li>Total: R$ ${pedido.valor_total},00</li>
                    </ul>
                    <div class="div-whatsapp">
                    <a href="https://wa.me/${pedido.whatsapp}" target="blank"><img src="/static/assets/whatsapp.png"></a>
                    <p>${pedido.whatsapp}</p>
                    </div>
                    <form action="/concluir-pedido" method="POST">
                    <input type="hidden" name="id_pedido" value="${pedido.id}">
                    <button class="btn-1">Marcar como Concluído</button>
                    </form>
                    <form action="/cancelar-pedido" method="POST">
                    <input type="hidden" name="id_pedido" value="${pedido.id}">
                    <button>Cancelar Pedido</button>
                    </form>
                    </div>
                `)
            cont++
        }
    })
}