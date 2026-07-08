function createCards (num, items) {
    let rows
    if ((num % 4) == 1) {
        rows = num / 4
    }
    else {
        rows = Math.trunc(num / 4) + 1
    }


    const start = document.querySelector('#pedidos-page div')
    for (let i = 0; i < rows; i++) {
        start.insertAdjacentHTML ('afterend', `
                <div class="cards-row">
                </div>
            `)
    }

    let cont = 0
    const tag_rows = document.querySelectorAll('.cards-row')
    tag_rows.forEach((tag_row) => {
        for (let i = 0; i < 4; i++) {
            let teleInfo = items[cont][5] // supondo tele
            let endereco = items[cont][6]

            let teleHtml = teleInfo
            ? `<li>Tele: Sim</li><li>Endereço: ${endereco || "Não informado"}</li>`
            : `<li>Tele: Não</li>`

            if (cont > num) return
            tag_row.insertAdjacentHTML ('beforeend', `
                    <div class="card">
                    <div>
                    <h3>ID: #${items[cont][0]}</h3>
                    <p>TEMPO: ${Math.trunc(items[cont][7])} min</p>
                    </div>
                    <h4>${items[cont][1]}</h4>
                    <ul>
                    <li>Tradicional: ${items[cont][3]}</li>
                    ${teleHtml}
                    <li>Total: R$ ${items[cont][4]},00</li>
                    </ul>
                    <div class="div-whatsapp">
                    <a href="https://wa.me/${items[cont][2]}" target="blank"><img src="/static/assets/whatsapp.png"></a>
                    <p>${items[cont][2]}</p>
                    </div>
                    <form action="/concluir-pedido" method="POST">
                    <input type="hidden" name="id_pedido" value="${items[cont][0]}">
                    <button class="btn-1">Marcar como Concluído</button>
                    </form>
                    <form action="/cancelar-pedido" method="POST">
                    <input type="hidden" name="id_pedido" value="${items[cont][0]}">
                    <button>Cancelar Pedido</button>
                    </form>
                    </div>
                `)
            cont++
        }
    })
}