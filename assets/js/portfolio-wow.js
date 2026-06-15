// Camada de interatividade para o portfolio de Jamite Ngola
(function () {
  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  ready(() => {
    injectOrbs();
    addDynamicRole();
    addImpactSection();
    addTechOrbit();
    addPortfolioFilters();
    animateCounters();
    addCommandPalette();
    enableSpotlight();
    enableReveal();
  });

  function injectOrbs() {
    if (document.querySelector('.wow-orbs')) return;
    const orbs = document.createElement('div');
    orbs.className = 'wow-orbs';
    orbs.setAttribute('aria-hidden', 'true');
    orbs.innerHTML = '<span></span><span></span><span></span><span></span>';
    document.body.prepend(orbs);
  }

  function addDynamicRole() {
    const heroTitle = document.querySelector('.hero-heading');
    if (!heroTitle || document.querySelector('.dynamic-role')) return;

    const role = document.createElement('div');
    role.className = 'dynamic-role';
    role.innerHTML = '<span class="role-text"></span><span class="cursor-pipe">|</span>';
    heroTitle.insertAdjacentElement('afterend', role);

    const phrases = [
      'Construo sistemas que resolvem problemas reais.',
      'Transformo dados em decisões com Power BI.',
      'Crio plataformas GovTech, web, mobile e APIs.',
      'Integro software, processos e inteligência artificial.'
    ];

    const target = role.querySelector('.role-text');
    let phrase = 0;
    let index = 0;
    let deleting = false;

    const tick = () => {
      const current = phrases[phrase];
      target.textContent = deleting ? current.slice(0, index--) : current.slice(0, index++);

      if (!deleting && index > current.length + 10) deleting = true;
      if (deleting && index < 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        index = 0;
      }

      setTimeout(tick, deleting ? 34 : 58);
    };

    tick();
  }

  function addImpactSection() {
    const aboutContainer = document.querySelector('#about')?.nextElementSibling;
    if (!aboutContainer || document.querySelector('#impacto-digital')) return;

    const section = document.createElement('section');
    section.id = 'impacto-digital';
    section.className = 'container wow-section wow-reveal';
    section.innerHTML = `
      <div class="row g-4 align-items-stretch">
        <div class="col-12 col-lg-7">
          <div class="wow-terminal h-100">
            <div class="wow-terminal-top">
              <span class="wow-dot"></span><span class="wow-dot"></span><span class="wow-dot"></span>
              <span class="ms-2 text-white-04">jamite@portfolio:~</span>
            </div>
            <div class="wow-terminal-body" id="wow-terminal-body" aria-live="polite"></div>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <div class="wow-grid h-100" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
            <div class="wow-card wow-reveal">
              <i class="bi bi-building-check"></i>
              <h4>GovTech</h4>
              <p>Portais, integrações e serviços digitais para instituições.</p>
            </div>
            <div class="wow-card wow-reveal">
              <i class="bi bi-graph-up-arrow"></i>
              <h4>Dados</h4>
              <p>Dashboards, indicadores e relatórios executivos.</p>
            </div>
            <div class="wow-card wow-reveal">
              <i class="bi bi-cpu"></i>
              <h4>Software</h4>
              <p>Backends, frontends, mobile apps e sistemas de gestão.</p>
            </div>
            <div class="wow-card wow-reveal">
              <i class="bi bi-stars"></i>
              <h4>IA</h4>
              <p>Ferramentas inteligentes para produtividade e decisão.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    aboutContainer.insertAdjacentElement('afterend', section);
    runTerminal();
  }

  function runTerminal() {
    const terminal = document.getElementById('wow-terminal-body');
    if (!terminal) return;

    const lines = [
      '<span class="prompt">$</span> whoami',
      '<span class="accent">Jamite Ngola</span> — Full-stack Developer, GovTech Builder e especialista em soluções digitais.',
      '<span class="prompt">$</span> stack --principal',
      '<span class="muted">.NET • React • Next.js • Flutter • SQL Server • PostgreSQL • Power BI • Docker • AI</span>',
      '<span class="prompt">$</span> impacto --modo producao',
      'Sistemas para emprego, formação, dados, portais institucionais, e-commerce, mobile e automação.',
      '<span class="prompt">$</span> call-to-action',
      '<span class="accent">Vamos transformar uma necessidade real num produto digital bem construído.</span>'
    ];

    let i = 0;
    const print = () => {
      if (i >= lines.length) return;
      const p = document.createElement('div');
      p.innerHTML = lines[i++];
      terminal.appendChild(p);
      setTimeout(print, i % 2 === 0 ? 680 : 420);
    };
    setTimeout(print, 500);
  }

  function addTechOrbit() {
    const services = document.querySelector('#services');
    if (!services || document.querySelector('#stack-interativo')) return;

    const section = document.createElement('section');
    section.id = 'stack-interativo';
    section.className = 'section-box wow-reveal';
    section.innerHTML = `
      <div class="section-sm bg-dark border-radius-1">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-12 col-lg-5">
              <span class="title-heading text-white-04">Stack interativo</span>
              <h1 class="display-4 fw-medium">Tecnologia com propósito</h1>
              <p>
                A minha apresentação agora mostra melhor a combinação que me diferencia:
                engenharia de software, dados, automação e inteligência artificial aplicada.
              </p>
              <button class="wow-action-btn" type="button" data-open-command>
                Explorar por comando <span class="text-white-04">/</span>
              </button>
            </div>
            <div class="col-12 col-lg-7">
              <div class="tech-orbit" aria-label="Tecnologias principais">
                <div class="tech-orbit-core"><strong>Jamite<br/>Ngola</strong></div>
                ${['.NET', 'React', 'Next.js', 'Flutter', 'Power BI', 'Docker', 'SQL', 'AI'].map((tech, idx) => `
                  <span class="tech-orbit-chip" style="--angle:${idx * 45}deg;--delay:${idx * -0.25}s">${tech}</span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    services.insertAdjacentElement('afterend', section);
  }

  function addPortfolioFilters() {
    const portfolio = document.querySelector('#portfolio');
    const intro = portfolio?.querySelector('.col-12.col-md-10, .col-12.col-lg-8');
    const slides = [...document.querySelectorAll('.portfolio-slider .swiper-slide')];
    if (!portfolio || !intro || !slides.length || document.querySelector('.portfolio-filter-bar')) return;

    const filters = ['Todos', 'GovTech', 'AI', 'Dados', 'Mobile', 'Empresa'];
    const bar = document.createElement('div');
    bar.className = 'portfolio-filter-bar';
    bar.innerHTML = filters.map((f, i) => `<button type="button" class="${i === 0 ? 'active' : ''}" data-filter="${f}">${f}</button>`).join('');
    intro.appendChild(bar);

    const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const matches = (slide, filter) => {
      if (filter === 'Todos') return true;
      const text = normalize(slide.textContent || '');
      const f = normalize(filter);
      if (f === 'ai') return text.includes('ai') || text.includes('inteligencia');
      if (f === 'dados') return text.includes('dados') || text.includes('power bi') || text.includes('observatorio');
      if (f === 'empresa') return text.includes('empresa') || text.includes('e-commerce') || text.includes('epemar');
      return text.includes(f);
    };

    bar.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-filter]');
      if (!btn) return;
      bar.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      slides.forEach((slide) => slide.classList.toggle('wow-hidden', !matches(slide, filter)));
      const swiperEl = document.querySelector('.portfolio-slider');
      if (swiperEl?.swiper) {
        swiperEl.swiper.update();
        swiperEl.swiper.slideTo(0);
      }
    });
  }

  function animateCounters() {
    const counters = [...document.querySelectorAll('.display-4')].filter((el) => /\d/.test(el.textContent || ''));
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = 'true';
        const raw = entry.target.textContent.trim();
        const target = parseInt(raw.replace(/\D/g, ''), 10);
        const suffix = raw.replace(/[\d]/g, '');
        if (!target) return;
        const duration = 1300;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.45 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function addCommandPalette() {
    if (document.querySelector('.command-launcher')) return;

    const actions = [
      { icon: 'bi-person-badge', title: 'Quem é Jamite Ngola?', desc: 'Ir para a biografia', href: '#about', keys: 'bio sobre perfil' },
      { icon: 'bi-kanban', title: 'Ver portfólio', desc: 'Projetos recentes e casos de uso', href: '#portfolio', keys: 'portfolio projetos trabalhos' },
      { icon: 'bi-stars', title: 'Projeto ALDA', desc: 'AI Meeting Coach open source', href: 'https://github.com/jamitengola/alda', keys: 'alda ai open source meeting' },
      { icon: 'bi-building-check', title: 'GovTech e dados', desc: 'Experiência com setor público e indicadores', href: '#impacto-digital', keys: 'govtech governo dados one' },
      { icon: 'bi-cpu', title: 'Stack técnico', desc: '.NET, React, Next.js, Flutter, Power BI e AI', href: '#stack-interativo', keys: 'stack tecnologia dotnet react next flutter' },
      { icon: 'bi-whatsapp', title: 'Falar no WhatsApp', desc: 'Contacto rápido', href: 'https://wa.me/244924482552', keys: 'whatsapp contacto telefone' },
      { icon: 'bi-github', title: 'Abrir GitHub', desc: '@jamitengola', href: 'https://github.com/jamitengola', keys: 'github repos codigo' },
      { icon: 'bi-envelope', title: 'Enviar email', desc: 'jamitengola@hotmail.com', href: 'mailto:jamitengola@hotmail.com', keys: 'email correio contacto' }
    ];

    const launcher = document.createElement('button');
    launcher.className = 'command-launcher';
    launcher.type = 'button';
    launcher.innerHTML = '<i class="bi bi-command"></i> Menu rápido <strong>/</strong>';
    document.body.appendChild(launcher);

    const overlay = document.createElement('div');
    overlay.className = 'command-overlay';
    overlay.innerHTML = `
      <div class="command-panel" role="dialog" aria-modal="true" aria-label="Menu rápido do portfólio">
        <input class="command-input" type="search" placeholder="Pesquisar: projetos, stack, WhatsApp, ALDA..." autocomplete="off" />
        <div class="command-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('.command-input');
    const results = overlay.querySelector('.command-results');

    const render = (query = '') => {
      const q = query.trim().toLowerCase();
      const filtered = actions.filter((item) => `${item.title} ${item.desc} ${item.keys}`.toLowerCase().includes(q));
      results.innerHTML = filtered.map((item) => `
        <a class="command-item" href="${item.href}" ${item.href.startsWith('http') ? 'target="_blank"' : ''}>
          <i class="bi ${item.icon}"></i>
          <span><strong>${item.title}</strong><small>${item.desc}</small></span>
        </a>
      `).join('') || '<div class="command-item"><i class="bi bi-search"></i><span><strong>Nada encontrado</strong><small>Tente: AI, GovTech, WhatsApp, projetos</small></span></div>';
    };

    const open = () => {
      overlay.classList.add('open');
      render(input.value);
      setTimeout(() => input.focus(), 40);
    };

    const close = () => overlay.classList.remove('open');

    launcher.addEventListener('click', open);
    document.querySelectorAll('[data-open-command]').forEach((btn) => btn.addEventListener('click', open));
    input.addEventListener('input', () => render(input.value));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close();
      if (event.target.closest('.command-item[href]')) close();
    });

    document.addEventListener('keydown', (event) => {
      const tag = document.activeElement?.tagName;
      const typing = ['INPUT', 'TEXTAREA'].includes(tag) || document.activeElement?.isContentEditable;
      if (event.key === '/' && !typing) {
        event.preventDefault();
        open();
      }
      if (event.key === 'Escape') close();
    });

    render();
  }

  function enableSpotlight() {
    let raf = null;
    document.addEventListener('pointermove', (event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--wow-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--wow-y', `${event.clientY}px`);
        raf = null;
      });
    }, { passive: true });
  }

  function enableReveal() {
    const elements = document.querySelectorAll('.wow-reveal, .service-box, .portfolio-box, .fancy-box');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.12 });

    elements.forEach((el) => {
      el.classList.add('wow-reveal');
      observer.observe(el);
    });
  }
})();
