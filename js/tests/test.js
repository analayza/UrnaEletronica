TestFramework.test("should ", function () {

    TestFramework.assertEquals();
});

// Teste para o localStorage
const StorageManager = window.StorageManager || require('./StorageManager');

TestFramework.test("Deve retornar array vazio ao chamar obterChapas após limpar", function() {
    StorageManager.limparChapas();
    const chapas = StorageManager.obterChapas();
    TestFramework.assertEquals(JSON.stringify(chapas), JSON.stringify([]), "obterChapas não retornou array vazio.");
});

TestFramework.test("Deve salvar chapas corretamente", function() {
    StorageManager.limparChapas();
    const chapas = [
        { numero: "12", nomePresidente: "Ana", nomeVice: "Beto", nomeChapa: "Mudança", foto: "base64img" }
    ];
    const salvo = StorageManager.salvarChapas(chapas);
    const chapasSalvas = StorageManager.obterChapas();
    TestFramework.assertTrue(salvo && chapasSalvas.length === 1, "salvarChapas não salvou corretamente.");
});

TestFramework.test("Deve impedir salvar mais de 50 chapas", function() {
    StorageManager.limparChapas();
    const chapas = Array.from({ length: 51 }, (_, i) => ({
        numero: i.toString().padStart(2, '0'),
        nomePresidente: `P${i}`,
        nomeVice: `V${i}`,
        nomeChapa: `Chapa ${i}`,
        foto: ""
    }));
    const salvo = StorageManager.salvarChapas(chapas);
    TestFramework.assertFalse(salvo, "salvarChapas não impediu salvar mais de 50 chapas.");
});

TestFramework.test("Deve retornar estrutura padrão ao chamar obterVotos após limpar", function() {
    StorageManager.limparVotos();
    const votos = StorageManager.obterVotos();
    TestFramework.assertEquals(JSON.stringify(votos), JSON.stringify({
        chapas: {},
        brancos: 0,
        nulos: 0,
        total: 0
    }), "obterVotos não retornou estrutura padrão.");
});

TestFramework.test("Deve salvar votos corretamente", function() {
    StorageManager.limparVotos();
    const votos = {
        chapas: { "12": 500 },
        brancos: 10,
        nulos: 5,
        total: 516
    };
    const salvo = StorageManager.salvarVotos(votos);
    const votosSalvos = StorageManager.obterVotos();
    TestFramework.assertTrue(salvo && votosSalvos.total === 516, "salvarVotos não salvou corretamente.");
});

TestFramework.test("Deve respeitar limite de total de votos ao salvar", function() {
    const votos = {
        chapas: { "12": 500 },
        brancos: 10,
        nulos: 5,
        total: 1001
    };
    StorageManager.salvarVotos(votos);
    const votosDepois = StorageManager.obterVotos();
    TestFramework.assertEquals(votosDepois.total, 0, "salvarVotos não respeitou limite de votos.");
});

TestFramework.test("Deve retornar resultados corretos ao chamar obterResultados", function() {
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
    TestFramework.assertTrue(
        resultados.total === 28 && resultados.chapas[0].numero === "13" && resultados.chapas[1].numero === "12",
        "obterResultados não retornou votos corretos."
    );
});

//Testes para opções de votações na urna 


window.addEventListener('load', function () {
    TestFramework.runTests();
});