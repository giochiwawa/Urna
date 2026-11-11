/* =========================================
   URNA ELETRÔNICA ESCOLAR
   Sistema de votação demonstrativo
========================================= */

// 1. CADASTRO DOS CANDIDATOS
// Os números e nomes abaixo são exemplos.
// Você pode alterar conforme sua eleição.

const candidatos = [
    {
        numero: "10",
        nome: "Candidato 1",
        partido: "Partido Azul",
        votos: 0
    },
    {
        numero: "20",
        nome: "Candidato 2",
        partido: "Partido Verde",
        votos: 0
    },
    {
        numero: "30",
        nome: "Candidato 3",
        partido: "Partido Amarelo",
        votos: 0
    }
];

// 2. VARIÁVEIS DO SISTEMA

let numeroDigitado = "";
let candidatoSelecionado = null;
let votosBrancos = 0;
let votosNulos = 0;
let votacaoEncerrada = false;

// 3. CAPTURAR ELEMENTOS DO HTML

const digito1 = document.getElementById("digito1");
const digito2 = document.getElementById("digito2");

const areaCandidato = document.getElementById("candidato");
const mensagem = document.getElementById("mensagem");

const btnBranco = document.getElementById("btnBranco");
const btnCorrige = document.getElementById("btnCorrige");
const btnConfirma = document.getElementById("btnConfirma");
const btnResultado = document.getElementById("btnResultado");

// 4. VERIFICAR SE OS ELEMENTOS EXISTEM

if (
    !digito1 ||
    !digito2 ||
    !areaCandidato ||
    !mensagem ||
    !btnBranco ||
    !btnCorrige ||
    !btnConfirma ||
    !btnResultado
) {
    throw new Error(
        "Confira os IDs dos elementos no arquivo HTML."
    );
}

// 5. ATUALIZAR A TELA

function atualizarTela() {
    digito1.value = numeroDigitado[0] || "";
    digito2.value = numeroDigitado[1] || "";
}

// 6. MOSTRAR MENSAGENS

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}

// 7. DIGITAR OS NÚMEROS

function digitarNumero(numero) {

    if (votacaoEncerrada) {
        mostrarMensagem("A votação foi encerrada.");
        return;
    }

    if (numeroDigitado.length >= 2) {
        mostrarMensagem("Você já digitou dois números.");
        return;
    }

    numeroDigitado += numero;

    atualizarTela();

    // Quando completar dois números, procura o candidato.
    if (numeroDigitado.length === 2) {
        procurarCandidato();
    } else {
        mostrarMensagem("Digite o próximo número.");
    }
}

// 8. PROCURAR CANDIDATO

function procurarCandidato() {

    candidatoSelecionado = candidatos.find(
        candidato => candidato.numero === numeroDigitado
    );

    if (candidatoSelecionado) {

        areaCandidato.innerHTML = `
            <h3>${candidatoSelecionado.nome}</h3>
            <p>Número: ${candidatoSelecionado.numero}</p>
            <p>${candidatoSelecionado.partido}</p>
        `;

        mostrarMensagem("Confira seu candidato e confirme o voto.");

    } else {

        candidatoSelecionado = null;

        areaCandidato.innerHTML = `
            <h3>VOTO NULO</h3>
            <p>Número não encontrado.</p>
        `;

        mostrarMensagem("Número inválido. Você pode corrigir ou confirmar.");
    }
}

// 9. VOTO EM BRANCO

function votarEmBranco() {

    if (votacaoEncerrada) return;

    numeroDigitado = "";
    candidatoSelecionado = null;

    atualizarTela();

    areaCandidato.innerHTML = `
        <h3>VOTO EM BRANCO</h3>
        <p>Você escolheu votar em branco.</p>
    `;

    mostrarMensagem("Clique em CONFIRMA para registrar o voto.");
    
    // Identifica a intenção de voto em branco.
    candidatoSelecionado = "BRANCO";
}

// 10. CORRIGIR VOTO

function corrigirVoto() {

    if (votacaoEncerrada) return;

    numeroDigitado = "";
    candidatoSelecionado = null;

    atualizarTela();

    areaCandidato.innerHTML = `
        <h3>VOTO</h3>
        <p>Digite novamente o número do candidato.</p>
    `;

    mostrarMensagem("Voto corrigido. Digite novamente.");
}

// 11. CONFIRMAR VOTO

function confirmarVoto() {

    if (votacaoEncerrada) {
        mostrarMensagem("A votação foi encerrada.");
        return;
    }

    if (candidatoSelecionado === null) {
        mostrarMensagem("Digite um número ou escolha BRANCO.");
        return;
    }

    // Registra o voto em branco.
    if (candidatoSelecionado === "BRANCO") {

        votosBrancos++;

    }

    // Registra o voto do candidato.
    else if (candidatoSelecionado) {

        candidatoSelecionado.votos++;

    }

    // Número inexistente representa voto nulo.
    else {

        votosNulos++;

    }

    mostrarMensagem("VOTO CONFIRMADO! Obrigado por votar.");

    // Limpa os dados para o próximo eleitor.
    numeroDigitado = "";
    candidatoSelecionado = null;

    atualizarTela();

    areaCandidato.innerHTML = `
        <h3>FIM</h3>
        <p>Seu voto foi registrado.</p>
    `;
}

// 12. MOSTRAR RESULTADO DA VOTAÇÃO

function mostrarResultado() {

    const totalVotos = candidatos.reduce(
        (total, candidato) => total + candidato.votos,
        0
    ) + votosBrancos + votosNulos;

    let resultado = `
        <h2>RESULTADO DA VOTAÇÃO</h2>
        <p>Total de votos: ${totalVotos}</p>
    `;

    candidatos.forEach(candidato => {

        resultado += `
            <p>
                ${candidato.nome} (${candidato.numero}):
                ${candidato.votos} votos
            </p>
        `;

    });

    resultado += `
        <p>Votos brancos: ${votosBrancos}</p>
        <p>Votos nulos: ${votosNulos}</p>
    `;

    areaCandidato.innerHTML = resultado;

    mostrarMensagem("Resultado atualizado.");
}

// 13. CONECTAR OS BOTÕES DO TECLADO

document.querySelectorAll("[data-numero]").forEach(botao => {

    botao.addEventListener("click", () => {

        const numero = botao.dataset.numero;

        digitarNumero(numero);

    });

});

// 14. CONECTAR OS BOTÕES DE AÇÃO

btnBranco.addEventListener("click", votarEmBranco);

btnCorrige.addEventListener("click", corrigirVoto);

btnConfirma.addEventListener("click", confirmarVoto);

btnResultado.addEventListener("click", mostrarResultado);

// 15. INICIALIZAÇÃO

atualizarTela();

areaCandidato.innerHTML = `
    <h3>SEJA BEM-VINDO!</h3>
    <p>Digite o número do seu candidato.</p>
`;

mostrarMensagem("Aguardando votação.");
