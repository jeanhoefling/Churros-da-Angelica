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
        let dataStr = pedidos[pedidos.length - i][3].split(" ")[0]
        let ano = dataStr.slice(2, 4)
        let mes = dataStr.slice(5, 7)
        let dia = dataStr.slice(8, 10)
        start.insertAdjacentHTML('afterend', `
                <div class="row">
                <p>${dia}/ ${mes}/${ano}</p>
                <p>${pedidos[pedidos.length - i][0]}</p>
                <p>${pedidos[pedidos.length - i][1]}x Tradicional</p>
                <p>R$ ${pedidos[pedidos.length - i][2]},00</p>
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
        let dataStr = pedidos[pedidos.length - i][3].split(" ")[0]
        let ano = dataStr.slice(2, 4)
        let mes = dataStr.slice(5, 7)
        let dia = dataStr.slice(8, 10)
        start.insertAdjacentHTML('afterend', `
                <div class="row">
                <p>${dia}/ ${mes}/${ano}</p>
                <p>${pedidos[pedidos.length - i][0]}</p>
                <p>${pedidos[pedidos.length - i][1]}x Tradicional</p>
                <p>R$ ${pedidos[pedidos.length - i][2]},00</p>
                </div>
            `)
    }
    start.parentElement.querySelector('h3').textContent = "Todas as Vendas"
}

function criarGrafico(datas, valores) {

    const canvas = document.getElementById("graficoVendas");

    if (!canvas) return;

    new Chart(canvas, {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                data: valores,
                borderColor: "#ff6b81",
                backgroundColor: "rgba(255,107,129,0.15)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Faturamento (R$)"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}