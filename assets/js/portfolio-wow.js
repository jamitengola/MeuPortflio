// Interactive portfolio layer — accessible, lightweight and dependency-free.
(function () {
  const onReady = (fn) => document.readyState !== 'loading'
    ? fn()
    : document.addEventListener('DOMContentLoaded', fn, { once: true });

  onReady(() => {
    injectOrbs();
    addDynamicRole();
    addPortfolioFilters();
    animateCounters();
    addCommandPalette();
    enableSpotlight();
    enableReveal();
    enableActiveNavigation();
  });

  function injectOrbs() {
    if (document.querySelector('.wow-orbs')) return;
    const orbs = document.createElement('div');
    orbs.className = 'wow-orbs';
    orbs.setAttribute('aria-hidden', 'true');
    orbs.innerHTML = '<span></span><span></span><span></span>';
    document.body.prepend(orbs);
  }

  function addDynamicRole() {
    const title = document.querySelector('.hero-heading');
    if (!title || document.querySelector('.dynamic-role')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'dynamic-role';
    wrapper.setAttribute('aria-live', 'polite');
    wrapper.innerHTML = '<span class="role-text"></span><span class="cursor-pipe" aria-hidden="true">|</span>';
    title.insertAdjacentElement('afterend', wrapper);

    const phrases = [
      'Construo plataformas digitais para problemas reais.',
      'Ligo sistemas, dados, processos e pessoas.',
      'Transformo informação em decisões com BI.',
      'Aplico inteligência artificial com propósito.'
    ];
    const target = wrapper.querySelector('.role-text');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      target.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const tick = () => {
      const phrase = phrases[phraseIndex];
      target.textContent = phrase.slice(0, charIndex);
      if (!deleting) charIndex += 1;
      else charIndex -= 1;

      let delay = deleting ? 30 : 48;
      if (!deleting && charIndex > phrase.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        delay = 260;
      }
      window.setTimeout(tick, delay);
    };
    tick();
  }

  function addPortfolioFilters() {
    const intro = document.querySelector('#portfolio .col-12.col-md-10, #portfolio .col-12.col-lg-8');
    const slides = [...document.querySelectorAll('.portfolio-slider .swiper-slide')];
    if (!intro || !slides.length || document.querySelector('.portfolio-filter-bar')) return;

    const filters = ['Todos', 'GovTech', 'Dados', 'AI', 'Mobile', 'Empresa'];
    const bar = document.createElement('div');
    bar.className = 'portfolio-filter-bar';
    bar.setAttribute('aria-label', 'Filtrar projetos');
    bar.innerHTML = filters.map((filter, index) => (
      `<button type="button" class="${index === 0 ? 'active' : ''}" data-filter="${filter}">${filter}</button>`
    )).join('');
    intro.appendChild(bar);

    bar.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      bar.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      const filter = button.dataset.filter;
      slides.forEach((slide) => {
        const categories = slide.dataset.projectCategory || '';
        slide.classList.toggle('wow-hidden', filter !== 'Todos' && !categories.includes(filter));
      });
      const slider = document.querySelector('.portfolio-slider');
      if (slider && slider.swiper) {
        slider.swiper.update();
        slider.swiper.slideTo(0);
      }
    });
  }

  function animateCounters() {
    const counters = [...document.querySelectorAll('[data-counter]')];
    if (!counters.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.animated) return;
        entry.target.dataset.animated = 'true';
        const target = Number(entry.target.dataset.counter || 0);
        if (!target || reduceMotion) return;
        const suffix = entry.target.textContent.replace(/[0-9]/g, '');
        const start = performance.now();
        const duration = 1100;
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function addCommandPalette() {
    if (document.querySelector('.command-launcher')) return;
    const actions = [
      ['bi-person-badge', 'Sobre Jamite', 'Perfil e experiência profissional', '#about', 'sobre perfil biografia'],
      ['bi-kanban', 'Projetos em destaque', 'GovTech, dados, IA e mobile', '#portfolio', 'projetos portfolio trabalhos'],
      ['bi-person-vcard', 'Carteira Profissional', 'Plataforma GovTech em produção', 'https://carteiraprofissional.vercel.app', 'carteira profissional govtech'],
      ['bi-stars', 'ALDA', 'AI Meeting Coach open source', 'https://github.com/jamitengola/alda', 'alda ai open source'],
      ['bi-briefcase', 'Experiência', '12 anos em engenharia de software', '#experience', 'experiencia carreira stack'],
      ['bi-bug', 'Jogar Bug Hunter', 'Arcade técnico do portfólio', '#', 'jogo bug hunter'],
      ['bi-whatsapp', 'WhatsApp', 'Contacto rápido', 'https://wa.me/244924482552', 'whatsapp contacto'],
      ['bi-github', 'GitHub', '@jamitengola', 'https://github.com/jamitengola', 'github codigo repositorios']
    ].map(([icon, title, desc, href, keys]) => ({ icon, title, desc, href, keys }));

    const launcher = document.createElement('button');
    launcher.className = 'command-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Abrir menu rápido');
    launcher.innerHTML = '<i class="bi bi-command"></i> Menu rápido <strong>/</strong>';
    document.body.appendChild(launcher);

    const overlay = document.createElement('div');
    overlay.className = 'command-overlay';
    overlay.innerHTML = `
      <div class="command-panel" role="dialog" aria-modal="true" aria-label="Menu rápido do portfólio">
        <input class="command-input" type="search" placeholder="Pesquisar projetos, stack ou contacto..." autocomplete="off" />
        <div class="command-results"></div>
        <div class="command-hint">ESC para fechar • “/” para abrir</div>
      </div>`;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.command-input');
    const results = overlay.querySelector('.command-results');
    const render = (query = '') => {
      const q = query.trim().toLowerCase();
      const filtered = actions.filter((item) => `${item.title} ${item.desc} ${item.keys}`.toLowerCase().includes(q));
      results.innerHTML = filtered.map((item) => `
        <a class="command-item" href="${item.href}" ${item.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} ${item.title === 'Jogar Bug Hunter' ? 'data-game-open' : ''}>
          <i class="bi ${item.icon}"></i><span><strong>${item.title}</strong><small>${item.desc}</small></span>
        </a>`).join('') || '<div class="command-item"><i class="bi bi-search"></i><span><strong>Sem resultados</strong><small>Tente outro termo.</small></span></div>';
    };
    render();

    const open = () => {
      overlay.classList.add('open');
      render(input.value);
      window.setTimeout(() => input.focus(), 50);
    };
    const close = () => overlay.classList.remove('open');
    launcher.addEventListener('click', open);
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
    input.addEventListener('input', () => render(input.value));
    results.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
      if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        open();
      }
    });
  }

  function enableSpotlight() {
    window.addEventListener('pointermove', (event) => {
      document.documentElement.style.setProperty('--wow-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--wow-y', `${event.clientY}px`);
    }, { passive: true });
  }

  function enableReveal() {
    const items = [...document.querySelectorAll('.service-card, .value-card, .award-card, .project-card, .timeline-item')];
    items.forEach((item) => item.classList.add('wow-reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function enableActiveNavigation() {
    const links = [...document.querySelectorAll('.nav-box a[href^="#"]')];
    const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();
