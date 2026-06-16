// Sons e efeitos tácteis para a Corrida Digital
(function () {
  const audio = {
    ctx: null,
    master: null,
    engineOsc: null,
    engineGain: null,
    muted: localStorage.getItem('raceMuted') === 'true',
    ready: false,
    lastTip: '',
    observer: null
  };

  function getCtx() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    if (!audio.ctx) {
      audio.ctx = new AudioContext();
      audio.master = audio.ctx.createGain();
      audio.master.gain.value = audio.muted ? 0 : 0.42;
      audio.master.connect(audio.ctx.destination);
    }

    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    audio.ready = true;
    return audio.ctx;
  }

  function now() {
    const ctx = getCtx();
    return ctx ? ctx.currentTime : 0;
  }

  function vibrate(pattern) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch { /* ignore */ }
    }
  }

  function setMuted(value) {
    audio.muted = value;
    localStorage.setItem('raceMuted', value ? 'true' : 'false');
    if (audio.master) {
      audio.master.gain.setTargetAtTime(value ? 0 : 0.42, now(), 0.02);
    }
    updateSoundButton();
  }

  function tone(freq = 440, duration = 0.12, type = 'sine', gain = 0.14, endFreq = null) {
    const ctx = getCtx();
    if (!ctx || audio.muted) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), ctx.currentTime + duration);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g);
    g.connect(audio.master);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.03);
  }

  function noise(duration = 0.18, gain = 0.12) {
    const ctx = getCtx();
    if (!ctx || audio.muted) return;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    g.gain.value = gain;
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(g);
    g.connect(audio.master);
    source.start(ctx.currentTime);
  }

  function startEngine() {
    const ctx = getCtx();
    if (!ctx || audio.muted || audio.engineOsc) return;

    audio.engineOsc = ctx.createOscillator();
    audio.engineGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    audio.engineOsc.type = 'sawtooth';
    audio.engineOsc.frequency.value = 72;
    filter.type = 'lowpass';
    filter.frequency.value = 220;
    audio.engineGain.gain.value = 0.0001;
    audio.engineGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.4);
    audio.engineOsc.connect(filter);
    filter.connect(audio.engineGain);
    audio.engineGain.connect(audio.master);
    audio.engineOsc.start(ctx.currentTime);
  }

  function stopEngine() {
    const ctx = audio.ctx;
    if (!ctx || !audio.engineOsc) return;
    try {
      audio.engineGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      audio.engineOsc.stop(ctx.currentTime + 0.25);
    } catch { /* ignore */ }
    audio.engineOsc = null;
    audio.engineGain = null;
  }

  function soundStart() {
    getCtx();
    tone(220, 0.08, 'triangle', 0.08, 330);
    setTimeout(() => tone(330, 0.09, 'triangle', 0.1, 520), 85);
    setTimeout(() => tone(520, 0.16, 'triangle', 0.12, 780), 170);
    vibrate([35, 30, 45]);
    setTimeout(startEngine, 230);
  }

  function soundCollect() {
    tone(620, 0.08, 'sine', 0.08, 880);
    setTimeout(() => tone(980, 0.11, 'sine', 0.08, 1320), 70);
    vibrate(25);
  }

  function soundHit() {
    tone(160, 0.16, 'sawtooth', 0.13, 70);
    noise(0.18, 0.1);
    vibrate([80, 35, 80]);
  }

  function soundLane() {
    tone(360, 0.055, 'square', 0.035, 460);
    vibrate(12);
  }

  function soundPause() {
    tone(330, 0.08, 'triangle', 0.05, 240);
  }

  function soundFinish() {
    stopEngine();
    tone(440, 0.1, 'triangle', 0.08, 660);
    setTimeout(() => tone(660, 0.1, 'triangle', 0.09, 880), 100);
    setTimeout(() => tone(880, 0.18, 'triangle', 0.1, 1320), 200);
    vibrate([45, 40, 45, 40, 90]);
  }

  function soundButton() {
    tone(520, 0.045, 'sine', 0.025, 720);
  }

  function ensureSoundButton() {
    const overlay = document.querySelector('#digitalRaceOverlay');
    if (!overlay || overlay.querySelector('[data-race-sound]')) return;

    const actions = overlay.querySelector('.race-topbar .race-actions');
    if (!actions) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'race-btn';
    btn.setAttribute('data-race-sound', 'true');
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      getCtx();
      setMuted(!audio.muted);
      if (!audio.muted) soundButton();
    });
    actions.insertBefore(btn, actions.firstChild);
    updateSoundButton();
  }

  function updateSoundButton() {
    const overlay = document.querySelector('#digitalRaceOverlay');
    const btn = overlay?.querySelector('[data-race-sound]');
    if (!btn) return;

    btn.classList.toggle('sound-muted', audio.muted);
    btn.innerHTML = audio.muted
      ? '<i class="bi bi-volume-mute"></i> Som off'
      : '<i class="bi bi-volume-up"></i> Som on';
    overlay.classList.toggle('race-sound-on', !audio.muted);
  }

  function watchTip() {
    const overlay = document.querySelector('#digitalRaceOverlay');
    const tip = overlay?.querySelector('[data-race-tip]');
    if (!tip || audio.observer) return;

    audio.lastTip = tip.textContent;
    audio.observer = new MutationObserver(() => {
      const text = tip.textContent || '';
      if (text === audio.lastTip) return;
      audio.lastTip = text;
      if (text.startsWith('+')) soundCollect();
      if (text.startsWith('Atenção')) soundHit();
    });
    audio.observer.observe(tip, { childList: true, characterData: true, subtree: true });
  }

  function hookOverlay() {
    ensureSoundButton();
    watchTip();
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest('[data-game-open]')) {
      getCtx();
      setTimeout(hookOverlay, 120);
      soundButton();
    }

    if (target.closest('[data-race-start]')) {
      hookOverlay();
      soundStart();
    }

    if (target.closest('[data-race-close]')) {
      soundButton();
      stopEngine();
    }

    if (target.closest('[data-race-restart]')) {
      soundStart();
    }

    if (target.closest('[data-race-pause]')) {
      soundPause();
    }

    if (target.closest('[data-race-left], [data-race-right]')) {
      soundLane();
      const control = target.closest('[data-race-left], [data-race-right]');
      control.classList.add('control-pulse');
      setTimeout(() => control.classList.remove('control-pulse'), 260);
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (!document.querySelector('#digitalRaceOverlay.open')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'd') {
      getCtx();
      soundLane();
    }
    if (event.key === 'Escape') stopEngine();
  });

  const overlayObserver = new MutationObserver(() => hookOverlay());
  overlayObserver.observe(document.body, { childList: true, subtree: true });
})();
