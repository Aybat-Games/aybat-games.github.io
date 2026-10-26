(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobileNav');
  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  };
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
      mobileNav.hidden = !willOpen;
      document.body.classList.toggle('menu-open', willOpen);
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', e => { if (!mobileNav.hidden && !e.target.closest('.site-header')) closeMenu(); });
  }
  const header = document.getElementById('siteHeader');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
  const revealNodes = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .085, rootMargin: '0px 0px 50px 0px' });
    revealNodes.forEach(node => { node.classList.add('will-reveal'); io.observe(node); });
  }
  const hero = document.querySelector('.hero-art');
  if (hero && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', ev => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width - 0.5;
        const y = (ev.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty('--pointer-x', `${(x * 16).toFixed(1)}px`);
        hero.style.setProperty('--pointer-y', `${(y * 16).toFixed(1)}px`);
        raf = 0;
      });
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--pointer-x', '0px'); hero.style.setProperty('--pointer-y', '0px'); });
  }
})();
