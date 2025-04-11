document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro-chapa");
    const inputNumero = document.getElementById("numero-chapa");
    const inputPresidente = document.getElementById("nome-presidente");
    const inputVice = document.getElementById("nome-vice");
    const inputNomeChapa = document.getElementById("nome-chapa");
    const inputFoto = document.getElementById("foto-chapa");
    const imagePreview = document.getElementById("image-preview");
    const btnCancelar = document.getElementById("btn-cancelar");
    const listaChapas = document.getElementById("lista-chapas");

    const modal = document.getElementById("modal-confirmacao");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalMensagem = document.getElementById("modal-mensagem");
    const btnModalConfirmar = document.getElementById("btn-modal-confirmar");
    const btnModalCancelar = document.getElementById("btn-modal-cancelar");
    const closeModal = document.querySelector(".urna-close-modal");

    inputFoto.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview da Chapa">`;
            };
            reader.readAsDataURL(file);
        }
    });

    btnCancelar.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    function openModal(title, message, callback) {
        modalTitulo.textContent = title;
        modalMensagem.textContent = message;
        modal.style.display = "flex";

        btnModalConfirmar.onclick = function () {
            callback();
            modal.style.display = "none";
        };
    }

    btnModalCancelar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    function carregarChapas() {
        const chapas = StorageManager.obterChapas();
        listaChapas.innerHTML = "";

        chapas.forEach((chapa) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${chapa.numero}</td>
                <td>${chapa.nomeChapa}</td>
                <td>${chapa.nomePresidente}</td>
                <td class="urna-acoes">
                    <button class="urna-button editar" data-numero="${chapa.numero}">Editar</button>
                    <button class="urna-button cancelar" data-numero="${chapa.numero}">Excluir</button>
                </td>
            `;
            listaChapas.appendChild(tr);
        });

        document.querySelectorAll(".editar").forEach((btn) => {
            btn.addEventListener("click", editarChapa);
        });

        document.querySelectorAll(".cancelar").forEach((btn) => {
            btn.addEventListener("click", excluirChapa);
        });
    }

    function editarChapa(e) {
        const numero = e.target.dataset.numero;
        const chapas = StorageManager.obterChapas();
        const chapa = chapas.find((c) => c.numero === numero);

        if (chapa) {
            inputNumero.value = chapa.numero;
            inputPresidente.value = chapa.nomePresidente;
            inputVice.value = chapa.nomeVice;
            inputNomeChapa.value = chapa.nomeChapa;

            if (chapa.foto) {
                imagePreview.innerHTML = `<img src="${chapa.foto}" alt="Preview da Chapa">`;
            }

            inputNumero.focus();
        }
    }

    function excluirChapa(e) {
        const numero = e.target.dataset.numero;

        openModal(
            "Confirmar Exclusão",
            `Deseja realmente excluir a chapa ${numero}?`,
            () => {
                const chapas = StorageManager.obterChapas().filter(
                    (c) => c.numero !== numero
                );
                StorageManager.salvarChapas(chapas);
                carregarChapas();
            }
        );
    }

    formCadastro.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Formulário submetido!");

        const numero = inputNumero.value.trim();
        if (numero.length !== 2 || !/^\d+$/.test(numero)) {
            alert("Número da chapa deve conter exatamente 2 dígitos!");
            return;
        }
        console.log("Número válido:", numero);

        const nomePresidente = inputPresidente.value.trim();
        const nomeVice = inputVice.value.trim();
        const nomeChapa = inputNomeChapa.value.trim();
        let foto = "";

        if (inputFoto.files.length > 0) {
            const file = inputFoto.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                foto = event.target.result;
                finalizarCadastro(
                    numero,
                    nomePresidente,
                    nomeVice,
                    nomeChapa,
                    foto
                );
            };
            reader.readAsDataURL(file);
        } else {
            finalizarCadastro(
                numero,
                nomePresidente,
                nomeVice,
                nomeChapa,
                foto
            );
        }
    });

    function finalizarCadastro(
        numero,
        nomePresidente,
        nomeVice,
        nomeChapa,
        foto
    ) {

        console.log("Dados recebidos:", { numero, nomePresidente, nomeVice, nomeChapa });

        const novaChapa = {
            numero,
            nomePresidente,
            nomeVice,
            nomeChapa,
            foto,
        };

        console.log("Nova chapa:", novaChapa);

        openModal(
            "Confirmar Cadastro",
            `Deseja cadastrar a chapa ${numero} - ${nomeChapa}?`,
            () => {
                const chapas = StorageManager.obterChapas();

                console.log("Chapas existentes:", chapas);

                const indexExistente = chapas.findIndex(c => c.numero === numero);

                if (indexExistente >= 0) {
                    chapas[indexExistente] = novaChapa;
                    console.log("Atualizando chapa existente"); 
                } else {
                    chapas.push(novaChapa);
                    console.log("Adicionando nova chapa"); 
                }

                if (StorageManager.salvarChapas(chapas)) {
                    console.log("Chapas após salvamento:", StorageManager.obterChapas());
                    alert(`Chapa ${numero} salva com sucesso!`);
                    carregarChapas();
                    limparFormulario();
                } else {
                    alert("Erro ao salvar chapa!");
                }
            }
		);
    }

    function limparFormulario() {
        formCadastro.reset();
        imagePreview.innerHTML = "<span>Nenhuma imagem selecionada</span>";
    }

    carregarChapas();
});
