class UrnaEletronica {
    constructor() {
      this.state = {
        currentScreen: 'votacao', // 'votacao' | 'fim' | 'admin'
        digitos: [],
        chapaSelecionada: null,
        votoConfirmado: false
      };
  
      this.domElements = {
        digito1: document.getElementById('digito1'),
        digito2: document.getElementById('digito2'),
        candidateName: document.getElementById('candidate-name'),
        viceName: document.getElementById('vice-name'),
        chapaName: document.getElementById('chapa-name'),
        modalConfirmacao: document.getElementById('modal-confirmacao'),
        modalNumero: document.getElementById('modal-numero'),
        modalChapa: document.getElementById('modal-chapa'),
        modalPresidente: document.getElementById('modal-presidente'),
        btnConfirmarVoto: document.getElementById('btn-confirmar-voto'),
        btnCorrigirVoto: document.getElementById('btn-corrigir-voto'),
        adminModal: document.getElementById('admin-modal'),
        adminPassword: document.getElementById('admin-password'),
        btnAdminSubmit: document.getElementById('btn-admin-submit')
      };
  
      this.init();
    }
  
    init() {
      this.loadChapas();
      this.setupEventListeners();
      this.updateUI();
  
      if (!StorageManager.obterChapas().length) {
        this.carregarDadosTeste();
      }
    }
  
    loadChapas() {
      this.chapas = StorageManager.obterChapas();
      this.votos = StorageManager.obterVotos() || { chapas: {}, brancos: 0, nulos: 0 };
    }
  
    setupEventListeners() {
      document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  
      document.querySelectorAll('.urna-key[data-value]').forEach(btn => {
        btn.addEventListener('click', () => this.adicionarDigito(btn.dataset.value));
      });
  
      document.querySelector('[data-action="branco"]').addEventListener('click', () => this.votarBranco());
      document.querySelector('[data-action="corrige"]').addEventListener('click', () => this.corrigir());
      document.querySelector('[data-action="confirma"]').addEventListener('click', () => this.confirmarVoto());
  
      this.domElements.btnConfirmarVoto.addEventListener('click', () => this.finalizarVoto());
      this.domElements.btnCorrigirVoto.addEventListener('click', () => this.fecharModalConfirmacao());
  
      if (this.domElements.adminModal) {
        document.getElementById('myBtn')?.addEventListener('click', () => {
          this.domElements.adminModal.style.display = 'flex';
          this.domElements.adminPassword.focus();
        });
  
        this.domElements.btnAdminSubmit.addEventListener('click', () => this.acessarAdmin());
        document.querySelector('.urna-close-modal')?.addEventListener('click', () => {
          this.domElements.adminModal.style.display = 'none';
        });
      }
    }
  
    handleKeyPress(e) {
      if (this.state.currentScreen !== 'votacao') return;
  
      if (e.key >= '0' && e.key <= '9') {
        this.adicionarDigito(e.key);
      } else if (e.key === 'Enter') {
        this.confirmarVoto();
      } else if (e.key.toLowerCase() === 'c') {
        this.corrigir();
      } else if (e.key === '-' || e.key.toLowerCase() === 'b') {
        this.votarBranco();
      } else if (e.key === '*') {
        this.domElements.adminModal.style.display = 'flex';
        this.domElements.adminPassword.focus();
      }
    }
  
    adicionarDigito(digito) {
      if (this.state.digitos.length < 2) {
        this.state.digitos.push(digito);
        this.verificarChapa();
        this.updateUI();
      }
    }
  
    verificarChapa() {
      if (this.state.digitos.length === 2) {
        const numeroChapa = this.state.digitos.join('');
        this.state.chapaSelecionada = this.chapas.find(
          chapa => chapa.numero === numeroChapa
        );
      } else {
        this.state.chapaSelecionada = null;
      }
    }
  
    confirmarVoto() {
      if (this.state.digitos.length === 2) {
        if (this.state.chapaSelecionada) {
          this.abrirModalConfirmacao({
            numero: this.state.chapaSelecionada.numero,
            chapa: this.state.chapaSelecionada.nomeChapa,
            presidente: this.state.chapaSelecionada.nomePresidente
          });
        } else {
          this.abrirModalConfirmacao({
            numero: this.state.digitos.join(''),
            chapa: 'VOTO NULO',
            presidente: '---'
          });
        }
      }
    }
  
    abrirModalConfirmacao(dados) {
      this.domElements.modalNumero.textContent = dados.numero;
      this.domElements.modalChapa.textContent = dados.chapa;
      this.domElements.modalPresidente.textContent = dados.presidente;
      this.domElements.modalConfirmacao.style.display = 'flex';
    }
  
    finalizarVoto() {
      const numero = this.domElements.modalNumero.textContent;
      const isNulo = this.domElements.modalChapa.textContent === 'VOTO NULO';
  
      this.registrarVoto(numero, isNulo);
      this.fecharModalConfirmacao();
      this.state.currentScreen = 'fim';
      this.updateUI();
  
      setTimeout(() => {
        this.resetarVotacao();
        this.state.currentScreen = 'votacao';
        this.updateUI();
      }, 3000);
    }
  
    fecharModalConfirmacao() {
      this.domElements.modalConfirmacao.style.display = 'none';
    }
  
    registrarVoto(numero, nulo = false) {
      if (numero === 'branco') {
        this.votos.brancos++;
      } else if (nulo) {
        this.votos.nulos++;
      } else {
        this.votos.chapas[numero] = (this.votos.chapas[numero] || 0) + 1;
      }
  
      StorageManager.salvarVotos(this.votos);
    }
  
    votarBranco() {
      this.state.digitos = [];
      this.state.chapaSelecionada = null;
      this.registrarVoto('branco');
      this.state.currentScreen = 'fim';
      this.updateUI();
  
      setTimeout(() => {
        this.resetarVotacao();
        this.state.currentScreen = 'votacao';
        this.updateUI();
      }, 3000);
    }
  
    corrigir() {
      this.state.digitos = [];
      this.state.chapaSelecionada = null;
      this.updateUI();
    }
  
    acessarAdmin() {
      const senha = this.domElements.adminPassword.value;
      if (senha === 'admin123') {
        this.state.currentScreen = 'admin';
        this.updateUI();
        this.domElements.adminModal.style.display = 'none';
      } else {
        alert('Senha incorreta!');
      }
    }
  
    updateUI() {
      this.domElements.digito1.value = this.state.digitos[0] || '';
      this.domElements.digito2.value = this.state.digitos[1] || '';
  
      if (this.state.chapaSelecionada) {
        this.domElements.candidateName.textContent = this.state.chapaSelecionada.nomePresidente;
        this.domElements.viceName.textContent = this.state.chapaSelecionada.nomeVice;
        this.domElements.chapaName.textContent = this.state.chapaSelecionada.nomeChapa;
      } else {
        if (this.state.digitos.length === 2) {
          this.domElements.candidateName.textContent = 'NÃO ENCONTRADA';
          this.domElements.viceName.textContent = '---';
          this.domElements.chapaName.textContent = 'VOTO NULO';
        } else {
          this.domElements.candidateName.textContent = '---';
          this.domElements.viceName.textContent = '---';
          this.domElements.chapaName.textContent = '---';
        }
      }
  
      document.querySelectorAll('[data-screen-element]').forEach(el => {
        el.style.display = 'none';
      });
  
      const currentScreen = document.querySelector(
        `[data-screen-element="${this.state.currentScreen}"]`
      );
      if (currentScreen) currentScreen.style.display = 'block';
    }
  
    resetarVotacao() {
      this.state.digitos = [];
      this.state.chapaSelecionada = null;
      this.state.votoConfirmado = false;
    }
  
    carregarDadosTeste() {
      const chapasTeste = [
        {
          numero: '12',
          nomePresidente: 'Fulano da Silva',
          nomeVice: 'Beltrano Souza',
          nomeChapa: 'Chapa Renovação'
        },
        {
          numero: '15',
          nomePresidente: 'Ciclano Oliveira',
          nomeVice: 'Deltano Costa',
          nomeChapa: 'Chapa União'
        }
      ];
  
      StorageManager.salvarChapas(chapasTeste);
      this.chapas = chapasTeste;
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    window.urna = new UrnaEletronica();
  });
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UrnaEletronica;
  }