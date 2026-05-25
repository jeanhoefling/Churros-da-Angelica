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

let produtos = 0;
const itens_row = document.querySelector('#itens-row');
function adicionar_produto () {
    if (produtos < 2) {
        produtos++;   
    }
    for (let i = 0; i < produtos; i++) {
        document.append(itens_row);
    }
}