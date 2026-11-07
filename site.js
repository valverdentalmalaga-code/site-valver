/* Valver Dental 4.1 · natural scroll, local assets, progressively enhanced. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('.site-header');
  const treatments = $('#servicios');
  const menu = $('#mobile-menu');
  const toggle = $('.menu-toggle');
  const dialog = $('.contact-dialog');
  const petals = $$('.petal');
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const smooth = n => n * n * (3 - 2 * n);
  let lastFocus = null;
  let interest = '';
  let frame = 0;

  function closeMenu(restoreFocus = false) {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const opening = menu.hidden;
    if (!opening) return closeMenu(true);
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
    $('a', menu).focus();
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const links = $$('a', menu), last = links.at(-1);
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); toggle.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
      else if (document.activeElement === toggle) { event.preventDefault(); (event.shiftKey ? last : links[0]).focus(); }
    }
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !header.contains(event.target)) closeMenu();
    const link = event.target.closest('[data-interest]');
    if (link) interest = link.dataset.interest;
  });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // There is no added scroll distance, fixed overlay or wheel interception.
  function renderScroll() {
    frame = 0;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    if (motion.matches) {
      petals.forEach(p => p.style.opacity = '0');
      return;
    }
    const sectionTop = treatments.getBoundingClientRect().top;
    const travel = clamp((innerHeight - sectionTop) / (innerHeight * .95));
    // The same scroll position always gives the same petal position, including on reverse.
    petals.forEach((petal, i) => {
      const p = clamp((travel - i * .035) / .78);
      const fade = smooth(clamp(p / .18)) * (1 - smooth(clamp((p - .6) / .4)));
      const x = 15 + i * 28 + Math.sin(p * Math.PI + i) * 12;
      const drop = -8 + p * (60 + i * 9);
      petal.style.transform = `translate3d(${x.toFixed(1)}px,${drop.toFixed(1)}px,0) rotate(${(-30 + i * 27 + p * 50).toFixed(1)}deg)`;
      petal.style.opacity = (fade * .55).toFixed(3);
    });
  }
  function queueScroll() { if (!frame) frame = requestAnimationFrame(renderScroll); }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  motion.addEventListener('change', queueScroll);
  renderScroll();

  // Reveal once; never hide a section again as someone navigates back.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
    document.documentElement.classList.add('motion-ready');
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.desktop-nav a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
    $$('#inicio, #nosotros, #servicios, #instalaciones, #experiencia, #contacto').forEach(el => navObserver.observe(el));
  }
  const essenceTitle = $('#about-title');
  if (essenceTitle && 'IntersectionObserver' in window) {
    const wordsObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        essenceTitle.classList.add('is-revealed'); wordsObserver.disconnect();
      }
    }, { threshold: .15 });
    wordsObserver.observe(essenceTitle);
  }
  // Keyboard and deep-link navigation must expose its target immediately.
  function exposeTarget(hash) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    target.classList.add('is-visible');
    $$('.reveal', target).forEach(el => el.classList.add('is-visible'));
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) exposeTarget(link.hash);
  });
  addEventListener('hashchange', () => exposeTarget(location.hash));
  exposeTarget(location.hash);

  // Contact destinations are enabled only when real information is supplied.
  const config = window.VALVER_CONFIG || {};
  function secureUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  }
  const booking = secureUrl(config.bookingUrl);
  const whatsapp = /^\d{8,15}$/.test(config.whatsapp || '') ? config.whatsapp : '';
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email || '') ? config.email : '';
  const instagram = secureUrl(config.instagramUrl);
  const channels = [];
  if (booking) channels.push(['Agenda tu cita', booking]);
  if (whatsapp) channels.push(['Hablemos por WhatsApp', `https://wa.me/${whatsapp}`]);
  if (instagram) channels.push(['Hablemos por Instagram', instagram]);
  if (email) channels.push(['Escríbenos por correo electrónico', `mailto:${email}`]);
  const availability = $('[data-contact-status]');
  if (channels.length) {
    availability.textContent = 'Elige cómo prefieres conversar con nosotros.';
    if (!config.address) $('[data-footer-contact]').textContent = 'Estamos aquí para escucharte.';
    const info = $('.contact-info');
    for (const [label, url] of channels) {
      const containers = [$('[data-dialog-channels]')];
      if (url.startsWith('mailto:')) { info.hidden = false; containers.push(info); }
      for (const container of containers) {
        const a = document.createElement('a'); a.href = url; a.textContent = `${label} ↗`; container.append(a);
      }
    }
    $('[data-dialog-copy]').textContent = !booking && !whatsapp && !email && instagram
      ? 'Escríbenos por Instagram para consultar disponibilidad y conversar sobre tu próxima visita. Será un gusto escucharte.'
      : 'Elige el canal que prefieras. Será un gusto conocer tu historia y acompañarte en el siguiente paso.';
  }
  for (const field of ['phone', 'address']) {
    if (typeof config[field] === 'string' && config[field].trim()) {
      if (field === 'address' && $$('[data-clinic-address]').length) {
        $$('[data-clinic-address]').forEach(node => { node.textContent = config.address; });
        continue;
      }
      const info = $('.contact-info'); info.hidden = false;
      const p = document.createElement('p'); p.textContent = config[field]; info.append(p);
    }
  }
  const footerSocials = $('[data-social-links]');
  const footerContacts = [
    { label: 'WhatsApp', url: whatsapp ? `https://wa.me/${whatsapp}` : '', icon: '<span class="footer-whatsapp-icon" aria-hidden="true"></span>' },
    { label: 'Instagram', url: instagram, icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="icon-dot" cx="17.5" cy="6.5" r="1"/></svg>' },
    { label: 'Correo electrónico', url: email ? `mailto:${email}` : '', icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>' },
  ];
  for (const { label, url, icon } of footerContacts) {
    if (!url) continue;
    const link = document.createElement('a');
    link.href = url;
    link.className = 'footer-social-link';
    link.setAttribute('aria-label', label);
    link.title = label;
    link.innerHTML = icon;
    if (url.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    footerSocials.append(link);
  }
  const mapUrl = secureUrl(config.mapsUrl);
  if (mapUrl) $$('[data-map-link]').forEach(link => { link.href = mapUrl; });
  const secondary = $('.contact-actions [data-contact]:not([data-contact="booking"])');
  if (secondary && whatsapp) {
    secondary.dataset.contact = 'whatsapp';
    secondary.innerHTML = 'Hablemos por WhatsApp <span aria-hidden="true">↗</span>';
  }
  if (instagram && !booking && !whatsapp && !email) {
    availability.textContent = 'Para consultar disponibilidad, escríbenos por Instagram.';
  }
  const clinicImage = $('[data-clinic-photo]');
  if (clinicImage && typeof config.clinicPhoto === 'string' && config.clinicPhoto.trim()) {
    try {
      const url = new URL(config.clinicPhoto, document.baseURI);
      if (url.protocol === 'https:' || (url.origin === location.origin && ['http:', 'file:'].includes(url.protocol))) {
        clinicImage.src = url.href; clinicImage.removeAttribute('srcset');
        clinicImage.alt = config.clinicPhotoAlt || 'Valver Dental en Málaga';
        $('[data-clinic-photo-caption]').textContent = 'Valver Dental · Málaga';
      }
    } catch { /* Keep the existing illustrative image when no valid path is supplied. */ }
  }
  function openContact(kind) {
    const message = `Hola, me gustaría recibir información${interest ? ` sobre ${interest.toLowerCase()}` : ' y concertar una cita'}.`;
    if (kind === 'instagram' && instagram) { location.assign(instagram); return; }
    if (kind === 'booking' && booking) { location.assign(booking); return; }
    if (kind === 'whatsapp' && whatsapp) { location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`); return; }
    $('[data-dialog-copy]').textContent = kind === 'whatsapp' && !whatsapp
      ? 'El WhatsApp de la clínica aún no está disponible en esta web. Mientras tanto, puedes escribirnos por Instagram.'
      : (instagram && !booking && !whatsapp && !email
        ? 'Escríbenos por Instagram para consultar disponibilidad y conversar sobre tu próxima visita. Será un gusto escucharte.'
        : 'Elige el canal que prefieras. Será un gusto conocer tu historia y acompañarte en el siguiente paso.');
    lastFocus = document.activeElement;
    dialog.showModal(); document.body.classList.add('dialog-open');
  }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => openContact(button.dataset.contact)));
  $$('[data-close-dialog], .dialog-close').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastFocus?.focus(); });
  $('[data-year]').textContent = String(new Date().getFullYear());
})();
