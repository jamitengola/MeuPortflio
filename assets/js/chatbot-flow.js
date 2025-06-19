// Chatbot com diagnóstico prévio e encaminhamento para e-mail e WhatsApp
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

  // Lógica de fluxo
  const form = box.querySelector('#chatbot-form');
  const input = box.querySelector('#chatbot-input');
  const messages = box.querySelector('#chatbot-messages');

  // Estado do diagnóstico
  let step = 0;
  let nome = '';
  let email = '';
  let tipo = '';
  let resumo = '';

  function addMsg(text, from) {
    const div = document.createElement('div');
    div.className = from === 'user' ? 'msg-user' : 'msg-bot';
    div.innerHTML = `<span>${text}</span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function resetFlow() {
    step = 0; nome = ''; email = ''; tipo = ''; resumo = '';
    messages.innerHTML = '';
    addMsg('Olá! Sou o assistente virtual do portfólio Jamite. Posso te ajudar a entender meus serviços, formas de contato ou fazer um diagnóstico prévio da sua necessidade. Vamos começar! Qual seu nome?', 'bot');
  }

  // Inicia o fluxo ao abrir
  btn.addEventListener('click', resetFlow);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMsg(msg, 'user');
    input.value = '';

    if (step === 0) {
      nome = msg;
      addMsg('Ótimo, ' + nome + '! Qual seu e-mail?', 'bot');
      step = 1;
      return;
    }
    if (step === 1) {
      email = msg;
      addMsg('Agora, qual o tipo de solicitação? (ex: orçamento, dúvida, parceria, outro)', 'bot');
      step = 2;
      return;
    }
    if (step === 2) {
      tipo = msg;
      addMsg('Descreva brevemente sua necessidade ou dúvida:', 'bot');
      step = 3;
      return;
    }
    if (step === 3) {
      resumo = msg;
      addMsg('Resumo do seu pedido:\nNome: ' + nome + '\nE-mail: ' + email + '\nTipo: ' + tipo + '\nMensagem: ' + resumo, 'bot');
      addMsg('Como deseja enviar sua solicitação? Escolha uma opção abaixo:', 'bot');
      // Botões para e-mail e WhatsApp
      const optDiv = document.createElement('div');
      optDiv.style = 'margin: 12px 0; text-align:center;';
      optDiv.innerHTML = `
        <button id="enviar-email" style="margin:0 8px;padding:8px 18px;background:#25D366;color:#fff;border:none;border-radius:8px;cursor:pointer;">Enviar por E-mail</button>
        <button id="enviar-whatsapp" style="margin:0 8px;padding:8px 18px;background:#075e54;color:#fff;border:none;border-radius:8px;cursor:pointer;">Enviar por WhatsApp</button>
      `;
      messages.appendChild(optDiv);
      messages.scrollTop = messages.scrollHeight;
      document.getElementById('enviar-email').onclick = async function() {
        addMsg('Enviando para o Jamite...', 'bot');
        // Chama backend para enviar e-mail
        try {
          const res = await fetch('/api/diagnostico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, tipo, resumo })
          });
          const data = await res.json();
          if (data.success) {
            addMsg('Sua solicitação foi enviada por e-mail! Em breve entrarei em contato.', 'bot');
          } else {
            addMsg('Houve um erro ao enviar por e-mail.', 'bot');
          }
        } catch {
          addMsg('Erro ao conectar ao servidor.', 'bot');
        }
        step = 4;
      };
      document.getElementById('enviar-whatsapp').onclick = function() {
        const msg = encodeURIComponent('Diagnóstico prévio via portfólio Jamite:%0ANome: ' + nome + '%0AE-mail: ' + email + '%0ATipo: ' + tipo + '%0AMensagem: ' + resumo);
        window.open('https://api.whatsapp.com/send?phone=244924482552&text=' + msg, '_blank');
        addMsg('Cliquei para enviar no WhatsApp!', 'bot');
        step = 4;
      };
      return;
    }
    if (step === 4) {
      addMsg('Se precisar de mais alguma coisa, é só chamar!', 'bot');
      return;
    }
  };
})();
