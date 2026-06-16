// Bug Hunter — Operação GovTech: arcade para o portfólio de Jamite Ngola
(function () {
  const data = {
    powerUps: [
      { name: 'API', icon: '⚙️', color: '#06b6d4', msg: 'API: integração limpa transforma sistemas isolados em ecossistema.' },
      { name: 'BI', icon: '📊', color: '#22c55e', msg: 'BI: dados bem tratados aceleram decisões.' },
      { name: 'IA', icon: '🤖', color: '#8b5cf6', msg: 'IA: automação com propósito aumenta produtividade.' },
      { name: 'SQL', icon: '🗄️', color: '#f59e0b', msg: 'SQL: modelo de dados sólido evita caos operacional.' },
      { name: 'UX', icon: '✨', color: '#ec4899', msg: 'UX: tecnologia só vence quando o utilizador consegue usar.' },
      { name: 'SEG', icon: '🔐', color: '#a3e635', msg: 'Segurança: proteção nasce na arquitetura, não no fim.' }
    ],
    enemies: [
      { name: 'Bug', icon: '🐞', color: '#ef4444', hp: 1, speed: 1.15 },
      { name: 'Erro 500', icon: '🔥', color: '#f97316', hp: 2, speed: 1.0 },
      { name: 'Dados sujos', icon: '🧹', color: '#f43f5e', hp: 2, speed: 0.95 },
      { name: 'Legado', icon: '🧱', color: '#fb7185', hp: 3, speed: 0.78 },
      { name: 'Ataque', icon: '⚠️', color: '#ef4444', hp: 2, speed: 1.22 }
    ],
    stages: [
      ['Diagnóstico', 'Defende o sistema entendendo primeiro o problema real.'],
      ['Arquitetura', 'Agora usa APIs, dados, UX e segurança para ganhar escala.'],
      ['Execução', 'Entrega produto: limpa bugs, mede, automatiza e melhora.'],
      ['Impacto', 'O objetivo final é continuidade, confiança e decisão melhor.']
    ]
  };

  const game = {
    mounted: false,
    open: false,
    running: false,
    paused: false,
    over: false,
    w: 900,
    h: 560,
    player: { x: 450, y: 470, r: 20, shield: 0, weapon: 1 },
    score: 0,
    wave: 1,
    hp: 5,
    kills: 0,
    time: 0,
    spawn: 0,
    fire: 0,
    bossSpawned: false,
    bullets: [],
    enemies: [],
    drops: [],
    particles: [],
    keys: {},
    pointer: null,
    collected: [],
    sound: true,
    audioReady: false,
    audio: null,
    last: 0,
    raf: null,
    shake: 0
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  ready(() => {
    ensureLaunchers();
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-game-open], .game-anchor-button, a[href="#missao-digital"], a[href="missao-digital.html"]');
      if (!opener) return;
      event.preventDefault();
      openGame();
    });
  });

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function ensureLaunchers() {
    let heroBtn = $('.game-anchor-button');
    const hero = $('#about .col-12, #about .col-xl-10, #about .container .row > div, #about .container');
    if (!heroBtn && hero) {
      heroBtn = document.createElement('a');
      heroBtn.className = 'game-anchor-button bug-hunter-launcher';
      hero.appendChild(heroBtn);
    }
    if (heroBtn) {
      heroBtn.href = '#';
      heroBtn.setAttribute('data-game-open', 'true');
      heroBtn.innerHTML = '<i class="bi bi-bug"></i> Jogar Bug Hunter';
    }

    const nav = $('.nav-box .nav');
    if (nav && !nav.querySelector('[data-game-open]')) {
      const item = document.createElement('li');
      item.className = 'nav-item';
      item.innerHTML = '<a class="nav-link" href="#" data-game-open><i class="bi bi-arrow-right"></i>Jogo</a>';
      const contact = nav.querySelector('a[href="#contact"]')?.closest('li');
      if (contact) nav.insertBefore(item, contact);
      else nav.appendChild(item);
    }

    if (!$('.bug-hunter-floating')) {
      const floating = document.createElement('button');
      floating.type = 'button';
      floating.className = 'bug-hunter-launcher bug-hunter-floating';
      floating.setAttribute('data-game-open', 'true');
      floating.innerHTML = '<i class="bi bi-bug"></i><span>Jogar</span>';
      document.body.appendChild(floating);
    }
  }

  function mount() {
    if (game.mounted) return;
    const overlay = document.createElement('div');
    overlay.className = 'bug-hunter-overlay';
    overlay.innerHTML = `
      <div class="bug-shell">
        <div class="bug-topbar">
          <div class="bug-brand"><div class="bug-mark">JN</div><div><strong>Bug Hunter</strong><small>Operação GovTech</small></div></div>
          <div class="bug-actions">
            <button class="bug-btn" type="button" data-sound><i class="bi bi-volume-up"></i> Som</button>
            <button class="bug-btn" type="button" data-pause><i class="bi bi-pause-circle"></i> Pausar</button>
            <button class="bug-btn" type="button" data-restart><i class="bi bi-arrow-counterclockwise"></i> Reiniciar</button>
            <button class="bug-btn primary" type="button" data-close><i class="bi bi-x-lg"></i> Fechar</button>
          </div>
        </div>
        <div class="bug-layout">
          <section class="bug-panel bug-info">
            <span class="bug-kicker">Arcade técnico</span>
            <h2 class="bug-title">Defende o sistema em produção</h2>
            <p class="bug-text">Move o núcleo digital, destrói bugs, evita erros críticos e recolhe tecnologias para evoluir a solução.</p>
            <div class="bug-stats">
              <div class="bug-stat"><span>Pontos</span><strong data-score>0</strong></div>
              <div class="bug-stat"><span>Vida</span><strong data-hp>❤️❤️❤️❤️❤️</strong></div>
              <div class="bug-stat"><span>Onda</span><strong data-wave>1</strong></div>
            </div>
            <div class="bug-vision">
              <h3 data-vision-title>Visão técnica</h3>
              <p data-vision-text>Arrasta o dedo no telemóvel/tablet ou usa rato/teclado. O núcleo dispara automaticamente.</p>
              <div class="bug-tags" data-tags></div>
            </div>
          </section>
          <section class="bug-panel bug-game">
            <div class="bug-hud"><div><strong>Ambiente de Produção</strong><small>Protege o portal contra falhas técnicas.</small></div><button class="bug-btn success" type="button" data-start><i class="bi bi-play-fill"></i> Começar</button></div>
            <div class="bug-canvas-wrap">
              <canvas class="bug-canvas" data-canvas></canvas>
              <div class="bug-screen" data-start-screen><div class="bug-box"><h2>Bug Hunter</h2><p>Um arcade simples e mais divertido: move, dispara, apanha tecnologias e derrota o boss “Sistema Legado”. Funciona em telemóveis, tablets e desktop.</p><button class="bug-btn primary" type="button" data-start><i class="bi bi-play-fill"></i> Iniciar com som</button></div></div>
              <div class="bug-screen hidden" data-end-screen><div class="bug-box"><h2 data-end-title></h2><p data-end-text></p><button class="bug-btn primary" type="button" data-restart><i class="bi bi-arrow-counterclockwise"></i> Jogar de novo</button></div></div>
              <div class="bug-tip" data-tip>Arrasta para mover. O disparo é automático.</div>
            </div>
            <div class="bug-controls"><button class="bug-control" type="button" data-left>←</button><button class="bug-control primary" type="button" data-start>▶</button><button class="bug-control" type="button" data-right>→</button></div>
          </section>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    game.overlay = overlay;
    game.canvas = $('[data-canvas]', overlay);
    game.ctx = game.canvas.getContext('2d');
    $$('[data-close]', overlay).forEach(b => b.addEventListener('click', closeGame));
    $$('[data-start]', overlay).forEach(b => b.addEventListener('click', startGame));
    $$('[data-restart]', overlay).forEach(b => b.addEventListener('click', restartGame));
    $$('[data-pause]', overlay).forEach(b => b.addEventListener('click', togglePause));
    $$('[data-sound]', overlay).forEach(b => b.addEventListener('click', toggleSound));
    bindInput();
    game.mounted = true;
  }

  function openGame() {
    mount();
    game.open = true;
    document.documentElement.classList.add('bug-hunter-open');
    document.body.classList.add('bug-hunter-open');
    game.overlay.classList.add('open');
    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 250));
  }

  function closeGame() {
    game.open = false;
    game.running = false;
    stopAmbience();
    cancelAnimationFrame(game.raf);
    document.documentElement.classList.remove('bug-hunter-open');
    document.body.classList.remove('bug-hunter-open');
    game.overlay.classList.remove('open');
    window.removeEventListener('resize', resize);
  }

  function startGame() {
    initAudio();
    if (game.over) resetGame();
    game.running = true;
    game.paused = false;
    game.last = performance.now();
    $('[data-start-screen]', game.overlay).classList.add('hidden');
    $('[data-end-screen]', game.overlay).classList.add('hidden');
    setVision('Sistema em produção', 'Defende a plataforma: eliminar falhas rapidamente é parte da entrega profissional.');
    startAmbience();
    playStart();
    vibrate(20);
    loop(game.last);
  }

  function restartGame() {
    resetGame();
    startGame();
  }

  function resetGame() {
    Object.assign(game, {
      running: false, paused: false, over: false,
      player: { x: game.w / 2, y: game.h - 74, r: 20, shield: 0, weapon: 1 },
      score: 0, wave: 1, hp: 5, kills: 0, time: 0, spawn: 0, fire: 0, bossSpawned: false,
      bullets: [], enemies: [], drops: [], particles: [], collected: [], shake: 0
    });
    hud();
    $('[data-tags]', game.overlay).innerHTML = '';
    setVision('Visão técnica', 'Arrasta o dedo no telemóvel/tablet ou usa rato/teclado. O núcleo dispara automaticamente.');
  }

  function togglePause() {
    if (!game.running || game.over) return;
    game.paused = !game.paused;
    $('[data-pause]', game.overlay).innerHTML = game.paused ? '<i class="bi bi-play-circle"></i> Continuar' : '<i class="bi bi-pause-circle"></i> Pausar';
    if (game.paused) stopAmbience(false);
    else { game.last = performance.now(); startAmbience(); loop(game.last); }
  }

  function toggleSound() {
    game.sound = !game.sound;
    $('[data-sound]', game.overlay).innerHTML = game.sound ? '<i class="bi bi-volume-up"></i> Som' : '<i class="bi bi-volume-mute"></i> Sem som';
    if (!game.sound) stopAmbience();
    else { initAudio(); playStart(); if (game.running) startAmbience(); }
  }

  function bindInput() {
    const canvas = game.canvas;
    let hold = null;
    canvas.addEventListener('pointerdown', e => { if (!game.running) startGame(); moveTo(e); canvas.setPointerCapture?.(e.pointerId); e.preventDefault(); });
    canvas.addEventListener('pointermove', e => { if (!game.open) return; moveTo(e); e.preventDefault(); });
    $('[data-left]', game.overlay).addEventListener('pointerdown', e => { e.preventDefault(); hold = setInterval(() => nudge(-1), 35); nudge(-1); });
    $('[data-right]', game.overlay).addEventListener('pointerdown', e => { e.preventDefault(); hold = setInterval(() => nudge(1), 35); nudge(1); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => game.overlay.addEventListener(ev, () => { clearInterval(hold); hold = null; }));
    document.addEventListener('keydown', e => { if (!game.open) return; game.keys[e.key.toLowerCase()] = true; if (e.key === 'Escape') closeGame(); if (e.key === ' ') { e.preventDefault(); game.running ? togglePause() : startGame(); } });
    document.addEventListener('keyup', e => { game.keys[e.key.toLowerCase()] = false; });
  }

  function moveTo(e) {
    const r = game.canvas.getBoundingClientRect();
    game.player.x = clamp(e.clientX - r.left, 28, game.w - 28);
    game.player.y = clamp(e.clientY - r.top, game.h * 0.42, game.h - 34);
  }

  function nudge(dir) {
    if (!game.running) startGame();
    game.player.x = clamp(game.player.x + dir * 15, 28, game.w - 28);
  }

  function resize() {
    const rect = game.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(devicePixelRatio || 1, 2));
    game.w = Math.floor(rect.width);
    game.h = Math.floor(rect.height);
    game.canvas.width = Math.floor(game.w * dpr);
    game.canvas.height = Math.floor(game.h * dpr);
    game.canvas.style.width = `${game.w}px`;
    game.canvas.style.height = `${game.h}px`;
    game.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    game.player.x = clamp(game.player.x || game.w / 2, 28, game.w - 28);
    game.player.y = clamp(game.player.y || game.h - 74, game.h * 0.42, game.h - 34);
  }

  function loop(now) {
    if (!game.running || game.paused || !game.open) return;
    const d = Math.min(34, now - game.last || 16.7) / 16.7;
    game.last = now;
    update(d);
    draw();
    game.raf = requestAnimationFrame(loop);
  }

  function update(d) {
    game.time += d;
    game.spawn -= d;
    game.fire -= d;
    game.shake = Math.max(0, game.shake - 0.5 * d);
    if (game.keys.arrowleft || game.keys.a) game.player.x -= 9 * d;
    if (game.keys.arrowright || game.keys.d) game.player.x += 9 * d;
    if (game.keys.arrowup || game.keys.w) game.player.y -= 8 * d;
    if (game.keys.arrowdown || game.keys.s) game.player.y += 8 * d;
    game.player.x = clamp(game.player.x, 28, game.w - 28);
    game.player.y = clamp(game.player.y, game.h * 0.42, game.h - 34);
    if (game.fire <= 0) shoot();
    if (game.spawn <= 0) spawnEnemy();
    if (game.kills > 0 && game.kills % 12 === 0 && !game.bossSpawned) spawnBoss();

    game.bullets.forEach(b => { b.x += b.vx * d; b.y += b.vy * d; b.life -= d; });
    game.enemies.forEach(e => { e.x += e.vx * d; e.y += e.vy * d; e.rot += 0.03 * d; });
    game.drops.forEach(p => { p.y += p.vy * d; p.pulse += 0.06 * d; });
    game.particles.forEach(p => { p.x += p.vx * d; p.y += p.vy * d; p.life -= 0.025 * d; p.r *= 0.99; });
    collide();
    cleanup();
    hud();
  }

  function shoot() {
    const n = game.player.weapon;
    const spread = n === 1 ? [0] : n === 2 ? [-0.75, 0.75] : [-1.1, 0, 1.1];
    spread.forEach(s => game.bullets.push({ x: game.player.x, y: game.player.y - 20, vx: s, vy: -12, r: 4, life: 80 }));
    game.fire = Math.max(9, 18 - game.wave);
    playShoot();
  }

  function spawnEnemy() {
    const base = pick(data.enemies);
    const size = 23 + Math.random() * 9;
    game.enemies.push({ ...base, x: 30 + Math.random() * (game.w - 60), y: -40, r: size, hp: base.hp + Math.floor(game.wave / 4), vx: (Math.random() - 0.5) * 1.2, vy: base.speed + game.wave * 0.08, rot: 0, boss: false });
    game.spawn = Math.max(15, 44 - game.wave * 2.4);
  }

  function spawnBoss() {
    game.bossSpawned = true;
    game.enemies.push({ name: 'Sistema Legado', icon: '🏛️', color: '#f97316', x: game.w / 2, y: -70, r: 52, hp: 18 + game.wave * 2, vx: 0.9, vy: 0.55, rot: 0, boss: true });
    setVision('Boss: Sistema Legado', 'Modernizar sem destruir o que funciona exige estratégia, APIs e segurança.');
    tip('Boss entrou: Sistema Legado');
    playBoss();
  }

  function collide() {
    game.bullets.forEach(b => {
      game.enemies.forEach(e => {
        if (dist(b, e) < b.r + e.r) {
          b.life = 0;
          e.hp -= 1;
          burst(b.x, b.y, e.color, 5);
          if (e.hp <= 0) killEnemy(e);
        }
      });
    });

    game.enemies.forEach(e => {
      if (dist(game.player, e) < game.player.r + e.r) {
        e.hp = 0;
        damage(e);
      }
      if (e.y > game.h + 80) {
        e.hp = 0;
        damage(e, true);
      }
    });

    game.drops.forEach(p => {
      if (dist(game.player, p) < game.player.r + p.r + 8) {
        p.hit = true;
        collect(p);
      }
    });
  }

  function killEnemy(e) {
    if (e.dead) return;
    e.dead = true;
    game.score += e.boss ? 180 : 18;
    game.kills += e.boss ? 4 : 1;
    if (e.boss) { game.wave += 1; game.bossSpawned = false; setVision('Upgrade de arquitetura', data.stages[Math.min(3, game.wave - 1)][1]); playWinMini(); }
    if (Math.random() < (e.boss ? 1 : 0.28)) drop(e.x, e.y);
    burst(e.x, e.y, e.color, e.boss ? 42 : 16);
    playPop();
    vibrate(e.boss ? [30, 30, 60] : 10);
  }

  function damage(e, missed) {
    if (e.dead) return;
    e.dead = true;
    if (game.player.shield > 0) { game.player.shield -= 1; tip('Escudo absorveu o impacto'); playShield(); return; }
    game.hp -= missed ? 1 : 1;
    game.shake = 10;
    burst(e.x, Math.min(e.y, game.h - 20), '#ef4444', 20);
    tip(missed ? `${e.name} passou pela defesa` : `${e.name} atingiu o sistema`);
    playHit();
    vibrate([40, 30, 55]);
    if (game.hp <= 0) endGame(false);
  }

  function drop(x, y) {
    const p = pick(data.powerUps);
    game.drops.push({ ...p, x, y, r: 18, vy: 1.4, pulse: 0, hit: false });
  }

  function collect(p) {
    game.score += 35;
    game.collected.unshift(p.name);
    game.collected = [...new Set(game.collected)].slice(0, 8);
    if (p.name === 'SEG') game.player.shield = Math.min(3, game.player.shield + 1);
    if (p.name === 'IA') game.player.weapon = 3;
    if (p.name === 'API') game.player.weapon = Math.max(game.player.weapon, 2);
    if (p.name === 'UX') game.hp = Math.min(5, game.hp + 1);
    setVision(`${p.icon} ${p.name}`, p.msg);
    $('[data-tags]', game.overlay).innerHTML = game.collected.map(t => `<span class="bug-tag"><i class="bi bi-check2-circle"></i>${t}</span>`).join('');
    tip(`Power-up: ${p.name}`);
    burst(p.x, p.y, p.color, 24);
    playPower();
    vibrate(20);
  }

  function cleanup() {
    game.bullets = game.bullets.filter(b => b.life > 0 && b.y > -30 && b.x > -40 && b.x < game.w + 40);
    game.enemies = game.enemies.filter(e => !e.dead && e.y < game.h + 100);
    game.drops = game.drops.filter(p => !p.hit && p.y < game.h + 60);
    game.particles = game.particles.filter(p => p.life > 0 && p.r > 0.4);
  }

  function hud() {
    if (!game.overlay) return;
    $('[data-score]', game.overlay).textContent = game.score;
    $('[data-wave]', game.overlay).textContent = game.wave;
    $('[data-hp]', game.overlay).textContent = '❤️'.repeat(Math.max(0, game.hp)) || '0';
  }

  function endGame(win) {
    game.running = false;
    game.over = true;
    stopAmbience(false);
    const title = win ? 'Sistema protegido' : 'Sistema em incidente';
    const rank = game.score > 850 ? 'Arquiteto GovTech' : game.score > 450 ? 'Dev Resolvedor' : 'Analista em Treino';
    $('[data-end-title]', game.overlay).textContent = `${title}: ${rank}`;
    $('[data-end-text]', game.overlay).innerHTML = `Pontuação final: <strong>${game.score}</strong>. Destruíste <strong>${game.kills}</strong> problemas técnicos e recolheste <strong>${game.collected.length}</strong> tecnologias.`;
    $('[data-end-screen]', game.overlay).classList.remove('hidden');
    win ? playVictory() : playGameOver();
  }

  function setVision(title, text) {
    if (!game.overlay) return;
    $('[data-vision-title]', game.overlay).textContent = title;
    $('[data-vision-text]', game.overlay).textContent = text;
  }

  function tip(text) {
    const el = $('[data-tip]', game.overlay);
    el.textContent = text;
    el.classList.add('pulse');
    clearTimeout(game.tipTimer);
    game.tipTimer = setTimeout(() => { el.textContent = 'Arrasta para mover. O disparo é automático.'; el.classList.remove('pulse'); }, 1600);
  }

  function draw() {
    const c = game.ctx, w = game.w, h = game.h;
    c.clearRect(0, 0, w, h);
    c.save();
    if (game.shake) c.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
    background(c, w, h);
    game.drops.forEach(p => drawDrop(c, p));
    game.bullets.forEach(b => drawBullet(c, b));
    game.enemies.forEach(e => drawEnemy(c, e));
    game.particles.forEach(p => drawParticle(c, p));
    drawPlayer(c);
    c.restore();
  }

  function background(c, w, h) {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#071426');
    g.addColorStop(1, '#020617');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.globalAlpha = 0.18;
    c.strokeStyle = '#06b6d4';
    for (let x = (game.time * 1.2) % 48; x < w; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x - 140, h); c.stroke(); }
    for (let y = (game.time * 2.5) % 48; y < h; y += 48) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.globalAlpha = 1;
  }

  function drawPlayer(c) {
    const p = game.player;
    c.save();
    c.translate(p.x, p.y);
    c.shadowColor = p.shield ? '#a3e635' : '#06b6d4';
    c.shadowBlur = p.shield ? 30 : 22;
    c.fillStyle = '#06b6d4';
    polygon(c, 0, -24, 22, 18, -22, 18);
    c.fill();
    c.fillStyle = '#8b5cf6';
    c.beginPath(); c.arc(0, 4, 13, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff'; c.font = '900 11px system-ui'; c.textAlign = 'center'; c.fillText('JN', 0, 8);
    if (p.shield) { c.strokeStyle = 'rgba(163,230,53,.75)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 34, 0, Math.PI * 2); c.stroke(); }
    c.restore();
  }

  function drawBullet(c, b) {
    c.save(); c.shadowColor = '#22c55e'; c.shadowBlur = 14; c.fillStyle = '#bbf7d0'; c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.fill(); c.restore();
  }

  function drawEnemy(c, e) {
    c.save(); c.translate(e.x, e.y); c.rotate(e.rot); c.shadowColor = e.color; c.shadowBlur = e.boss ? 25 : 14; c.fillStyle = e.boss ? 'rgba(249,115,22,.26)' : 'rgba(239,68,68,.18)'; c.strokeStyle = e.color; c.lineWidth = e.boss ? 4 : 2; c.beginPath(); c.roundRect?.(-e.r, -e.r, e.r * 2, e.r * 2, 14); if (!c.roundRect) round(c, -e.r, -e.r, e.r * 2, e.r * 2, 14); c.fill(); c.stroke(); c.shadowBlur = 0; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `${e.boss ? 28 : 20}px system-ui`; c.fillStyle = '#fff'; c.fillText(e.icon, 0, -4); c.font = '800 10px system-ui'; c.fillText(e.name, 0, e.boss ? 25 : 18); c.restore();
  }

  function drawDrop(c, p) {
    c.save(); c.translate(p.x, p.y); const s = 1 + Math.sin(p.pulse) * 0.08; c.scale(s, s); c.shadowColor = p.color; c.shadowBlur = 22; c.fillStyle = 'rgba(34,197,94,.18)'; c.strokeStyle = p.color; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, p.r, 0, Math.PI * 2); c.fill(); c.stroke(); c.shadowBlur = 0; c.font = '18px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText(p.icon, 0, 0); c.restore();
  }

  function drawParticle(c, p) { c.save(); c.globalAlpha = Math.max(0, p.life); c.fillStyle = p.color; c.shadowColor = p.color; c.shadowBlur = 12; c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill(); c.restore(); }

  function burst(x, y, color, n) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 5; game.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 2 + Math.random() * 4, life: 0.55 + Math.random() * 0.55, color }); } }

  function initAudio() { if (!game.sound || game.audioReady) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const ctx = new AC(); const master = ctx.createGain(); master.gain.value = 0.22; master.connect(ctx.destination); game.audio = { ctx, master, hum: null, humGain: null }; game.audioReady = true; ctx.resume?.(); }
  function tone(f, d = 0.1, type = 'sine', vol = 0.08, to) { if (!game.sound) return; initAudio(); const a = game.audio; if (!a) return; a.ctx.resume?.(); const o = a.ctx.createOscillator(), g = a.ctx.createGain(); o.type = type; o.frequency.value = f; if (to) o.frequency.exponentialRampToValueAtTime(Math.max(30, to), a.ctx.currentTime + d); g.gain.setValueAtTime(0.0001, a.ctx.currentTime); g.gain.exponentialRampToValueAtTime(vol, a.ctx.currentTime + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, a.ctx.currentTime + d); o.connect(g); g.connect(a.master); o.start(); o.stop(a.ctx.currentTime + d + 0.03); }
  function startAmbience() { if (!game.sound) return; initAudio(); const a = game.audio; if (!a || a.hum) return; const o = a.ctx.createOscillator(), g = a.ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = 58; g.gain.value = 0.012; o.connect(g); g.connect(a.master); o.start(); a.hum = o; a.humGain = g; }
  function stopAmbience(full = true) { const a = game.audio; if (!a?.hum) return; const now = a.ctx.currentTime; a.humGain.gain.linearRampToValueAtTime(0.0001, now + 0.15); a.hum.stop(now + 0.18); a.hum = null; a.humGain = null; if (full) a.ctx.suspend?.(); }
  function playStart() { tone(260, .08, 'triangle', .07, 420); setTimeout(() => tone(620, .1, 'triangle', .08, 880), 80); }
  function playShoot() { tone(760, .035, 'square', .018, 980); }
  function playPop() { tone(220, .07, 'triangle', .055, 520); }
  function playPower() { tone(600, .08, 'sine', .09, 960); setTimeout(() => tone(1180, .08, 'sine', .07, 1500), 55); }
  function playHit() { tone(150, .15, 'sawtooth', .13, 70); }
  function playShield() { tone(420, .1, 'triangle', .07, 240); }
  function playBoss() { tone(100, .24, 'sawtooth', .11, 70); }
  function playWinMini() { [420, 620, 840].forEach((f, i) => setTimeout(() => tone(f, .1, 'sine', .07, f * 1.12), i * 70)); }
  function playVictory() { [440, 660, 880, 1320].forEach((f, i) => setTimeout(() => tone(f, .14, 'sine', .09, f * 1.15), i * 90)); }
  function playGameOver() { [220, 160, 110].forEach((f, i) => setTimeout(() => tone(f, .15, 'sawtooth', .08, f * .72), i * 110)); }

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function polygon(c, x1, y1, x2, y2, x3, y3) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineTo(x3, y3); c.closePath(); }
  function round(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function vibrate(p) { if ('vibrate' in navigator) navigator.vibrate(p); }
})();
