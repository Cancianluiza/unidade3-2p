// Banco de dados dos exemplos do Simulador
const dadosMensagens = [
    {
        id: 1,
        origem: "SMS - Banco Alerta",
        texto: "Sua compra de R$53.000 foi aprovada. Se voce nao reconhece, clique no link abaixo para cancelar: bit.ly/banco-seguro-cancelar",
        eGolpe: true,
        explicacao: "É GOLPE! Bancos reais não usam encurtadores de links como 'bit.ly' e nem mandam mensagens desesperadoras com valores altos para te assustar."
    },
    {
        id: 2,
        origem: "WhatsApp - Sorteio Pix",
        texto: "Parabens! Voce ganhou R$2.000 no Pix da virada. Resgate clicando no link abaixo imediatamente: www.pix-gratis-ganhar.net",
        eGolpe: true,
        explicacao: "É GOLPE! O Banco Central não faz sorteios de Pix por mensagens e links terminados em '.net' desconhecidos são criados para roubar dados."
    }
];

// ---- FUNCIONALIDADE: SIMULADOR ----
function carregarSimulador() {
    const container = document.getElementById('simulator-container');
    if(!container) return;
    
    dadosMensagens.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message-box';
        msgDiv.innerHTML = `
            <strong>📱 ${msg.origem}</strong>
            <p class="message-text">"${msg.texto}"</p>
            <div class="actions">
                <button class="btn-danger" onclick="verificarResposta(${msg.id}, true)">Acho que é Golpe 🚨</button>
                <button class="btn-success" onclick="verificarResposta(${msg.id}, false)">Acho que é Seguro ✅</button>
            </div>
            <div id="feedback-${msg.id}" class="feedback"></div>
        `;
        container.appendChild(msgDiv);
    });
}

function verificarResposta(id, escolheuGolpe) {
    const mensagem = dadosMensagens.find(m => m.id === id);
    const feedbackDiv = document.getElementById(`feedback-${id}`);
    
    feedbackDiv.style.display = "block";
    if (mensagem.eGolpe === escolheuGolpe) {
        feedbackDiv.className = "feedback correto";
        feedbackDiv.innerHTML = `🎉 <strong>Você acertou!</strong> ${mensagem.explicacao}`;
    } else {
        feedbackDiv.className = "feedback errado";
        feedbackDiv.innerHTML = `⚠️ <strong>Cuidado...</strong> ${mensagem.explicacao}`;
    }
}

// ---- FUNCIONALIDADE: CONTROLE DE TAMANHO DE FONTE ----
let fSize = 16;
document.getElementById('btn-increase').addEventListener('click', () => {
    if (fSize < 24) { fSize += 2; document.documentElement.style.fontSize = fSize + 'px'; }
});
document.getElementById('btn-decrease').addEventListener('click', () => {
    if (fSize > 12) { fSize -= 2; document.documentElement.style.fontSize = fSize + 'px'; }
});

// ---- FUNCIONALIDADE: OUVIR PÁGINA (PLAY/PAUSE/RESUME) ----
const btnTTS = document.getElementById('btn-tts');
let ttsUtterance = null;

btnTTS.addEventListener('click', () => {
    // 1. Se está falando no momento, faz a pausa
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        btnTTS.innerText = "▶️"; // Altera o ícone para "Continuar"
        btnTTS.title = "Continuar leitura";
        return;
    }

    // 2. Se já estava pausado, continua de onde parou
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        btnTTS.innerText = "⏸️"; // Altera o ícone para "Pausar"
        btnTTS.title = "Pausar leitura";
        return;
    }

    // 3. Se não iniciou nada, cria a nova leitura do texto da página
    const textoParaLer = document.getElementById('conteudo-leitura').innerText;
    ttsUtterance = new SpeechSynthesisUtterance(textoParaLer);
    ttsUtterance.lang = 'pt-BR';
    ttsUtterance.rate = 1.1; // Velocidade levemente ajustada

    // Evento disparado quando a leitura chega ao fim por completo
    ttsUtterance.onend = () => {
        btnTTS.innerText = "🔊";
        btnTTS.title = "Ouvir Página";
    };

    window.speechSynthesis.speak(ttsUtterance);
    btnTTS.innerText = "⏸️";
    btnTTS.title = "Pausar leitura";
});

// Inicialização segura do projeto
window.onload = carregarSimulador;