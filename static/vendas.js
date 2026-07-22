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
    renderVendas(pedidos, 4)
    document.querySelector('#ultimas-vendas h3').textContent = "Últimas Vendas"
}

function createTodasVendas (pedidos) {
    renderVendas(pedidos, pedidos.length)
    document.querySelector('#ultimas-vendas h3').textContent = "Todas as Vendas"
}

function renderVendas (pedidos, limite) {
    document.querySelectorAll('#ultimas-vendas .row').forEach((element) => {
        element.remove()
    })
    const start = document.querySelector('#vendas-page #header-row')
    const num = Math.min(pedidos.length, limite)

    for (let i = 1; i <= num; i++) {
        const pedido = pedidos[pedidos.length - i]
        const dataStr = pedido[3].split(" ")[0]
        const ano = dataStr.slice(2, 4)
        const mes = dataStr.slice(5, 7)
        const dia = dataStr.slice(8, 10)

        start.insertAdjacentHTML('afterend', `
                <div class="row">
                <p>${dia}/${mes}/${ano}</p>
                <p>${pedido[1]}</p>
                <p>${pedido[4]}</p>
                <p>R$ ${pedido[2]},00</p>
                </div>
            `)
    }
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