// Launcher da Missão Digital — abre o jogo numa rota fullscreen dedicada.
(function () {
  const GAME_ROUTE = 'missao-digital.html';

  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    addGameNav();
    addHeroGameCTA();
    redirectOldHash();
    bindOpeners();
  });

  function addGameNav() {
    const nav = document.querySelector('.nav-box .nav');
    if (!nav || nav.querySelector('[data-game-open]')) return;

    const item = document.createElement('li');
    item.className = 'nav-item';
    item.innerHTML = `<a class="nav-link" href="${GAME_ROUTE}" data-game-open><i class="bi bi-arrow-right"></i>Jogo</a>`;

    const contact = nav.querySelector('a[href="#contact"]')?.closest('li');
    if (contact) nav.insertBefore(item, contact);
    else nav.appendChild(item);
  }

  function addHeroGameCTA() {
    const hero = document.querySelector('#about .col-12, #about .col-xl-10');
    if (!hero || document.querySelector('.game-anchor-button')) return;

    const btn = document.createElement('a');
    btn.href = GAME_ROUTE;
    btn.className = 'game-anchor-button';
    btn.setAttribute('data-game-open', 'true');
    btn.innerHTML = '<i class="bi bi-controller"></i> Jogar Missão Digital';
    hero.appendChild(btn);
  }

  function redirectOldHash() {
    if (window.location.hash === '#missao-digital') {
      window.location.replace(GAME_ROUTE);
    }
  }

  function bindOpeners() {
    document.addEventListener('click', (event) => {
      const opener = event.target.closest('[data-game-open], a[href="#missao-digital"]');
      if (!opener) return;
      event.preventDefault();
      window.location.href = GAME_ROUTE;
    });
  }
})();
