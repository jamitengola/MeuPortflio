// Corrida Digital — jogo expansível na home do portfólio
(function () {
  const state = {
    mounted: false,
    open: false,
    running: false,
    finished: false,
    paused: false,
    lane: 1,
    targetLane: 1,
    score: 0,
    health: 3,
    distance: 0,
    speed: 4.3,
    spawnTick: 0,
    roadOffset: 0,
    items: [],
    collected: [],
    lastTime: 0,
    raf: null,
    ctx: null,
    canvas: null,
    width: 0,
    height: 0,
    keysBound: false,
    missionIndex: 0
  };

  const missions = [
    {
      name: 'Diagnóstico',
      vision: 'Antes de escrever código, entendo pessoas, dados, regras e o processo real. Boa tecnologia começa com bom diagnóstico.'
    },
    {
      name: 'Arquitetura',
      vision: 'A solução certa junta APIs, segurança, base de dados, integrações e uma experiência simples para o utilizador.'
    },
    {
      name: 'Execução',
      vision: 'Transformo a visão em produto: frontend, backend, dashboards, automação, testes e deploy controlado.'
    },
    {
      name: 'Impacto',
      vision: 'No fim, o que conta é medir: menos filas, mais produtividade, melhores decisões e sistemas que continuam a evoluir.'
    }
  ];

  const powerUps = [
    { label: 'API', icon: '⚙️', points: 14, message: 'API segura: sistemas passam a conversar sem trabalho manual.' },
    { label: 'BI', icon: '📊', points: 16, message: 'Power BI: dados deixam de estar escondidos e viram decisão.' },
    { label: 'IA', icon: '🤖', points: 18, message: 'IA aplicada: automatiza tarefas e acelera análise com propósito.' },
    { label: 'SQL', icon: '🗄️', points: 13, message: 'Base de dados bem modelada: informação confiável e rastreável.' },
    { label: 'UX', icon: '✨', points: 15, message: 'UX simples: menos fricção, mais adesão do utilizador.' },
    { label: 'Docker', icon: '🐳', points: 12, message: 'Docker: deploy mais previsível e ambientes reproduzíveis.' },
    { label: 'Segurança', icon: '🔐', points: 17, message: 'Segurança: proteger acessos é parte da arquitetura, não detalhe final.' },
    { label: 'Next.js', icon: '⚡', points: 14, message: 'Next.js: experiência web rápida, moderna e escalável.' }
  ];

  const blockers = [
    { label: 'Bug', icon: '🐞', damage: 1, message: 'Bug em produção: validação, logs e testes precisam entrar mais cedo.' },
    { label: 'Erro 500', icon: '🔥', damage: 1, message: 'Erro 500: sem observabilidade, resolver problema vira adivinhação.' },
    { label: 'Legado', icon: '🧱', damage: 1, message: 'Sistema legado: modernizar com camada API reduz risco.' },
    { label: 'Dados sujos', icon: '🧹', damage: 1, message: 'Dados sujos: sem qualidade de dados, dashboard bonito engana.' },
    { label: 'Latência', icon: '🐢', damage: 1, message: 'Latência: performance também é experiência do utilizador.' },
    { label: 'SSL', icon: '⚠️', damage: 1, message: 'Falha SSL: confiança digital também depende da infraestrutura.' }
  ];

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    addGameNav();
    addHeroGameCTA();
    bindOpeners();
    redirectOldRouteHash();
  });

  function addGameNav() {
    const nav = document.querySelector('.nav-box .nav');
    if (!nav || nav.querySelector('[data-game-open]')) return;

    const item = document.createElement('li');
    item.className = 'nav-item';
    item.innerHTML = '<a class="nav-link" href="#" data-game-open><i class="bi bi-arrow-right"></i>Jogo</a>';

    const contact = nav.querySelector('a[href="#contact"]')?.closest('li');
    if (contact) nav.insertBefore(item, contact);
    else nav.appendChild(item);
  }

  function addHeroGameCTA() {
    const hero = document.querySelector('#about .col-12, #about .col-xl-10');
    if (!hero || document.querySelector('.game-anchor-button')) return;

    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'game-anchor-button';
    btn.setAttribute('data-game-open', 'true');
    btn.innerHTML = '<i class="bi bi-controller"></i> Jogar Corrida Digital';
    hero.appendChild(btn);
  }

  function redirectOldRouteHash() {
    if (window.location.hash === '#missao-digital') {
      history.replaceState(null, '', window.location.pathname);
      setTimeout(openGame, 350);
    }
  }

  function bindOpeners() {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-game-open], a[href="missao-digital.html"], a[href="#missao-digital"]');
      if (!opener) return;
      event.preventDefault();
      openGame();
    });
  }

  function mountGame() {
    if (state.mounted) return;

    const overlay = document.createElement('div');
    overlay.className = 'digital-race-overlay';
    overlay.id = 'digitalRaceOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="race-shell">
        <div class="race-topbar">
          <div class="race-brand">
            <div class="race-brand-mark">JN</div>
            <div>
              <strong>Corrida Digital</strong>
              <small>Software • GovTech • Dados • IA</small>
            </div>
          </div>
          <div class="race-actions">
            <button type="button" class="race-btn" data-race-pause><i class="bi bi-pause-circle"></i> Pausar</button>
            <button type="button" class="race-btn" data-race-restart><i class="bi bi-arrow-counterclockwise"></i> Reiniciar</button>
            <button type="button" class="race-btn primary" data-race-close><i class="bi bi-x-lg"></i> Fechar</button>
          </div>
        </div>

        <div class="race-body">
          <section class="race-card race-brief">
            <span class="race-kicker"><i class="bi bi-stars"></i> Experiência interativa</span>
            <h2 class="race-title">Acelera a transformação digital</h2>
            <p class="race-text">
              Conduz o carro do Jamite pela estrada da transformação digital. Recolhe boas escolhas técnicas
              e evita problemas que travam projetos reais.
            </p>

            <div class="race-stats">
              <div class="race-stat"><span>Pontos</span><strong data-race-score>0</strong></div>
              <div class="race-stat"><span>Energia</span><strong data-race-health>3</strong></div>
              <div class="race-stat"><span>Velocidade</span><strong data-race-speed>4.3x</strong></div>
            </div>

            <div class="race-progress-wrap">
              <div class="race-progress-top">
                <span data-race-stage>Diagnóstico</span>
                <span data-race-distance>0%</span>
              </div>
              <div class="race-progress"><span data-race-progress></span></div>
            </div>

            <div class="race-vision">
              <h3 data-race-vision-title>Visão técnica por cima da corrida</h3>
              <p data-race-vision-text>
                Usa ← → no teclado ou os botões no telemóvel. Cada tecnologia recolhida revela uma decisão técnica real.
              </p>
              <div class="race-log" data-race-log></div>
            </div>
          </section>

          <section class="race-card race-game">
            <div class="race-hud">
              <div>
                <div class="race-hud-title">Pista GovTech</div>
                <div class="race-hud-help">Recolhe: API, BI, IA, SQL, UX, Segurança. Evita: bugs, legado, dados sujos.</div>
              </div>
              <button type="button" class="race-btn success" data-race-start><i class="bi bi-play-fill"></i> Começar</button>
            </div>

            <div class="race-canvas-wrap">
              <canvas class="digital-race-canvas" data-race-canvas></canvas>
              <div class="race-start-screen" data-race-start-screen>
                <div class="race-start-box">
                  <h2>Pronto para correr?</h2>
                  <p>
                    Este não é só um jogo: é uma metáfora da minha forma de trabalhar.
                    Para chegar ao impacto, tens de recolher boas decisões técnicas e evitar bloqueios do projeto.
                  </p>
                  <button type="button" class="race-btn primary" data-race-start><i class="bi bi-play-fill"></i> Iniciar corrida</button>
                </div>
              </div>
              <div class="race-end-screen" data-race-end-screen>
                <div class="race-end-box">
                  <h2 data-race-end-title>Missão concluída</h2>
                  <p data-race-end-text></p>
                  <div class="race-actions" style="justify-content:center; margin-top:1rem; flex-wrap:wrap;">
                    <button type="button" class="race-btn" data-race-restart><i class="bi bi-arrow-counterclockwise"></i> Jogar de novo</button>
                    <a class="race-btn success" href="https://wa.me/244924482552" target="_blank"><i class="bi bi-whatsapp"></i> Falar comigo</a>
                  </div>
                </div>
              </div>
              <div class="race-floating-tip" data-race-tip>Controlo: teclado ← → ou botões abaixo</div>
            </div>

            <div class="race-mobile-controls">
              <button type="button" class="race-control" data-race-left aria-label="Mover para a esquerda">←</button>
              <button type="button" class="race-control" data-race-right aria-label="Mover para a direita">→</button>
            </div>
          </section>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    state.overlay = overlay;
    state.canvas = overlay.querySelector('[data-race-canvas]');
    state.ctx = state.canvas.getContext('2d');

    overlay.querySelectorAll('[data-race-close]').forEach((btn) => btn.addEventListener('click', closeGame));
    overlay.querySelectorAll('[data-race-start]').forEach((btn) => btn.addEventListener('click', startGame));
    overlay.querySelectorAll('[data-race-restart]').forEach((btn) => btn.addEventListener('click', restartGame));
    overlay.querySelectorAll('[data-race-pause]').forEach((btn) => btn.addEventListener('click', togglePause));
    overlay.querySelectorAll('[data-race-left]').forEach((btn) => btn.addEventListener('click', () => moveLane(-1)));
    overlay.querySelectorAll('[data-race-right]').forEach((btn) => btn.addEventListener('click', () => moveLane(1)));

    bindKeyboard();
    bindTouch();
    state.mounted = true;
  }

  function bindKeyboard() {
    if (state.keysBound) return;
    state.keysBound = true;
    document.addEventListener('keydown', (event) => {
      if (!state.open) return;
      if (event.key === 'Escape') closeGame();
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        event.preventDefault();
        moveLane(-1);
      }
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        event.preventDefault();
        moveLane(1);
      }
      if (event.key === ' ') {
        event.preventDefault();
        if (!state.running) startGame();
        else togglePause();
      }
    });
  }

  function bindTouch() {
    let startX = null;
    state.canvas.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });

    state.canvas.addEventListener('touchend', (event) => {
      if (startX === null) return;
      const endX = event.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 28) moveLane(diff > 0 ? 1 : -1);
      startX = null;
    }, { passive: true });
  }

  function openGame() {
    mountGame();
    state.open = true;
    document.body.classList.add('digital-race-locked');
    state.overlay.classList.add('open');
    resizeCanvas();
    drawFrame();
    window.addEventListener('resize', resizeCanvas);
  }

  function closeGame() {
    state.open = false;
    state.running = false;
    state.paused = false;
    document.body.classList.remove('digital-race-locked');
    state.overlay?.classList.remove('open');
    cancelAnimationFrame(state.raf);
    window.removeEventListener('resize', resizeCanvas);
  }

  function startGame() {
    if (state.running && !state.paused) return;
    if (state.finished) resetState();
    state.running = true;
    state.paused = false;
    state.lastTime = performance.now();
    state.overlay.querySelector('[data-race-start-screen]').style.display = 'none';
    state.overlay.querySelector('[data-race-end-screen]').classList.remove('show');
    updateVision('Arranque técnico', 'A corrida começou: diagnosticar bem, escolher a arquitetura certa e medir impacto é o caminho mais rápido.');
    loop(state.lastTime);
  }

  function restartGame() {
    resetState();
    state.overlay.querySelector('[data-race-start-screen]').style.display = 'none';
    state.overlay.querySelector('[data-race-end-screen]').classList.remove('show');
    state.running = true;
    state.paused = false;
    state.lastTime = performance.now();
    updateVision('Nova corrida', 'Recomeçaste a missão: agora acelera com estratégia e evita os bloqueios técnicos.');
    loop(state.lastTime);
  }

  function togglePause() {
    if (!state.running || state.finished) return;
    state.paused = !state.paused;
    const btn = state.overlay.querySelector('[data-race-pause]');
    if (btn) btn.innerHTML = state.paused ? '<i class="bi bi-play-circle"></i> Continuar' : '<i class="bi bi-pause-circle"></i> Pausar';
    if (!state.paused) {
      state.lastTime = performance.now();
      loop(state.lastTime);
    } else {
      updateVision('Pausa estratégica', 'Até em corrida é preciso parar, medir, corrigir rota e continuar com mais clareza.');
    }
  }

  function resetState() {
    state.running = false;
    state.finished = false;
    state.paused = false;
    state.lane = 1;
    state.targetLane = 1;
    state.score = 0;
    state.health = 3;
    state.distance = 0;
    state.speed = 4.3;
    state.spawnTick = 0;
    state.roadOffset = 0;
    state.items = [];
    state.collected = [];
    state.missionIndex = 0;
    updateHud();
    updateVision('Visão técnica por cima da corrida', 'Usa ← → no teclado ou os botões no telemóvel. Cada tecnologia recolhida revela uma decisão técnica real.');
    state.overlay.querySelector('[data-race-log]').innerHTML = '';
  }

  function moveLane(delta) {
    if (!state.open) return;
    state.targetLane = Math.max(0, Math.min(2, state.targetLane + delta));
    if (!state.running) startGame();
  }

  function resizeCanvas() {
    if (!state.canvas) return;
    const wrap = state.canvas.parentElement;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    state.width = Math.floor(rect.width);
    state.height = Math.floor(rect.height);
    state.canvas.width = Math.floor(state.width * dpr);
    state.canvas.height = Math.floor(state.height * dpr);
    state.canvas.style.width = `${state.width}px`;
    state.canvas.style.height = `${state.height}px`;
    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function loop(now) {
    if (!state.running || state.paused || !state.open) return;
    const delta = Math.min(34, now - state.lastTime || 16.7) / 16.7;
    state.lastTime = now;
    updateGame(delta);
    drawFrame();
    state.raf = requestAnimationFrame(loop);
  }

  function updateGame(delta) {
    state.lane += (state.targetLane - state.lane) * 0.18 * delta;
    state.roadOffset += state.speed * delta;
    state.distance += (0.065 * state.speed) * delta;
    state.speed = Math.min(8.6, state.speed + 0.0018 * delta);
    state.spawnTick -= delta;

    const missionIndex = Math.min(missions.length - 1, Math.floor((state.distance / 100) * missions.length));
    if (missionIndex !== state.missionIndex) {
      state.missionIndex = missionIndex;
      updateVision(missions[missionIndex].name, missions[missionIndex].vision);
    }

    if (state.spawnTick <= 0) {
      spawnItem();
      state.spawnTick = Math.max(18, 42 - state.speed * 2.5);
    }

    state.items.forEach((item) => {
      item.y += state.speed * item.speedFactor * delta;
      item.spin += 0.05 * delta;
    });

    detectCollisions();
    state.items = state.items.filter((item) => item.y < state.height + 90 && !item.hit);

    if (state.distance >= 100) finishRace(true);
    updateHud();
  }

  function spawnItem() {
    const isPower = Math.random() > 0.38;
    const source = isPower ? random(powerUps) : random(blockers);
    const lane = Math.floor(Math.random() * 3);
    state.items.push({
      ...source,
      type: isPower ? 'power' : 'blocker',
      lane,
      y: -70,
      size: isPower ? 48 : 54,
      speedFactor: isPower ? 1.05 : 1.18,
      spin: 0,
      hit: false
    });
  }

  function detectCollisions() {
    const player = getPlayerBox();
    state.items.forEach((item) => {
      const x = laneToX(item.lane);
      const box = { x: x - item.size / 2, y: item.y - item.size / 2, w: item.size, h: item.size };
      if (rectsOverlap(player, box)) {
        item.hit = true;
        if (item.type === 'power') collectPower(item);
        else hitBlocker(item);
      }
    });
  }

  function collectPower(item) {
    state.score += item.points;
    state.speed = Math.min(9, state.speed + 0.12);
    state.collected.unshift(item.label);
    state.collected = [...new Set(state.collected)].slice(0, 8);
    updateVision(`${item.icon} ${item.label}`, item.message);
    renderLog();
    flashTip(`+${item.points} pontos — ${item.label}`);
  }

  function hitBlocker(item) {
    state.health -= item.damage;
    state.speed = Math.max(3.6, state.speed - 0.35);
    state.score = Math.max(0, state.score - 8);
    updateVision(`${item.icon} ${item.label}`, item.message);
    flashTip(`Atenção: ${item.label} travou a corrida`);
    if (state.health <= 0) finishRace(false);
  }

  function finishRace(success) {
    state.running = false;
    state.finished = true;
    cancelAnimationFrame(state.raf);
    drawFrame();
    const end = state.overlay.querySelector('[data-race-end-screen]');
    const title = state.overlay.querySelector('[data-race-end-title]');
    const text = state.overlay.querySelector('[data-race-end-text]');
    const level = state.score >= 180 ? 'Arquiteto Digital' : state.score >= 120 ? 'Construtor GovTech' : 'Piloto em Treino';

    title.textContent = success ? `Meta alcançada: ${level}` : 'Projeto travado, mas com aprendizagem';
    text.innerHTML = success
      ? `Pontuação final: <strong>${state.score}</strong>. Recolheste visão técnica suficiente para transformar um problema real em produto digital.`
      : `Pontuação final: <strong>${state.score}</strong>. Evita mais bloqueios técnicos e volta à pista com melhor arquitetura.`;
    end.classList.add('show');
    updateVision(success ? 'Impacto entregue' : 'Lição aprendida', success ? missions[3].vision : 'Todo projeto ensina: com diagnóstico, arquitetura e observabilidade, a próxima corrida fica melhor.');
  }

  function updateHud() {
    if (!state.overlay) return;
    const progress = Math.max(0, Math.min(100, state.distance));
    state.overlay.querySelector('[data-race-score]').textContent = state.score;
    state.overlay.querySelector('[data-race-health]').textContent = '❤️'.repeat(Math.max(0, state.health)) || '0';
    state.overlay.querySelector('[data-race-speed]').textContent = `${state.speed.toFixed(1)}x`;
    state.overlay.querySelector('[data-race-distance]').textContent = `${Math.floor(progress)}%`;
    state.overlay.querySelector('[data-race-progress]').style.width = `${progress}%`;
    state.overlay.querySelector('[data-race-stage]').textContent = missions[state.missionIndex]?.name || 'Impacto';
  }

  function updateVision(title, text) {
    if (!state.overlay) return;
    state.overlay.querySelector('[data-race-vision-title]').textContent = title;
    state.overlay.querySelector('[data-race-vision-text]').textContent = text;
  }

  function renderLog() {
    const log = state.overlay.querySelector('[data-race-log]');
    log.innerHTML = state.collected.map((item) => `<span class="race-chip"><i class="bi bi-check2-circle"></i>${item}</span>`).join('');
  }

  function flashTip(message) {
    const tip = state.overlay.querySelector('[data-race-tip]');
    tip.textContent = message;
    clearTimeout(state.tipTimer);
    state.tipTimer = setTimeout(() => {
      tip.textContent = 'Controlo: teclado ← → ou botões abaixo';
    }, 1600);
  }

  function drawFrame() {
    if (!state.ctx) return;
    const ctx = state.ctx;
    const w = state.width;
    const h = state.height;
    ctx.clearRect(0, 0, w, h);
    drawBackground(ctx, w, h);
    drawRoad(ctx, w, h);
    drawItems(ctx);
    drawCar(ctx, laneToX(state.lane), h - 86);
    drawSpeedLines(ctx, w, h);
  }

  function drawBackground(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#07172a');
    sky.addColorStop(1, '#020617');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 28; i++) {
      const x = (i * 97 + state.roadOffset * 0.3) % (w + 80) - 40;
      const y = (i * 53 + state.roadOffset * 0.12) % (h * 0.55);
      ctx.fillStyle = i % 3 === 0 ? '#8b5cf6' : '#06b6d4';
      ctx.fillRect(x, y, 3, 3);
    }
    ctx.restore();
  }

  function drawRoad(ctx, w, h) {
    const roadTop = w * 0.26;
    const roadBottom = w * 0.82;
    const cx = w / 2;
    const topY = 0;
    const bottomY = h;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - roadTop / 2, topY);
    ctx.lineTo(cx + roadTop / 2, topY);
    ctx.lineTo(cx + roadBottom / 2, bottomY);
    ctx.lineTo(cx - roadBottom / 2, bottomY);
    ctx.closePath();
    const road = ctx.createLinearGradient(0, 0, 0, h);
    road.addColorStop(0, '#0f172a');
    road.addColorStop(1, '#111827');
    ctx.fillStyle = road;
    ctx.fill();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.42)';
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let lane = 1; lane <= 2; lane++) {
      const xTop = cx - roadTop / 2 + (roadTop / 3) * lane;
      const xBottom = cx - roadBottom / 2 + (roadBottom / 3) * lane;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 2;
      ctx.setLineDash([18, 20]);
      ctx.lineDashOffset = -state.roadOffset;
      ctx.beginPath();
      ctx.moveTo(xTop, topY);
      ctx.lineTo(xBottom, bottomY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#22c55e';
    for (let y = ((state.roadOffset * 1.8) % 90) - 90; y < h; y += 90) {
      ctx.fillRect(cx - roadBottom / 2 - 30, y, 12, 36);
      ctx.fillRect(cx + roadBottom / 2 + 18, y + 20, 12, 36);
    }
    ctx.restore();
  }

  function drawItems(ctx) {
    state.items.forEach((item) => {
      const x = laneToX(item.lane);
      ctx.save();
      ctx.translate(x, item.y);
      if (item.type === 'power') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.75)';
      } else {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
        ctx.strokeStyle = 'rgba(248, 113, 113, 0.82)';
      }
      roundRect(ctx, -item.size / 2, -item.size / 2, item.size, item.size, 15);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '20px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(item.icon, 0, -7);
      ctx.font = '700 10px system-ui';
      ctx.fillText(item.label, 0, 15);
      ctx.restore();
    });
  }

  function drawCar(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const tilt = (state.targetLane - state.lane) * 0.14;
    ctx.rotate(tilt);

    ctx.shadowColor = 'rgba(6, 182, 212, 0.55)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#06b6d4';
    roundRect(ctx, -26, -42, 52, 84, 16);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#8b5cf6';
    roundRect(ctx, -19, -33, 38, 38, 12);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
    roundRect(ctx, -12, -26, 24, 18, 8);
    ctx.fill();

    ctx.fillStyle = '#020617';
    roundRect(ctx, -31, -25, 8, 24, 4);
    roundRect(ctx, 23, -25, 8, 24, 4);
    roundRect(ctx, -31, 15, 8, 24, 4);
    roundRect(ctx, 23, 15, 8, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.font = '900 13px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('JN', 0, 25);

    ctx.fillStyle = 'rgba(34, 197, 94, 0.42)';
    ctx.beginPath();
    ctx.moveTo(-15, 46);
    ctx.lineTo(0, 74 + Math.random() * 8);
    ctx.lineTo(15, 46);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSpeedLines(ctx, w, h) {
    if (!state.running || state.paused) return;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;
    for (let i = 0; i < 18; i++) {
      const x = (i * 73 + state.roadOffset * 2) % w;
      const y = (i * 59 + state.roadOffset * 5) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 14, y + 44);
      ctx.stroke();
    }
    ctx.restore();
  }

  function getPlayerBox() {
    const x = laneToX(state.lane);
    const y = state.height - 86;
    return { x: x - 27, y: y - 43, w: 54, h: 86 };
  }

  function laneToX(lane) {
    const w = state.width;
    const margin = Math.max(76, w * 0.24);
    const roadWidth = w - margin * 2;
    return margin + roadWidth * (lane + 0.5) / 3;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function random(items) {
    return items[Math.floor(Math.random() * items.length)];
  }
})();
