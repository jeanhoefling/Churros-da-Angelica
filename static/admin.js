document.querySelectorAll(".form-remover").forEach((form) => {
    form.addEventListener("submit", (e) => {
        const nome = form.closest("tr").querySelector("[data-label='Nome']").textContent
        const confirmado = confirm(`Remover "${nome}" dos produtos cadastrados? Essa ação não pode ser desfeita.`)
        if (!confirmado) {
            e.preventDefault()
        }
    })
})