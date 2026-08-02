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

        let html=`<select name="produtos[]" class="w-full min-w-0 rounded-md border border-borda px-3 py-2 focus:border-rosa focus:ring-2 focus:ring-rosa/30 outline-none">`;

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
            <span class="text-[#9a8b7d]">—</span>
        `;

    }

    row.querySelector(".preco_unidade").textContent=`R$ ${produto.valor.toFixed(2)}`;

    atualizarTotal();
}

const TAXA_TELE = 8;

const itens = document.querySelector("#itens-body");
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
    itens.insertAdjacentHTML("beforeend", `
    <tr class="itens-row hover:bg-fundo-claro/70 transition-colors duration-200 align-middle">

        <td class="p-3 align-middle">
            <select class="produto w-full min-w-0 rounded-md border border-borda px-3 py-2 focus:border-rosa focus:ring-2 focus:ring-rosa/30 outline-none">
                ${optionsProdutos}
            </select>
        </td>

        <td class="p-3 align-middle">
            <div class="sabores"></div>
        </td>

        <td class="p-3 align-middle">

            <div class="flex justify-center items-center gap-2">

                <button
                    type="button"
                    class="menos w-8 h-8 shrink-0 rounded-md border border-borda text-marrom-texto font-bold hover:bg-rosa hover:text-white hover:border-rosa transition-colors duration-200">
                    −
                </button>

                <input
                    type="number"
                    value="1"
                    min="1"
                    name="quantidades[]"
                    class="w-14 text-center py-1.5 rounded-md border border-borda focus:border-rosa focus:ring-2 focus:ring-rosa/30 outline-none">

                <button
                    type="button"
                    class="mais w-8 h-8 shrink-0 rounded-md border border-borda text-marrom-texto font-bold hover:bg-rosa hover:text-white hover:border-rosa transition-colors duration-200">
                    +
                </button>

            </div>

        </td>

        <td class="p-3 align-middle text-center preco_unidade text-marrom-texto"></td>

        <td class="p-3 align-middle text-center font-bold preco_total text-rosa-escuro"></td>

        <td class="p-3 align-middle text-center">

            <button
                type="button"
                class="remover p-1.5 rounded-md hover:bg-red-50 transition-colors duration-200">

                <img
                    src="/static/assets/excluir.png"
                    class="w-5 mx-auto">

            </button>

        </td>

    </tr>
    `);

    const row = itens.lastElementChild;

    row.querySelector(".produto").addEventListener("change",()=>atualizarLinha(row));

    row.querySelector(".mais").addEventListener("click",()=>somar(row,1));

    row.querySelector(".menos").addEventListener("click",()=>somar(row,-1));

    row.querySelector("input[type=number]").addEventListener("input",()=>{
        const input=row.querySelector("input[type=number]");
        if(input.value<1) input.value=1;
        atualizarTotal();
    });

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