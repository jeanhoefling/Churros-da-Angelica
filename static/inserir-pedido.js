function atualizarTotal(){

    let total=0;

    document.querySelectorAll(".itens-row")
    .forEach(row=>{
        const nomeProduto=row.querySelector(".produto").value;
        const produto=produtos.find(p=>p.nome==nomeProduto);
        const quantidade=parseInt(row.querySelector("input[type=number]").value
        );

        const subtotal=
            quantidade*produto.valor;

        row.querySelector(".preco_total")
            .textContent=`R$ ${subtotal.toFixed(2)}`;

        total+=subtotal;

    });

    if(document.querySelector("#tele").checked){
        total+=TAXA_TELE;
    }

    totalPedido.textContent=`R$ ${total.toFixed(2)}`;
}

function atualizarLinha(row){
    const nomeProduto =row.querySelector(".produto").value;
    const produto =produtos.find(p=>p.nome==nomeProduto);
    const saboresDiv =row.querySelector(".sabores");

    saboresDiv.innerHTML="";

    // Possui sabores
    if(produto.sabores.length){

        let html=`<select name="produtos[]">`;

        produto.sabores.forEach(s=>{
            html+=`
                <option value="${s.id}">
                    ${s.nome}
                </option>
            `;
        });

        html+=`</select>`;

        saboresDiv.innerHTML=html;
    }

    // Não possui sabores
    else{
        saboresDiv.innerHTML=`
            <input
                type="hidden"
                name="produtos[]"
                value="${produto.id}">
        `;

        saboresDiv.innerHTML+=`
            <span>-</span>
        `;

    }

    row.querySelector(".preco_unidade").textContent=`R$ ${produto.valor.toFixed(2)}`;

    atualizarTotal();
}

const TAXA_TELE = 8;

const itens = document.querySelector("#itens");
const totalPedido = document.querySelector("#adicionar-total p");

let optionsProdutos = "";

produtos.forEach(produto => {
    optionsProdutos += `
        <option value="${produto.nome}">
            ${produto.nome}
        </option>
    `;
});


function criarLinha(){
    itens.insertAdjacentHTML("beforeend",`
        <div class="itens-row">

            <select class="produto">
                ${optionsProdutos}
            </select>

            <div class="sabores"></div>

            <div class="div-quantidade">
                <button type="button" class="menos">-</button>

                <input
                    type="number"
                    value="1"
                    min="1"
                    name="quantidades[]">

                <button type="button" class="mais">+</button>
            </div>

            <p class="preco_unidade"></p>

            <p class="preco_total"></p>

            <a class="remover">
                <img src="/static/assets/excluir.png">
            </a>

        </div>
    `);

    const row = itens.lastElementChild;

    row.querySelector(".produto").addEventListener("change",()=>atualizarLinha(row));

    row.querySelector(".mais").addEventListener("click",()=>somar(row,1));

    row.querySelector(".menos").addEventListener("click",()=>somar(row,-1));

    row.querySelector(".remover").addEventListener("click",()=>{
            row.remove();
            atualizarTotal();
        });

    atualizarLinha(row);
}

function somar(row,valor){

    const input=row.querySelector("input[type=number]");

    let q=parseInt(input.value);

    q+=valor;

    if(q<1)
        q=1;

    input.value=q;

    atualizarTotal();
}

document.querySelector("#btn_pedidos_adicionar").addEventListener("click",criarLinha);

const tele=document.querySelector("#tele");
const endereco=document.querySelector("#endereco-container");

tele.addEventListener("change",()=>{
    endereco.style.display=
        tele.checked
            ? "block"
            : "none";

    atualizarTotal();

});

criarLinha();