// Garante que o botão da Corrida Digital aparece sempre na home
(function () {
  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    ensureHeroButton();
    ensureMenuButton();
    ensureFloatingButton();
  });

  function ensureHeroButton() {
    if (document.querySelector('.game-anchor-button')) return;

    const hero = document.querySelector('#about .col-12, #about .col-xl-10, #about .container .row > div, #about .container');
    if (!hero) return;

    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'game-anchor-button';
    btn.setAttribute('data-game-open', 'true');
    btn.innerHTML = '<i class="bi bi-controller"></i> Jogar Corrida Digital';
    hero.appendChild(btn);
  }

  function ensureMenuButton() {
    const nav = document.querySelector('.nav-box .nav');
    if (!nav || nav.querySelector('[data-game-open]')) return;

    const item = document.createElement('li');
    item.className = 'nav-item';
    item.innerHTML = '<a class="nav-link" href="#" data-game-open><i class="bi bi-arrow-right"></i>Jogo</a>';

    const contact = nav.querySelector('a[href="#contact"]')?.closest('li');
    if (contact) nav.insertBefore(item, contact);
    else nav.appendChild(item);
  }

  function ensureFloatingButton() {
    if (document.querySelector('.race-floating-launcher')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'race-floating-launcher';
    btn.setAttribute('data-game-open', 'true');
    btn.innerHTML = '<i class="bi bi-controller"></i><span>Jogar</span>';
    document.body.appendChild(btn);
  }
})();
