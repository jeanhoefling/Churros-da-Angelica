function callCreate (pedidos, btn) {
    if (btn.textContent == "Ver todas as Vendas") {
        createTodasVendas(pedidos)
        btn.textContent = "Ver últimas Vendas"
    }
    else {
        createUltimasVendas(pedidos)
        btn.textContent = "Ver todas as Vendas"
    }
}

function createUltimasVendas (pedidos) {
    document.querySelectorAll('#ultimas-vendas .row').forEach((element) => {
        element.remove()
    })
    const start = document.querySelector('#vendas-page #header-row')
    let pedidos_num = pedidos.length
    if (pedidos_num >= 4) {
        pedidos_num = 4
    }
    for (let i = 1; i <= pedidos_num; i++) {
        start.insertAdjacentHTML('afterend', `
                <div class="row">
                <p>DATA</p>
                <p>${pedidos[pedidos.length - i][0]}</p>
                <p>${pedidos[pedidos.length - i][1]}x Tradicional, ${pedidos[pedidos.length - i][2]}x Recheado, ${pedidos[pedidos.length - i][3]}x Mini</p>
                <p>R$ ${pedidos[pedidos.length - i][4]},00</p>
                </div>
            `)
    }
    start.parentElement.querySelector('h3').textContent = "Últimas Vendas"
}

function createTodasVendas (pedidos) {
    document.querySelectorAll('#ultimas-vendas .row').forEach((element) => {
        element.remove()
    })
    const start = document.querySelector('#vendas-page #header-row')
    let pedidos_num = pedidos.length
    for (let i = 1; i <= pedidos_num; i++) {
        start.insertAdjacentHTML('afterend', `
                <div class="row">
                <p>DATA</p>
                <p>${pedidos[pedidos.length - i][0]}</p>
                <p>${pedidos[pedidos.length - i][1]}x Tradicional, ${pedidos[pedidos.length - i][2]}x Recheado, ${pedidos[pedidos.length - i][3]}x Mini</p>
                <p>R$ ${pedidos[pedidos.length - i][4]},00</p>
                </div>
            `)
    }
    start.parentElement.querySelector('h3').textContent = "Todas as Vendas"
}