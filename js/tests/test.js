TestFramework.test("should ", function() {
    
    TestFramework.assertEquals();
});

//Teste para o localStorage
const StorageManager = window.StorageManager || require('./StorageManager');

test("obterChapas deve retornar array vazio se não houver nada salvo", () => {
    StorageManager.limparChapas(); 
    expect(StorageManager.obterChapas()).toEqual([]);
});

test("salvarChapas deve salvar chapas corretamente no localStorage", () => {
    StorageManager.limparChapas(); 
    const chapas = [
        { numero: "12", nomePresidente: "Ana", nomeVice: "Beto", nomeChapa: "Mudança", foto: "base64img" }
    ];
    const salvo = StorageManager.salvarChapas(chapas);
    expect(salvo).toBe(true);
    expect(StorageManager.obterChapas().length).toBe(1);
});

test("salvarChapas deve impedir mais de 50 chapas", () => {
    StorageManager.limparChapas();
    const chapas = Array.from({ length: 51 }, (_, i) => ({
        numero: i.toString().padStart(2, '0'),
        nomePresidente: `P${i}`,
        nomeVice: `V${i}`,
        nomeChapa: `Chapa ${i}`,
        foto: ""
    }));
    const salvo = StorageManager.salvarChapas(chapas);
    expect(salvo).toBe(false);
});

test("obterVotos deve retornar estrutura padrão se vazio", () => {
    StorageManager.limparVotos();
    const votos = StorageManager.obterVotos();
    expect(votos).toEqual({
        chapas: {},
        brancos: 0,
        nulos: 0,
        total: 0
    });
});

test("salvarVotos deve salvar corretamente e respeitar limite", () => {
    StorageManager.limparVotos(); 
    const votos = {
        chapas: { "12": 500 },
        brancos: 10,
        nulos: 5,
        total: 516
    };
    expect(StorageManager.salvarVotos(votos)).toBe(true);
    expect(StorageManager.obterVotos().total).toBe(516);

    votos.total = 1001;
    StorageManager.salvarVotos(votos);
    const reset = StorageManager.obterVotos();
    expect(reset.total).toBe(0);
});

test("obterResultados deve retornar votos corretos para cada chapa", () => {
    StorageManager.limparChapas(); 
    StorageManager.limparVotos(); 
    const chapas = [
        { numero: "12", nomePresidente: "Ana", nomeVice: "Beto", nomeChapa: "Mudança", foto: "" },
        { numero: "13", nomePresidente: "João", nomeVice: "Clara", nomeChapa: "Progresso", foto: "" }
    ];
    const votos = {
        chapas: { "12": 10, "13": 15 },
        brancos: 2,
        nulos: 1,
        total: 28
    };
    StorageManager.salvarChapas(chapas);
    StorageManager.salvarVotos(votos);

    const resultados = StorageManager.obterResultados();
    expect(resultados.total).toBe(28);
    expect(resultados.chapas[0].numero).toBe("13");
    expect(resultados.chapas[1].numero).toBe("12");
});

window.addEventListener('load', function() {
    TestFramework.runTests();
});