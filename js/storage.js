class StorageManager {
    static MAX_CHAPAS = 50;
    static MAX_VOTOS = 1000;

    static obterChapas() {
        try {
            const chapas = localStorage.getItem('chapas');
            return chapas ? JSON.parse(chapas) : [];
        } catch (e) {
            console.error("Erro ao ler chapas:", e);
            return [];
        }
    }

    static salvarChapas(chapas) {
        try {
            const chapasOtimizadas = chapas.map(chapa => ({
                ...chapa,
                foto: chapa.foto ? this.otimizarImagem(chapa.foto) : ''
            }));
            
            if (chapasOtimizadas.length > this.MAX_CHAPAS) {
                alert(`Limite de ${this.MAX_CHAPAS} chapas atingido!`);
                return false;
            }
            
            localStorage.setItem('chapas', JSON.stringify(chapasOtimizadas));
            return true;
        } catch (e) {
            console.error("Erro ao salvar chapas:", e);
            return false;
        }
    }

    static obterVotos() {
        try {
            const votos = localStorage.getItem('votos');
            if (!votos) {
                return {
                    chapas: {},
                    brancos: 0,
                    nulos: 0,
                    total: 0
                };
            }
            return JSON.parse(votos);
        } catch (e) {
            console.error("Erro ao ler votos:", e);
            return {
                chapas: {},
                brancos: 0,
                nulos: 0,
                total: 0
            };
        }
    }

    static salvarVotos(votos) {
        try {
            if (votos.total > this.MAX_VOTOS) {
                console.warn("Limite de votos atingido. Reiniciando contagem.");
                votos = {
                    chapas: {},
                    brancos: 0,
                    nulos: 0,
                    total: 0
                };
            }
            
            localStorage.setItem('votos', JSON.stringify(votos));
            return true;
        } catch (e) {
            console.error("Erro ao salvar votos:", e);
            return false;
        }
    }

    static obterResultados() {
        const votos = this.obterVotos();
        const chapas = this.obterChapas();
        
        const resultados = chapas.map(chapa => ({
            ...chapa,
            votos: votos.chapas[chapa.numero] || 0
        }));
        
        return {
            chapas: resultados.sort((a, b) => b.votos - a.votos),
            brancos: votos.brancos,
            nulos: votos.nulos,
            total: votos.total
        };
    }

    static otimizarImagem(base64) {
        if (base64.length > 50000) {
            return this.criarThumbnail(base64, 150);
        }
        return base64;
    }

    static criarThumbnail(base64, size) {
        return base64;
    }

    static limparVotos() {
        localStorage.removeItem('votos');
    }

    static limparChapas() {
        localStorage.removeItem('chapas');
    }

    static limparTudo() {
        this.limparVotos();
        this.limparChapas();
    }
}

if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}