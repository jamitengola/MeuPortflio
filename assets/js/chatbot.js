// Chatbot Widget Frontend
// Adiciona um botão flutuante e uma janela de chat simples

(function () {
  // Adiciona o CSS do chatbot
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/chatbot.css';
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

  function addMsg(text, from) {
    const div = document.createElement('div');
    div.className = from === 'user' ? 'msg-user' : 'msg-bot';
    div.innerHTML = `<span>${text}</span>`;
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      messages.lastChild.innerHTML = `<span>${data.answer || 'Desculpe, não consegui responder.'}</span>`;
    } catch {
      messages.lastChild.innerHTML = `<span>Erro ao conectar ao assistente.</span>`;
    }
  };
})();
