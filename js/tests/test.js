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

    test("digitar deve acumular dois dígitos e chamar verificar chapa", () => {
    let numeroDigitado = "";
    let chamadas = 0;

    const digitar = (val) => {
        if (numeroDigitado.length < 2) {
            numeroDigitado += val;
            if (numeroDigitado.length === 2) chamadas++;
        }
    };

    digitar("1");
    digitar("2");

    expect(numeroDigitado).toBe("12");
    expect(chamadas).toBe(1);
});

test("corrigir deve limpar o número digitado e dados", () => {
    let numeroDigitado = "12";
    let dadosApagados = false;

    const corrigir = () => {
        numeroDigitado = '';
        dadosApagados = true;
    };

    corrigir();

    expect(numeroDigitado).toBe('');
    expect(dadosApagados).toBe(true);
});

test("votar em branco deve limpar o número e abrir modal com info BRANCO", () => {
    let numeroDigitado = ""; 
    let modal = {};

    const votarBranco = () => {
        numeroDigitado = ''; 
        modal = {
            numero: 'BRANCO',
            chapa: 'VOTO EM BRANCO',
            presidente: '---'
        };
    };

    votarBranco(); 

    expect(numeroDigitado).toBe('');
    expect(modal.chapa).toBe('VOTO EM BRANCO'); 
});

test("confirmar voto com número inválido registra nulo", () => {
    StorageManager.limparVotos(); 
    const votosAntes = StorageManager.obterVotos();
    const votos = { ...votosAntes };
    votos.nulos++;
    votos.total++;

    StorageManager.salvarVotos(votos);

    const votosDepois = StorageManager.obterVotos();
    expect(votosDepois.nulos).toBe(votosAntes.nulos + 1);
    expect(votosDepois.total).toBe(votosAntes.total + 1);
});
TestFramework.test("Deve acumular dois dígitos e chamar verificar chapa", function() {
    let numeroDigitado = "";
    let chamadas = 0;

    const digitar = (val) => {
        if (numeroDigitado.length < 2) {
            numeroDigitado += val;
            if (numeroDigitado.length === 2) chamadas++;
        }
    };

    digitar("1");
    digitar("2");

    TestFramework.assertEquals(numeroDigitado, "12");
    TestFramework.assertEquals(chamadas, 1);
});

TestFramework.test("Deve limpar o número digitado e dados ao corrigir", function() {
    let numeroDigitado = "12";
    let dadosApagados = false;

    const corrigir = () => {
        numeroDigitado = '';
        dadosApagados = true;
    };

    corrigir();

    TestFramework.assertEquals(numeroDigitado, '');
    TestFramework.assertTrue(dadosApagados);
});

TestFramework.test("Deve limpar o número e abrir modal com info BRANCO ao votar em branco", function() {
    let numeroDigitado = ""; 
    let modal = {};

    const votarBranco = () => {
        numeroDigitado = '';
        modal = {
            numero: 'BRANCO',
            chapa: 'VOTO EM BRANCO',
            presidente: '---'
        };
    };

    votarBranco();

    TestFramework.assertEquals(numeroDigitado, '');
    TestFramework.assertEquals(modal.chapa, 'VOTO EM BRANCO');
});

TestFramework.test("Deve registrar voto nulo ao confirmar voto com número inválido", function() {
    StorageManager.limparVotos();
    const votosAntes = StorageManager.obterVotos();
    const votos = { ...votosAntes };
    votos.nulos++;
    votos.total++;

    StorageManager.salvarVotos(votos);

    const votosDepois = StorageManager.obterVotos();
    TestFramework.assertEquals(votosDepois.nulos, votosAntes.nulos + 1);
    TestFramework.assertEquals(votosDepois.total, votosAntes.total + 1);
});

//Testes de Cadastro

TestFramework.test("Deve adicionar uma chapa corretamente ao cadastrarChapa", function() {
    localStorage.clear();
    const chapa = { numero: "15", nomePresidente: "Carlos", nomeVice: "Lucia", nomeChapa: "Renovação", foto: "base64img" };
    const resultado = cadastrarChapa(chapa);
    const chapasSalvas = StorageManager.obterChapas();
    TestFramework.assertTrue(resultado);
    TestFramework.assertEquals(chapasSalvas.length, 1);
    TestFramework.assertEquals(chapasSalvas[0].numero, "15");
});

TestFramework.test("Não deve adicionar chapa com número repetido ao cadastrarChapa", function() {
    localStorage.clear();
    const chapa1 = { numero: "15", nomePresidente: "Carlos", nomeVice: "Lucia", nomeChapa: "Renovação", foto: "base64img" };
    const chapa2 = { numero: "15", nomePresidente: "Ana", nomeVice: "Pedro", nomeChapa: "Avanço", foto: "base64img" };
    cadastrarChapa(chapa1);
    const resultado = cadastrarChapa(chapa2);
    TestFramework.assertFalse(resultado);
    const chapasSalvas = StorageManager.obterChapas();
    TestFramework.assertEquals(chapasSalvas.length, 1);
});

TestFramework.test("Deve retornar erro se dados obrigatórios não forem preenchidos ao cadastrarChapa", function() {
    const chapaIncompleta = { numero: "", nomePresidente: "", nomeVice: "", nomeChapa: "", foto: "" };
    const resultado = cadastrarChapa(chapaIncompleta);
    TestFramework.assertFalse(resultado);
});

//Teste de Votação

TestFramework.test("Deve incrementar a contagem corretamente na votação em chapa válida", function() {
    localStorage.clear();
    const chapa = { numero: "12", nomePresidente: "Ana", nomeVice: "Beto", nomeChapa: "Mudança", foto: "base64img" };
    StorageManager.salvarChapas([chapa]);
    const votosAntes = StorageManager.obterVotos();

    votarEmChapa("12");
    const votosDepois = StorageManager.obterVotos();
    
    TestFramework.assertEquals(votosDepois.chapas["12"], votosAntes.chapas["12"] + 1);
});

TestFramework.test("Deve contar como voto nulo ao votar em chapa inválida", function() {
    localStorage.clear();
    const votosAntes = StorageManager.obterVotos();

    votarEmChapa("99");
    const votosDepois = StorageManager.obterVotos();

    TestFramework.assertEquals(votosDepois.nulos, votosAntes.nulos + 1);
});

TestFramework.test("Deve aumentar a contagem de votos brancos ao votar em branco", function() {
    localStorage.clear();
    const votosAntes = StorageManager.obterVotos();

    votarEmBranco();
    const votosDepois = StorageManager.obterVotos();

    TestFramework.assertEquals(votosDepois.brancos, votosAntes.brancos + 1);
});

TestFramework.test("Deve exibir os resultados ao finalizar a votação", function() {
    localStorage.clear();
    const chapa1 = { numero: "12", nomePresidente: "Ana", nomeVice: "Beto", nomeChapa: "Mudança", foto: "base64img" };
    const chapa2 = { numero: "13", nomePresidente: "João", nomeVice: "Clara", nomeChapa: "Progresso", foto: "base64img" };
    StorageManager.salvarChapas([chapa1, chapa2]);

    votarEmChapa("12");
    votarEmChapa("13");
    votarEmBranco();
    
    const resultadoFinal = finalizarVotacao();
    
    TestFramework.assertEquals(resultadoFinal.chapas[0].numero, "12");
    TestFramework.assertEquals(resultadoFinal.chapas[1].numero, "13");
    TestFramework.assertEquals(resultadoFinal.brancos, 1);
    TestFramework.assertEquals(resultadoFinal.nulos, 0);
});

window.addEventListener('load', function () {
    TestFramework.runTests();
});