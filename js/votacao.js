document.addEventListener('DOMContentLoaded', () => {
    const digito1 = document.getElementById('digito1');
    const digito2 = document.getElementById('digito2');
    const candidateName = document.getElementById('candidate-name');
    const viceName = document.getElementById('vice-name');
    const chapaName = document.getElementById('chapa-name');
    const candidateImage = document.getElementById('candidate-image');
    
    const modal = document.getElementById('modal-confirmacao');
    const modalNumero = document.getElementById('modal-numero');
    const modalChapa = document.getElementById('modal-chapa');
    const modalPresidente = document.getElementById('modal-presidente');
    const btnConfirmarVoto = document.getElementById('btn-confirmar-voto');
    const btnCorrigirVoto = document.getElementById('btn-corrigir-voto');
    
    let numeroDigitado = '';
    let chapaSelecionada = null;
    
    const chapas = StorageManager.obterChapas();
    
    document.querySelectorAll('.urna-key[data-value]').forEach(tecla => {
        tecla.addEventListener('click', () => digitar(tecla.dataset.value));
    });
    
    document.querySelector('[data-action="branco"]').addEventListener('click', votarBranco);
    document.querySelector('[data-action="corrige"]').addEventListener('click', corrigir);
    document.querySelector('[data-action="confirma"]').addEventListener('click', confirmar);
    
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') digitar(e.key);
        if (e.key === '-' || e.key === 'b') votarBranco();
        if (e.key === 'c' || e.key === 'C') corrigir();
        if (e.key === 'Enter') confirmar();
    });
    
    function digitar(valor) {
        if (numeroDigitado.length < 2) {
            numeroDigitado += valor;
            atualizarDisplay();
            
            if (numeroDigitado.length === 2) {
                verificarChapa();
            }
        }
    }
    
    function atualizarDisplay() {
        digito1.value = numeroDigitado[0] || '';
        digito2.value = numeroDigitado[1] || '';
    }
    
    function verificarChapa() {
        chapaSelecionada = chapas.find(chapa => chapa.numero === numeroDigitado);
        
        if (chapaSelecionada) {
            candidateName.textContent = chapaSelecionada.nomePresidente;
            viceName.textContent = chapaSelecionada.nomeVice;
            chapaName.textContent = chapaSelecionada.nomeChapa;
            
            if (chapaSelecionada.foto) {
                candidateImage.src = chapaSelecionada.foto;
            } else {
                candidateImage.src = 'img/default.png';
            }
        } else {
            limparDadosCandidato();
        }
    }
    
    function limparDadosCandidato() {
        candidateName.textContent = '---';
        viceName.textContent = '---';
        chapaName.textContent = '---';
        candidateImage.src = 'img/default.png';
    }
    
    function votarBranco() {
        numeroDigitado = '';
        limparDadosCandidato();
        abrirModalConfirmacao({
            numero: 'BRANCO',
            chapa: 'VOTO EM BRANCO',
            presidente: '---'
        });
    }
    
    function corrigir() {
        numeroDigitado = '';
        limparDadosCandidato();
        atualizarDisplay();
    }
    
    function confirmar() {
        if (numeroDigitado.length === 2) {
            if (chapaSelecionada) {
                abrirModalConfirmacao({
                    numero: chapaSelecionada.numero,
                    chapa: chapaSelecionada.nomeChapa,
                    presidente: chapaSelecionada.nomePresidente
                });
            } else {
                abrirModalConfirmacao({
                    numero: numeroDigitado,
                    chapa: 'VOTO NULO',
                    presidente: '---'
                });
            }
        }
    }
    
    function abrirModalConfirmacao(dados) {
        modalNumero.textContent = dados.numero;
        modalChapa.textContent = dados.chapa;
        modalPresidente.textContent = dados.presidente;
        modal.style.display = 'flex';
    }
    
    btnConfirmarVoto.addEventListener('click', () => {
        registrarVoto();
        modal.style.display = 'none';
        window.location.href = 'fim.html';
    });
    
    btnCorrigirVoto.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    function registrarVoto() {
        const votos = StorageManager.obterVotos() || {
            chapas: {},
            brancos: 0,
            nulos: 0
        };
        
        if (numeroDigitado === '') {
            votos.brancos++;
        } else if (!chapaSelecionada) {
            votos.nulos++;
        } else {
            votos.chapas[chapaSelecionada.numero] = (votos.chapas[chapaSelecionada.numero] || 0) + 1;
        }
        
        StorageManager.salvarVotos(votos);
    }
});