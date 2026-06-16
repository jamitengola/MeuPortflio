// Chatbot Widget Frontend
// Adiciona um botão flutuante, uma janela de chat simples e as camadas interativas do portfólio.

(function () {
  const version = '20260616-race-pro2';

  // Carrega a camada visual/interativa do portfólio sem alterar o template base.
  const wowCss = document.createElement('link');
  wowCss.rel = 'stylesheet';
  wowCss.href = `assets/css/portfolio-wow.css?v=${version}`;
  document.head.appendChild(wowCss);

  const wowScript = document.createElement('script');
  wowScript.src = `assets/js/portfolio-wow.js?v=${version}`;
  wowScript.defer = true;
  document.head.appendChild(wowScript);

  // Carrega a Corrida Digital Pro como experiência expansível dentro da home.
  const gameCss = document.createElement('link');
  gameCss.rel = 'stylesheet';
  gameCss.href = `assets/css/portfolio-game.css?v=${version}`;
  document.head.appendChild(gameCss);

  const raceProCss = document.createElement('link');
  raceProCss.rel = 'stylesheet';
  raceProCss.href = `assets/css/portfolio-race-pro.css?v=${version}`;
  document.head.appendChild(raceProCss);

  const raceProScript = document.createElement('script');
  raceProScript.src = `assets/js/portfolio-race-pro.js?v=${version}`;
  raceProScript.defer = true;
  document.head.appendChild(raceProScript);

  const raceLauncherScript = document.createElement('script');
  raceLauncherScript.src = `assets/js/portfolio-race-launcher.js?v=${version}`;
  raceLauncherScript.defer = true;
  document.head.appendChild(raceLauncherScript);

  // Adiciona o CSS do chatbot
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `assets/css/chatbot.css?v=${version}`;
  document.head.appendChild(link);

  // Cria o botão flutuante
  const btn = document.createElement('div');
  btn.id = 'chatbot-btn';
  btn.innerHTML = '<i class="bi bi-chat-dots"></i>';
  document.body.appendChild(btn);

  // Cria a janela do chat
  const box = document.createElement('div');
  box.id = 'chatbot-box';
  box.innerHTML = `
    <div class="chatbot-header">
      <span>Assistente Virtual</span>
      <span id="chatbot-close">&times;</span>
    </div>
    <div id="chatbot-messages"></div>
    <form id="chatbot-form">
      <input id="chatbot-input" type="text" placeholder="Digite sua dúvida..." autocomplete="off" />
      <button type="submit">&#10148;</button>
    </form>
  `;
  document.body.appendChild(box);

  btn.onclick = () => { box.style.display = 'flex'; };
  box.querySelector('#chatbot-close').onclick = () => { box.style.display = 'none'; };

  // Lógica de envio
  const form = box.querySelector('#chatbot-form');
  const input = box.querySelector('#chatbot-input');
  const messages = box.querySelector('#chatbot-messages');

  // Adiciona suporte a Markdown
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(markedScript);

  function addMsg(text, from) {
    const div = document.createElement('div');
    div.className = from === 'user' ? 'msg-user' : 'msg-bot';
    if (from === 'bot' && window.marked) {
      div.innerHTML = `<span>${marked.parse(text)}</span>`;
    } else {
      div.innerHTML = `<span>${text}</span>`;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    input.value = '';
    addMsg('Pensando...', 'bot');
    try {
      const res = await fetch('https://chatbackend-d7ceb2fpf0cnetdm.eastus-01.azurewebsites.net/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      messages.lastChild.innerHTML = `<span>${data.answer || 'Desculpe, não consegui responder.'}</span>`;
    } catch {
      messages.lastChild.innerHTML = '<span>Erro ao conectar ao assistente.</span>';
    }
  };
})();
