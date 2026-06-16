// Corrida Digital Pro — experiência mobile/tablet com som, vibração e efeitos
(function () {
  const cfg = {
    lanes: 3,
    duration: 100,
    maxHealth: 3,
    powerUps: [
      ['API', '⚙️', '#06b6d4', 'API segura: sistemas conversam sem trabalho manual.'],
      ['BI', '📊', '#22c55e', 'Power BI: dados viram decisão em tempo real.'],
      ['IA', '🤖', '#8b5cf6', 'IA aplicada: automatiza e acelera análise com propósito.'],
      ['SQL', '🗄️', '#f59e0b', 'Base de dados bem modelada: confiança e rastreabilidade.'],
      ['UX', '✨', '#ec4899', 'UX simples: menos fricção, mais adesão.'],
      ['Segurança', '🔐', '#a3e635', 'Segurança: proteção faz parte da arquitetura.']
    ],
    blockers: [
      ['Bug', '🐞', '#ef4444', 'Bug: testes e logs devem entrar mais cedo.'],
      ['Erro 500', '🔥', '#f97316', 'Erro 500: sem observabilidade, resolver vira adivinhação.'],
      ['Legado', '🧱', '#fb7185', 'Legado: modernizar com camada API reduz risco.'],
      ['Dados sujos', '🧹', '#f43f5e', 'Dados sujos: dashboard bonito pode enganar.'],
      ['SSL', '⚠️', '#ef4444', 'SSL: confiança digital depende da infraestrutura.']
    ],
    stages: [
      ['Diagnóstico', 'Entendo pessoas, dados, regras e o processo real antes de escrever código.'],
      ['Arquitetura', 'Junto APIs, segurança, base de dados e uma experiência simples.'],
      ['Execução', 'Transformo visão em produto com frontend, backend, BI, automação e deploy.'],
      ['Impacto', 'Meço o resultado: menos filas, mais produtividade e melhores decisões.']
    ]
  };

  const game = {
    mounted: false,
    open: false,
    running: false,
    paused: false,
    finished: false,
    lane: 1,
    targetLane: 1,
    score: 0,
    health: 3,
    speed: 4.2,
    distance: 0,
    offset: 0,
    spawn: 0,
    items: [],
    particles: [],
    collected: [],
    stage: 0,
    shake: 0,
    boost: 0,
    last: 0,
    audioReady: false,
    sound: true,
    audio: null
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  ready(() => {
    addLauncher();
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-game-open], .game-anchor-button, a[href="#missao-digital"], a[href="missao-digital.html"]');
      if (!btn) return;
      e.preventDefault();
      open();
    });
    if (location.hash === '#missao-digital') setTimeout(open, 300);
  });

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function addLauncher() {
    const existing = $('.game-anchor-button');
    if (existing) {
      existing.href = '#';
      existing.innerHTML = '<i class="bi bi-controller"></i> Jogar Corrida Digital';
      existing.setAttribute('data-game-open', 'true');
    }
  }

  function mount() {
    if (game.mounted) return;
    const overlay = document.createElement('div');
    overlay.className = 'digital-race-overlay race-pro-overlay';
    overlay.innerHTML = `
      <div class="race-shell race-pro-shell">
        <div class="race-topbar">
          <div class="race-brand">
            <div class="race-brand-mark">JN</div>
            <div><strong>Corrida Digital</strong><small>Mobile • Tablet • Desktop</small></div>
          </div>
          <div class="race-actions">
            <button type="button" class="race-btn" data-sound><i class="bi bi-volume-up"></i> Som</button>
            <button type="button" class="race-btn" data-pause><i class="bi bi-pause-circle"></i> Pausar</button>
            <button type="button" class="race-btn" data-restart><i class="bi bi-arrow-counterclockwise"></i> Reiniciar</button>
            <button type="button" class="race-btn primary" data-close><i class="bi bi-x-lg"></i> Fechar</button>
          </div>
        </div>
        <div class="race-body">
          <section class="race-card race-brief">
            <span class="race-kicker"><i class="bi bi-stars"></i> Jogo interativo</span>
            <h2 class="race-title">Acelera a transformação digital</h2>
            <p class="race-text">Pilota pela pista GovTech. Apanha tecnologias certas, evita bloqueios reais e vê a visão técnica mudar durante a corrida.</p>
            <div class="race-stats">
              <div class="race-stat"><span>Pontos</span><strong data-score>0</strong></div>
              <div class="race-stat"><span>Energia</span><strong data-health>❤️❤️❤️</strong></div>
              <div class="race-stat"><span>Velocidade</span><strong data-speed>4.2x</strong></div>
            </div>
            <div class="race-progress-wrap">
              <div class="race-progress-top"><span data-stage>Diagnóstico</span><span data-progress-text>0%</span></div>
              <div class="race-progress"><span data-progress></span></div>
            </div>
            <div class="race-vision">
              <h3 data-vision-title>Visão técnica por cima da corrida</h3>
              <p data-vision-text>Em telemóvel ou tablet: toca nos botões, toca nos lados da pista ou arrasta o dedo. O som liga no primeiro toque.</p>
              <div class="race-log" data-log></div>
            </div>
          </section>
          <section class="race-card race-game">
            <div class="race-hud">
              <div><div class="race-hud-title">Pista GovTech</div><div class="race-hud-help">Som, vibração, partículas e controlos por toque.</div></div>
              <button type="button" class="race-btn success" data-start><i class="bi bi-play-fill"></i> Começar</button>
            </div>
            <div class="race-canvas-wrap race-pro-canvas-wrap">
              <canvas class="digital-race-canvas" data-canvas></canvas>
              <div class="race-start-screen" data-start-screen>
                <div class="race-start-box">
                  <h2>Pronto para correr?</h2>
                  <p>Funciona em desktop, tablet e telemóvel. Recolhe API, BI, IA, SQL, UX e Segurança. Evita bugs, legado e dados sujos.</p>
                  <button type="button" class="race-btn primary" data-start><i class="bi bi-play-fill"></i> Iniciar com som</button>
                </div>
              </div>
              <div class="race-end-screen" data-end-screen><div class="race-end-box"><h2 data-end-title></h2><p data-end-text></p><div class="race-actions" style="justify-content:center;margin-top:1rem;flex-wrap:wrap"><button type="button" class="race-btn" data-restart><i class="bi bi-arrow-counterclockwise"></i> Jogar de novo</button><a class="race-btn success" href="https://wa.me/244924482552" target="_blank"><i class="bi bi-whatsapp"></i> Falar comigo</a></div></div></div>
              <div class="race-floating-tip" data-tip>Arrasta na pista ou toca nos botões</div>
            </div>
            <div class="race-mobile-controls race-pro-controls">
              <button type="button" class="race-control" data-left>←</button>
              <button type="button" class="race-control race-control-start" data-start>▶</button>
              <button type="button" class="race-control" data-right>→</button>
            </div>
          </section>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    game.overlay = overlay;
    game.canvas = $('[data-canvas]', overlay);
    game.ctx = game.canvas.getContext('2d');
    $$('[data-close]', overlay).forEach(b => b.addEventListener('click', close));
    $$('[data-start]', overlay).forEach(b => b.addEventListener('click', start));
    $$('[data-restart]', overlay).forEach(b => b.addEventListener('click', restart));
    $$('[data-pause]', overlay).forEach(b => b.addEventListener('click', pause));
    $$('[data-sound]', overlay).forEach(b => b.addEventListener('click', toggleSound));
    bindHold($('[data-left]', overlay), -1);
    bindHold($('[data-right]', overlay), 1);
    bindCanvas();
    bindKeys();
    game.mounted = true;
  }

  function open() {
    mount();
    game.open = true;
    document.body.classList.add('digital-race-locked');
    game.overlay.classList.add('open');
    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 250));
  }

  function close() {
    game.open = false;
    game.running = false;
    game.paused = false;
    stopEngine();
    cancelAnimationFrame(game.raf);
    document.body.classList.remove('digital-race-locked');
    game.overlay.classList.remove('open');
    window.removeEventListener('resize', resize);
  }

  function start() {
    initAudio();
    soundStart();
    startEngine();
    vibrate(20);
    if (game.finished) reset();
    if (game.running && !game.paused) return;
    game.running = true;
    game.paused = false;
    game.last = performance.now();
    $('[data-start-screen]', game.overlay).style.display = 'none';
    $('[data-end-screen]', game.overlay).classList.remove('show');
    setVision('Arranque técnico', 'Começou: diagnóstico, arquitetura, execução e impacto precisam andar na mesma pista.');
    loop(game.last);
  }

  function restart() {
    reset();
    start();
  }

  function pause() {
    if (!game.running || game.finished) return;
    game.paused = !game.paused;
    $('[data-pause]', game.overlay).innerHTML = game.paused ? '<i class="bi bi-play-circle"></i> Continuar' : '<i class="bi bi-pause-circle"></i> Pausar';
    if (game.paused) stopEngine(false);
    else { startEngine(); game.last = performance.now(); loop(game.last); }
  }

  function reset() {
    Object.assign(game, { running: false, paused: false, finished: false, lane: 1, targetLane: 1, score: 0, health: 3, speed: 4.2, distance: 0, offset: 0, spawn: 0, items: [], particles: [], collected: [], stage: 0, shake: 0, boost: 0 });
    $('[data-start-screen]', game.overlay).style.display = 'grid';
    $('[data-end-screen]', game.overlay).classList.remove('show');
    $('[data-log]', game.overlay).innerHTML = '';
    setVision('Visão técnica por cima da corrida', 'Em telemóvel ou tablet: toca nos botões, toca nos lados da pista ou arrasta o dedo.');
    hud();
  }

  function toggleSound() {
    game.sound = !game.sound;
    $('[data-sound]', game.overlay).innerHTML = game.sound ? '<i class="bi bi-volume-up"></i> Som' : '<i class="bi bi-volume-mute"></i> Sem som';
    if (game.sound) { initAudio(); soundStart(); if (game.running && !game.paused) startEngine(); }
    else stopEngine();
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
    game.lane += (game.targetLane - game.lane) * 0.2 * d;
    game.offset += game.speed * d;
    game.distance += 0.065 * game.speed * d;
    game.speed = Math.min(8.8, game.speed + 0.002 * d);
    game.spawn -= d;
    game.shake = Math.max(0, game.shake - 0.55 * d);
    game.boost = Math.max(0, game.boost - 0.035 * d);
    enginePitch();
    const stage = Math.min(3, Math.floor((game.distance / cfg.duration) * 4));
    if (stage !== game.stage) { game.stage = stage; setVision(cfg.stages[stage][0], cfg.stages[stage][1]); soundStage(); }
    if (game.spawn <= 0) { spawn(); game.spawn = Math.max(15, 40 - game.speed * 2.4); }
    game.items.forEach(i => { i.y += game.speed * i.v * d; });
    game.particles.forEach(p => { p.x += p.vx * d; p.y += p.vy * d; p.life -= 0.025 * d; p.size *= 0.99; });
    collide();
    game.items = game.items.filter(i => !i.hit && i.y < game.h + 90);
    game.particles = game.particles.filter(p => p.life > 0 && p.size > 0.4);
    if (game.distance >= cfg.duration) finish(true);
    hud();
  }

  function spawn() {
    const power = Math.random() > 0.38;
    const arr = power ? cfg.powerUps : cfg.blockers;
    const [label, icon, color, msg] = arr[Math.floor(Math.random() * arr.length)];
    game.items.push({ label, icon, color, msg, type: power ? 'power' : 'blocker', lane: Math.floor(Math.random() * 3), y: -70, size: power ? 50 : 56, v: power ? 1.05 : 1.18, hit: false });
  }

  function collide() {
    const p = playerBox();
    game.items.forEach(i => {
      const x = laneX(i.lane), b = { x: x - i.size / 2, y: i.y - i.size / 2, w: i.size, h: i.size };
      if (p.x < b.x + b.w && p.x + p.w > b.x && p.y < b.y + b.h && p.y + p.h > b.y) {
        i.hit = true;
        i.type === 'power' ? collect(i, x, i.y) : hit(i, x, i.y);
      }
    });
  }

  function collect(i, x, y) {
    game.score += 15;
    game.speed = Math.min(9, game.speed + 0.16);
    game.boost = 1;
    game.collected.unshift(i.label);
    game.collected = [...new Set(game.collected)].slice(0, 8);
    setVision(`${i.icon} ${i.label}`, i.msg);
    $('[data-log]', game.overlay).innerHTML = game.collected.map(t => `<span class="race-chip"><i class="bi bi-check2-circle"></i>${t}</span>`).join('');
    particles(x, y, i.color, 24, 4.5);
    tip(`+15 pontos — ${i.label}`);
    soundCollect();
    vibrate(18);
  }

  function hit(i, x, y) {
    game.health--;
    game.score = Math.max(0, game.score - 8);
    game.speed = Math.max(3.4, game.speed - 0.45);
    game.shake = 10;
    setVision(`${i.icon} ${i.label}`, i.msg);
    particles(x, y, i.color, 28, 6.5);
    tip(`${i.label} travou o projeto`);
    soundHit();
    vibrate([35, 35, 50]);
    if (game.health <= 0) finish(false);
  }

  function finish(ok) {
    game.running = false;
    game.finished = true;
    stopEngine(false);
    cancelAnimationFrame(game.raf);
    const level = game.score >= 170 ? 'Arquiteto Digital' : game.score >= 110 ? 'Construtor GovTech' : 'Piloto em Treino';
    $('[data-end-title]', game.overlay).textContent = ok ? `Meta alcançada: ${level}` : 'Projeto travado, mas com aprendizagem';
    $('[data-end-text]', game.overlay).innerHTML = ok ? `Pontuação final: <strong>${game.score}</strong>. Transformaste visão técnica em impacto.` : `Pontuação final: <strong>${game.score}</strong>. Revê a arquitetura e volta à pista.`;
    $('[data-end-screen]', game.overlay).classList.add('show');
    ok ? soundWin() : soundGameOver();
    vibrate(ok ? [40, 40, 80, 40, 120] : [80, 40, 80]);
    draw();
  }

  function hud() {
    if (!game.overlay) return;
    const pct = Math.max(0, Math.min(100, game.distance));
    $('[data-score]', game.overlay).textContent = game.score;
    $('[data-health]', game.overlay).textContent = '❤️'.repeat(Math.max(0, game.health)) || '0';
    $('[data-speed]', game.overlay).textContent = `${game.speed.toFixed(1)}x`;
    $('[data-progress-text]', game.overlay).textContent = `${Math.floor(pct)}%`;
    $('[data-progress]', game.overlay).style.width = `${pct}%`;
    $('[data-stage]', game.overlay).textContent = cfg.stages[game.stage][0];
  }

  function setVision(title, text) {
    $('[data-vision-title]', game.overlay).textContent = title;
    $('[data-vision-text]', game.overlay).textContent = text;
  }

  function tip(text) {
    const el = $('[data-tip]', game.overlay);
    el.textContent = text;
    el.classList.add('pulse');
    clearTimeout(game.tipTimer);
    game.tipTimer = setTimeout(() => { el.textContent = 'Arrasta na pista ou toca nos botões'; el.classList.remove('pulse'); }, 1600);
  }

  function resize() {
    const r = game.canvas.parentElement.getBoundingClientRect(), dpr = Math.max(1, Math.min(devicePixelRatio || 1, 2));
    game.w = Math.floor(r.width); game.h = Math.floor(r.height);
    game.canvas.width = Math.floor(game.w * dpr); game.canvas.height = Math.floor(game.h * dpr);
    game.canvas.style.width = `${game.w}px`; game.canvas.style.height = `${game.h}px`;
    game.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    if (!game.ctx) return;
    const c = game.ctx, w = game.w || 600, h = game.h || 420;
    c.clearRect(0, 0, w, h);
    c.save(); if (game.shake) c.translate((Math.random() - .5) * game.shake, (Math.random() - .5) * game.shake);
    bg(c, w, h); road(c, w, h); game.items.forEach(i => item(c, i)); game.particles.forEach(p => particle(c, p)); car(c, laneX(game.lane), h - 86); speedLines(c, w, h); c.restore();
  }

  function bg(c, w, h) { const g = c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#07172a'); g.addColorStop(1,'#020617'); c.fillStyle = g; c.fillRect(0,0,w,h); }
  function road(c, w, h) {
    const top = w*.26, bot = w*.82, cx = w/2;
    c.beginPath(); c.moveTo(cx-top/2,0); c.lineTo(cx+top/2,0); c.lineTo(cx+bot/2,h); c.lineTo(cx-bot/2,h); c.closePath();
    c.fillStyle = '#111827'; c.fill(); c.strokeStyle = game.boost ? 'rgba(34,197,94,.7)' : 'rgba(6,182,212,.45)'; c.lineWidth = game.boost ? 5 : 3; c.stroke();
    for (let l=1;l<=2;l++) { c.setLineDash([18,20]); c.lineDashOffset = -game.offset; c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=2; c.beginPath(); c.moveTo(cx-top/2+(top/3)*l,0); c.lineTo(cx-bot/2+(bot/3)*l,h); c.stroke(); c.setLineDash([]); }
  }
  function item(c, i) { const x = laneX(i.lane); c.save(); c.translate(x, i.y); c.shadowColor=i.color; c.shadowBlur=i.type==='power'?18:10; c.fillStyle=i.type==='power'?'rgba(34,197,94,.18)':'rgba(239,68,68,.18)'; c.strokeStyle=i.color; round(c,-i.size/2,-i.size/2,i.size,i.size,15); c.fill(); c.lineWidth=2; c.stroke(); c.shadowBlur=0; c.textAlign='center'; c.textBaseline='middle'; c.fillStyle='#fff'; c.font='20px system-ui'; c.fillText(i.icon,0,-7); c.font='700 10px system-ui'; c.fillText(i.label,0,15); c.restore(); }
  function particle(c, p) { c.save(); c.globalAlpha=Math.max(0,p.life); c.fillStyle=p.color; c.shadowColor=p.color; c.shadowBlur=12; c.beginPath(); c.arc(p.x,p.y,p.size,0,Math.PI*2); c.fill(); c.restore(); }
  function car(c, x, y) { c.save(); c.translate(x,y); c.rotate((game.targetLane-game.lane)*.14); c.shadowColor=game.boost?'rgba(34,197,94,.75)':'rgba(6,182,212,.55)'; c.shadowBlur=game.boost?34:24; c.fillStyle='#06b6d4'; round(c,-26,-42,52,84,16); c.fill(); c.shadowBlur=0; c.fillStyle='#8b5cf6'; round(c,-19,-33,38,38,12); c.fill(); c.fillStyle='rgba(255,255,255,.86)'; round(c,-12,-26,24,18,8); c.fill(); c.fillStyle='#020617'; round(c,-31,-25,8,24,4); round(c,23,-25,8,24,4); round(c,-31,15,8,24,4); round(c,23,15,8,24,4); c.fill(); c.fillStyle='#22c55e'; c.font='900 13px system-ui'; c.textAlign='center'; c.fillText('JN',0,25); c.fillStyle=game.boost?'rgba(34,197,94,.66)':'rgba(34,197,94,.42)'; c.beginPath(); c.moveTo(-15,46); c.lineTo(0,78+Math.random()*12); c.lineTo(15,46); c.closePath(); c.fill(); c.restore(); }
  function speedLines(c,w,h) { if(!game.running||game.paused)return; c.save(); c.globalAlpha=game.boost?.36:.22; c.strokeStyle=game.boost?'#22c55e':'#67e8f9'; c.lineWidth=game.boost?3:2; for(let i=0;i<20;i++){const x=(i*73+game.offset*2)%w,y=(i*59+game.offset*5)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x-14,y+44);c.stroke();} c.restore(); }

  function particles(x,y,color,count,power){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,v=1+Math.random()*power;game.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,size:2+Math.random()*5,life:.7+Math.random()*.5,color});}}
  function playerBox(){const x=laneX(game.lane),y=game.h-86;return{x:x-27,y:y-43,w:54,h:86};}
  function laneX(lane){const margin=Math.max(64,(game.w||600)*.22),road=(game.w||600)-margin*2;return margin+road*(lane+.5)/3;}
  function move(d){ if(!game.running) start(); game.targetLane=Math.max(0,Math.min(2,game.targetLane+d)); vibrate(8); soundClick(); }
  function bindHold(btn,d){let t=null; const down=e=>{e.preventDefault(); move(d); t=setInterval(()=>move(d),260);}; const up=()=>{clearInterval(t);t=null;}; btn.addEventListener('pointerdown',down); btn.addEventListener('pointerup',up); btn.addEventListener('pointerleave',up); btn.addEventListener('pointercancel',up);}
  function bindCanvas(){let sx=null,sy=null; game.canvas.addEventListener('pointerdown',e=>{if(!game.running)start(); sx=e.clientX; sy=e.clientY; game.canvas.setPointerCapture?.(e.pointerId); e.preventDefault();}); game.canvas.addEventListener('pointermove',e=>{if(sx===null)return; const r=game.canvas.getBoundingClientRect(); game.targetLane=Math.max(0,Math.min(2,Math.floor(((e.clientX-r.left)/r.width)*3))); e.preventDefault();}); game.canvas.addEventListener('pointerup',e=>{if(sx!==null){const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>26&&Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1);} sx=null; sy=null; e.preventDefault();}); }
  function bindKeys(){document.addEventListener('keydown',e=>{if(!game.open)return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){e.preventDefault();move(-1);} if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){e.preventDefault();move(1);} if(e.key===' '){e.preventDefault(); game.running?pause():start();}});}
  function round(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}

  function initAudio(){ if(!game.sound||game.audioReady)return; const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return; const ctx=new AC(), master=ctx.createGain(); master.gain.value=.22; master.connect(ctx.destination); game.audio={ctx,master,engine:null,gain:null}; game.audioReady=true; ctx.resume?.(); }
  function tone(f=440,d=.12,type='sine',vol=.1,to=null){ if(!game.sound)return; initAudio(); const a=game.audio; if(!a)return; a.ctx.resume?.(); const o=a.ctx.createOscillator(), g=a.ctx.createGain(); o.type=type; o.frequency.value=f; if(to)o.frequency.exponentialRampToValueAtTime(Math.max(20,to),a.ctx.currentTime+d); g.gain.setValueAtTime(.0001,a.ctx.currentTime); g.gain.exponentialRampToValueAtTime(vol,a.ctx.currentTime+.015); g.gain.exponentialRampToValueAtTime(.0001,a.ctx.currentTime+d); o.connect(g); g.connect(a.master); o.start(); o.stop(a.ctx.currentTime+d+.03); }
  function startEngine(){ if(!game.sound)return; initAudio(); const a=game.audio; if(!a||a.engine)return; const o=a.ctx.createOscillator(), g=a.ctx.createGain(); o.type='sawtooth'; o.frequency.value=72+game.speed*12; g.gain.value=.018; o.connect(g); g.connect(a.master); o.start(); a.engine=o; a.gain=g; }
  function stopEngine(full=true){const a=game.audio;if(!a?.engine)return;const now=a.ctx.currentTime;a.gain.gain.linearRampToValueAtTime(.0001,now+.18);a.engine.stop(now+.2);a.engine=null;a.gain=null;if(full)a.ctx.suspend?.();}
  function enginePitch(){const a=game.audio;if(!a?.engine)return;const now=a.ctx.currentTime;a.engine.frequency.setTargetAtTime(72+game.speed*15+game.boost*40,now,.08);a.gain.gain.setTargetAtTime(game.boost?.038:.02,now,.08);}
  function soundClick(){tone(260,.05,'triangle',.04,320);} function soundStart(){tone(220,.09,'triangle',.07,360);setTimeout(()=>tone(440,.12,'triangle',.065,660),80);} function soundCollect(){tone(560,.08,'sine',.1,900);setTimeout(()=>tone(1040,.09,'sine',.08,1320),55);} function soundHit(){tone(160,.16,'sawtooth',.13,70);} function soundStage(){tone(420,.08,'triangle',.06,640);} function soundWin(){[440,660,880,1320].forEach((f,i)=>setTimeout(()=>tone(f,.14,'sine',.09,f*1.15),i*90));} function soundGameOver(){[220,160,110].forEach((f,i)=>setTimeout(()=>tone(f,.15,'sawtooth',.08,f*.72),i*110));}
  function vibrate(p){if('vibrate'in navigator)navigator.vibrate(p);}
})();
