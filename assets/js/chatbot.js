// Portfolio integrations: visual layer, Bug Hunter and accessible assistant.
(function () {
  const version = '20260712-portfolio-v3';
  const addStylesheet = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${href}?v=${version}`;
    document.head.appendChild(link);
  };
  const addScript = (src) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${version}`;
    script.defer = true;
    document.head.appendChild(script);
  };

  addStylesheet('assets/css/portfolio-wow.css');
  addScript('assets/js/portfolio-wow.js');
  addStylesheet('assets/css/portfolio-bug-hunter.css');
  addScript('assets/js/portfolio-bug-hunter.js');
  addStylesheet('assets/css/chatbot.css');

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const button = document.createElement('button');
  button.id = 'chatbot-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Abrir assistente virtual');
  button.innerHTML = '<i class="bi bi-chat-dots"></i>';
  document.body.appendChild(button);

  const box = document.createElement('section');
  box.id = 'chatbot-box';
  box.setAttribute('aria-label', 'Assistente virtual do portfólio');
  box.innerHTML = `
    <div class="chatbot-header">
      <div><strong>Assistente de Jamite</strong><small>Projetos, stack e contacto</small></div>
      <button id="chatbot-close" type="button" aria-label="Fechar assistente">&times;</button>
    </div>
    <div id="chatbot-messages" aria-live="polite"></div>
    <form id="chatbot-form">
      <input id="chatbot-input" type="text" placeholder="Pergunte sobre projetos ou experiência..." autocomplete="off" aria-label="Mensagem" />
      <button type="submit" aria-label="Enviar mensagem"><i class="bi bi-arrow-up"></i></button>
    </form>`;
  document.body.appendChild(box);

  const closeButton = box.querySelector('#chatbot-close');
  const form = box.querySelector('#chatbot-form');
  const input = box.querySelector('#chatbot-input');
  const messages = box.querySelector('#chatbot-messages');

  const addMessage = (text, from, loading = false) => {
    const item = document.createElement('div');
    item.className = from === 'user' ? 'msg-user' : 'msg-bot';
    if (loading) item.dataset.loading = 'true';
    item.innerHTML = `<span>${escapeHtml(text).replaceAll('\n', '<br>')}</span>`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  };

  let greeted = false;
  const open = () => {
    box.style.display = 'flex';
    button.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      addMessage('Olá! Posso explicar a experiência do Jamite, os projetos em destaque, a stack técnica ou indicar o melhor contacto.', 'bot');
    }
    window.setTimeout(() => input.focus(), 80);
  };
  const close = () => {
    box.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');
  };

  button.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && box.style.display === 'flex') close();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    input.disabled = true;
    const loading = addMessage('A analisar...', 'bot', true);

    try {
      const response = await fetch('https://chatbackend-d7ceb2fpf0cnetdm.eastus-01.azurewebsites.net/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      loading.innerHTML = `<span>${escapeHtml(data.answer || 'Não consegui responder neste momento.').replaceAll('\n', '<br>')}</span>`;
      delete loading.dataset.loading;
    } catch (error) {
      loading.innerHTML = '<span>Não foi possível ligar ao assistente. Pode contactar o Jamite pelo WhatsApp ou e-mail.</span>';
      delete loading.dataset.loading;
      console.warn('Chat assistant unavailable:', error);
    } finally {
      input.disabled = false;
      input.focus();
    }
  });
})();
