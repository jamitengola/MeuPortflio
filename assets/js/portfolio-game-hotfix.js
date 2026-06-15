// Hotfix: garante abertura do jogo quando o visitante entra direto em #missao-digital
(function () {
  const GAME_HASH = '#missao-digital';
  const GAME_SCRIPT = 'assets/js/portfolio-game.js?v=20260615-hotfix2';
  const GAME_CSS = 'assets/css/portfolio-game.css?v=20260615-hotfix2';
  const GAME_FIX_CSS = 'assets/css/portfolio-game-fix.css?v=20260615-hotfix2';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function ensureStyles() {
    if (!document.querySelector('link[href*="portfolio-game.css"]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = GAME_CSS;
      document.head.appendChild(css);
    }

    if (!document.querySelector('link[href*="portfolio-game-fix.css"]')) {
      const cssFix = document.createElement('link');
      cssFix.rel = 'stylesheet';
      cssFix.href = GAME_FIX_CSS;
      document.head.appendChild(cssFix);
    }
  }

  function ensureScript() {
    if (document.querySelector('#missao-digital')) return;
    if (document.querySelector('script[src*="portfolio-game.js"]')) return;

    const script = document.createElement('script');
    script.src = GAME_SCRIPT;
    script.defer = true;
    document.head.appendChild(script);
  }

  function scrollToGame(force) {
    if (!force && window.location.hash !== GAME_HASH) return;

    let attempts = 0;
    const timer = setInterval(() => {
      const game = document.querySelector('#missao-digital');
      attempts += 1;

      if (game) {
        clearInterval(timer);
        game.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const shell = game.querySelector('.digital-game-shell');
        shell?.classList.add('game-highlight');
        setTimeout(() => shell?.classList.remove('game-highlight'), 1400);
      }

      if (attempts > 24) clearInterval(timer);
    }, 150);
  }

  ready(() => {
    ensureStyles();
    ensureScript();
    scrollToGame(window.location.hash === GAME_HASH);

    document.addEventListener('click', (event) => {
      const opener = event.target.closest('a[href="#missao-digital"], [data-game-open]');
      if (!opener) return;
      ensureStyles();
      ensureScript();
      setTimeout(() => scrollToGame(true), 80);
    });

    window.addEventListener('hashchange', () => scrollToGame(window.location.hash === GAME_HASH));
  });
})();
