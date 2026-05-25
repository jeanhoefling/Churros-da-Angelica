const sections = document.querySelectorAll('.section-hidden');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("section-show");
        }

    });
},  {
    threshold: 0.25
});
sections.forEach((section) => {
    observer.observe(section);
});


// Pedidos - Adicionar Produto

let produtos = 1;
const pedidos_itens = document.querySelector('#itens');
const btn_pedidos_adicionar = document.querySelector('#btn_pedidos_adicionar')
btn_pedidos_adicionar.addEventListener ("click", () => {
    if (produtos < 3) {
        pedidos_itens.innerHTML += `
            <div class="itens-row">
            <select>
            <option value="tradicional">Churros Tradicional</option>
            <option value="recheado">Churros Recheado</option>
            <option value="mini">Mini Churros</option>
            </select>
            <div id="div-quantidade">
            <button>-</button>
            <input>
            <button>+</button>
            </div>
            <p>R$ PREÇO</p>
            <p>R$ TOTAL</p>
            <p>X</p>
            </div>
    `;
        produtos++;
    }
});