// Mini-jogo: Missão Digital — integrado na experiência do portfolio
(function () {
  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    addGameNav();
    addHeroGameCTA();
    mountGame(false);
    bindGameOpeners();
  });

  const missions = [
    {
      title: 'Filas no Centro de Emprego',
      context: 'Um centro recebe muitos candidatos, mas o processo ainda depende de atendimento manual, formulários dispersos e pouca visibilidade operacional.',
      objective: 'Crie uma experiência digital que reduza filas e ajude a equipa a acompanhar candidaturas.',
      correct: ['UX Simples', 'API Segura', 'Base de Dados', 'Dashboard'],
      hint: 'Pensa como alguém que precisa transformar atendimento físico em serviço digital mensurável.'
    },
    {
      title: 'Dados para o Observatório',
      context: 'A direção precisa acompanhar indicadores de emprego, vínculos, desvínculos e formação vindos de várias instituições.',
      objective: 'Monte uma solução de dados confiável para análise e decisão.',
      correct: ['Governança', 'Automação', 'Power BI', 'Qualidade de Dados'],
      hint: 'Aqui o mais importante é transformar dados dispersos em indicadores confiáveis.'
    },
    {
      title: 'Sistema legado sem API',
      context: 'Existe um sistema antigo, importante para a instituição, mas ele não expõe serviços modernos e dificulta integrações com novos portais.',
      objective: 'Escolha uma estratégia segura para modernizar sem destruir o que já funciona.',
      correct: ['Camada API', 'Segurança', 'Documentação', 'Integração'],
      hint: 'Quando o sistema é legado, a melhor saída muitas vezes é criar uma camada moderna por cima.'
    },
    {
      title: 'Produto digital para crescer',
      context: 'Uma empresa quer vender melhor online, captar clientes, receber pagamentos e saber onde os utilizadores abandonam o processo.',
      objective: 'Prepare uma base digital escalável para operação comercial.',
      correct: ['Next.js', 'Backend', 'Pagamentos', 'Observabilidade'],
      hint: 'Produto digital não é só interface bonita: precisa vender, medir e escalar.'
    }
  ];

  const options = [
    { name: 'UX Simples', desc: 'Fluxo claro para o utilizador' },
    { name: 'API Segura', desc: 'Serviços protegidos e integráveis' },
    { name: 'Base de Dados', desc: 'Modelo consistente e auditável' },
    { name: 'Dashboard', desc: 'Indicadores para decisão' },
    { name: 'Governança', desc: 'Regras, responsabilidade e controlo' },
    { name: 'Automação', desc: 'Menos tarefas manuais' },
    { name: 'Power BI', desc: 'Visualização executiva' },
    { name: 'Qualidade de Dados', desc: 'Validação e confiança' },
    { name: 'Camada API', desc: 'Modernização sem ruptura' },
    { name: 'Segurança', desc: 'Acessos e proteção' },
    { name: 'Documentação', desc: 'Clareza para manutenção' },
    { name: 'Integração', desc: 'Sistemas a conversar' },
    { name: 'Next.js', desc: 'Frontend moderno e rápido' },
    { name: 'Backend', desc: 'Regras de negócio' },
    { name: 'Pagamentos', desc: 'Conversão comercial' },
    { name: 'Observabilidade', desc: 'Logs, métricas e erros' },
    { name: 'IA', desc: 'Assistência inteligente' },
    { name: 'Docker', desc: 'Ambientes reproduzíveis' }
  ];

  const state = {
    missionIndex: 0,
    selected: [],
    score: 0,
    solved: 0,
    startedAt: Date.now(),
    timer: null
  };

  function addGameNav() {
    const nav = document.querySelector('.nav-box .nav');
    if (!nav || nav.querySelector('[data-game-open]')) return;

    const item = document.createElement('li');
    item.className = 'nav-item';
    item.innerHTML = '<a class="nav-link" href="#missao-digital" data-game-open><i class="bi bi-arrow-right"></i>Jogo</a>';

    const contact = nav.querySelector('a[href="#contact"]')?.closest('li');
    if (contact) nav.insertBefore(item, contact);
    else nav.appendChild(item);
  }

  function addHeroGameCTA() {
    const hero = document.querySelector('#about .col-12, #about .col-xl-10');
    if (!hero || document.querySelector('.game-anchor-button')) return;

    const btn = document.createElement('a');
    btn.href = '#missao-digital';
    btn.className = 'game-anchor-button';
    btn.setAttribute('data-game-open', 'true');
    btn.innerHTML = '<i class="bi bi-controller"></i> Jogar Missão Digital';
    hero.appendChild(btn);
  }

  function bindGameOpeners() {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-game-open], a[href="#missao-digital"]');
      if (!opener) return;
      event.preventDefault();
      mountGame(true);
    });
  }

  function mountGame(shouldScroll) {
    let section = document.querySelector('#missao-digital');

    if (!section) {
      section = createGameSection();
      const stack = document.querySelector('#stack-interativo');
      const portfolio = document.querySelector('#portfolio');
      const services = document.querySelector('#services');
      const main = document.querySelector('main');

      if (stack) stack.insertAdjacentElement('afterend', section);
      else if (portfolio) portfolio.insertAdjacentElement('beforebegin', section);
      else if (services) services.insertAdjacentElement('afterend', section);
      else if (main) main.appendChild(section);
      else document.body.appendChild(section);

      bindGame(section);
      renderMission(section);
      startTimer(section);
    }

    if (shouldScroll) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const shell = section.querySelector('.digital-game-shell');
        shell?.classList.add('game-highlight');
        setTimeout(() => shell?.classList.remove('game-highlight'), 1300);
      }, 80);
    }
  }

  function createGameSection() {
    const section = document.createElement('section');
    section.id = 'missao-digital';
    section.className = 'digital-game-section wow-reveal in-view';
    section.innerHTML = `
      <div class="container">
        <div class="digital-game-shell">
          <div class="digital-game-header">
            <div>
              <span class="digital-game-kicker"><i class="bi bi-controller"></i> Jogo interativo</span>
              <h2>Missão Digital</h2>
              <p>
                Um mini-jogo inspirado na minha área: software, GovTech, dados e transformação digital.
                Resolva missões reais escolhendo as peças certas da solução.
              </p>
            </div>
            <div class="digital-game-scoreboard">
              <div class="game-stat"><span>Pontos</span><strong data-game-score>0</strong></div>
              <div class="game-stat"><span>Missões</span><strong data-game-solved>0/${missions.length}</strong></div>
              <div class="game-stat"><span>Tempo</span><strong data-game-time>00:00</strong></div>
            </div>
          </div>

          <div class="digital-game-body">
            <div class="game-mission-card">
              <div class="game-progress">
                <span data-game-step>Missão 1/${missions.length}</span>
                <div class="game-progress-bar"><span data-game-progress></span></div>
              </div>
              <h3 data-game-title></h3>
              <p data-game-context></p>
              <div class="game-objective">
                <strong>Objetivo:</strong>
                <div data-game-objective></div>
              </div>
              <div class="game-feedback" data-game-feedback>
                Escolha 4 peças para montar a solução. Quanto mais certeiro, maior a pontuação.
              </div>
              <div class="game-final-badge" data-game-final></div>
            </div>

            <div class="game-play-card">
              <h4 class="mb-2">Escolha as peças da solução</h4>
              <p class="text-white-04 mb-3">Clique em até 4 opções. Depois valide a tua arquitetura.</p>
              <div class="game-selected empty" data-game-selected></div>
              <div class="game-options-grid" data-game-options></div>
              <div class="game-actions">
                <button class="game-btn primary" type="button" data-game-check><i class="bi bi-check2-circle"></i> Validar solução</button>
                <button class="game-btn" type="button" data-game-hint><i class="bi bi-lightbulb"></i> Dica</button>
                <button class="game-btn" type="button" data-game-reset><i class="bi bi-arrow-counterclockwise"></i> Reiniciar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  function bindGame(root) {
    root.querySelector('[data-game-check]').addEventListener('click', () => checkMission(root));
    root.querySelector('[data-game-hint]').addEventListener('click', () => showHint(root));
    root.querySelector('[data-game-reset]').addEventListener('click', () => resetGame(root));
  }

  function renderMission(root) {
    const mission = missions[state.missionIndex];
    state.selected = [];

    root.querySelector('[data-game-step]').textContent = `Missão ${state.missionIndex + 1}/${missions.length}`;
    root.querySelector('[data-game-title]').textContent = mission.title;
    root.querySelector('[data-game-context]').textContent = mission.context;
    root.querySelector('[data-game-objective]').textContent = mission.objective;
    root.querySelector('[data-game-progress]').style.width = `${(state.solved / missions.length) * 100}%`;
    root.querySelector('[data-game-feedback]').className = 'game-feedback';
    root.querySelector('[data-game-feedback]').textContent = 'Escolha 4 peças para montar a solução. Quanto mais certeiro, maior a pontuação.';
    root.querySelector('[data-game-final]').className = 'game-final-badge';
    root.querySelector('[data-game-final]').innerHTML = '';

    renderSelected(root);
    renderOptions(root);
    updateStats(root);
  }

  function renderOptions(root) {
    const mission = missions[state.missionIndex];
    const distractors = options.map((item) => item.name).filter((name) => !mission.correct.includes(name));
    const pool = shuffle([...mission.correct, ...shuffle(distractors).slice(0, 8)]).slice(0, 12);

    root.querySelector('[data-game-options]').innerHTML = pool.map((name) => {
      const item = options.find((option) => option.name === name) || { name, desc: 'Peça técnica' };
      const selected = state.selected.includes(name) ? 'selected' : '';
      return `
        <button class="game-option ${selected}" type="button" data-game-option="${escapeAttr(name)}">
          <span>${item.name}</span>
          <small>${item.desc}</small>
        </button>
      `;
    }).join('');

    root.querySelectorAll('[data-game-option]').forEach((btn) => {
      btn.addEventListener('click', () => toggleOption(root, btn.dataset.gameOption));
    });
  }

  function toggleOption(root, name) {
    if (state.selected.includes(name)) {
      state.selected = state.selected.filter((item) => item !== name);
    } else {
      if (state.selected.length >= 4) {
        feedback(root, 'warning', 'Só podes escolher 4 peças. Remove uma para trocar a solução.');
        return;
      }
      state.selected.push(name);
    }

    renderSelected(root);
    root.querySelectorAll('[data-game-option]').forEach((btn) => {
      btn.classList.toggle('selected', state.selected.includes(btn.dataset.gameOption));
    });
  }

  function renderSelected(root) {
    const selected = root.querySelector('[data-game-selected]');
    selected.classList.toggle('empty', state.selected.length === 0);
    selected.innerHTML = state.selected.map((item) => `
      <span class="game-chip">${item}<button type="button" data-remove-option="${escapeAttr(item)}" aria-label="Remover ${escapeAttr(item)}">×</button></span>
    `).join('');

    selected.querySelectorAll('[data-remove-option]').forEach((btn) => {
      btn.addEventListener('click', () => toggleOption(root, btn.dataset.removeOption));
    });
  }

  function checkMission(root) {
    const mission = missions[state.missionIndex];
    if (state.selected.length < 4) {
      feedback(root, 'warning', 'Escolhe 4 peças para validar a solução.');
      return;
    }

    const selected = [...state.selected].sort().join('|');
    const correct = [...mission.correct].sort().join('|');

    if (selected === correct) {
      state.solved += 1;
      const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
      const bonus = Math.max(10, 60 - Math.min(elapsed, 60));
      state.score += 100 + bonus;
      updateStats(root);
      celebrate();

      if (state.solved === missions.length) {
        finishGame(root);
        return;
      }

      feedback(root, 'success', `Boa! Essa arquitetura resolve a missão. +${100 + bonus} pontos.`);
      setTimeout(() => {
        state.missionIndex += 1;
        renderMission(root);
      }, 1300);
    } else {
      const hits = state.selected.filter((item) => mission.correct.includes(item)).length;
      state.score = Math.max(0, state.score - 10);
      updateStats(root);
      feedback(root, 'warning', `Quase lá: acertaste ${hits}/4 peças. Revê a missão e tenta outra combinação.`);
    }
  }

  function showHint(root) {
    const mission = missions[state.missionIndex];
    feedback(root, 'warning', `Dica: ${mission.hint}`);
  }

  function resetGame(root) {
    state.missionIndex = 0;
    state.selected = [];
    state.score = 0;
    state.solved = 0;
    state.startedAt = Date.now();
    startTimer(root);
    renderMission(root);
  }

  function finishGame(root) {
    clearInterval(state.timer);
    const final = root.querySelector('[data-game-final]');
    const elapsed = root.querySelector('[data-game-time]').textContent;
    const badge = state.score >= 430 ? 'Arquiteto Digital Sénior' : state.score >= 380 ? 'Construtor GovTech' : 'Explorador Digital';

    root.querySelector('[data-game-progress]').style.width = '100%';
    feedback(root, 'success', 'Missões concluídas. O visitante acabou de experimentar a forma como o Jamite pensa soluções digitais.');
    final.classList.add('show');
    final.innerHTML = `
      <h4><i class="bi bi-trophy"></i> ${badge}</h4>
      <p class="mb-2">Pontuação final: <strong>${state.score}</strong> pontos em <strong>${elapsed}</strong>.</p>
      <p class="mb-3">Gostaste do desafio? Então imagina transformar um problema real da tua organização num produto digital.</p>
      <a class="game-btn primary" href="https://wa.me/244924482552" target="_blank">Falar com Jamite no WhatsApp</a>
    `;
    celebrate(42);
  }

  function feedback(root, type, message) {
    const el = root.querySelector('[data-game-feedback]');
    el.className = `game-feedback ${type}`;
    el.textContent = message;
  }

  function updateStats(root) {
    root.querySelector('[data-game-score]').textContent = state.score;
    root.querySelector('[data-game-solved]').textContent = `${state.solved}/${missions.length}`;
  }

  function startTimer(root) {
    clearInterval(state.timer);
    const timerEl = root.querySelector('[data-game-time]');
    state.timer = setInterval(() => {
      const total = Math.floor((Date.now() - state.startedAt) / 1000);
      const min = String(Math.floor(total / 60)).padStart(2, '0');
      const sec = String(total % 60).padStart(2, '0');
      timerEl.textContent = `${min}:${sec}`;
    }, 1000);
  }

  function celebrate(count = 22) {
    const colors = ['#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'game-confetti';
      piece.style.background = colors[i % colors.length];
      piece.style.left = `${35 + Math.random() * 30}%`;
      piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 520}px`);
      piece.style.animationDelay = `${Math.random() * 120}ms`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 1200);
    }
  }

  function shuffle(items) {
    return [...items]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  function escapeAttr(value) {
    return String(value).replace(/"/g, '&quot;');
  }
})();
