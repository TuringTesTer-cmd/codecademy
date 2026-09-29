(function(){
  'use strict';
  const page = document.body.dataset.page || 'profile';
  const current = page === 'education' ? 'education' : page === 'experience' ? 'experience' : page === 'contact' ? 'contact' : page === 'profile' ? 'profile' : '';
  const links = [
    ['profile','index.html','Perfil'],
    ['experience','experience.html','Experiencia'],
    ['education','education.html','Formación'],
    ['contact','contact.html','Contacto']
  ];
  const linkHTML = () => links.map(([key,href,label]) => `<a href="${href}"${current===key?' class="is-active" aria-current="page"':''}>${label}</a>`).join('');
  const quickHTML = () => `<div class="am-quick-links" data-i18n-ignore>
      <a href="https://www.linkedin.com/in/andrea-miggiano/" target="_blank" rel="noopener" title="LinkedIn">in</a>
      <a href="files/CV-Andrea-Miggiano.pdf" data-href-es="files/CV-Andrea-Miggiano.pdf" data-href-en="files/CV-Andrea-Miggiano-EN.pdf" target="_blank" rel="noopener" title="CV">CV</a>
      <a href="mailto:andrea@miggiano.es?Subject=Contact%20from%20your%20personal%20web" title="Email">@</a>
    </div>`;
  const mobile = `<header class="am-mobile-head">
      <a class="am-mobile-brand" href="index.html"><img class="am-site-logo" src="images/am-logo.svg" alt="am logo"><span class="am-wordmark">Andrea Miggiano</span></a>
      <button class="am-mobile-menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false">☰</button>
    </header>
    <aside class="am-mobile-curtain am-mobile-nav" aria-label="Navegación móvil">
      <nav class="am-nav-links">${linkHTML()}</nav>
      <div class="am-mobile-bottom"><div class="am-lang-slot am-lang-mobile"></div>${quickHTML()}</div>
    </aside>`;
  const desktop = `<header class="am-floating-nav am-desktop-nav" aria-label="Navegación principal">
      <a class="am-floating-brand" href="index.html" aria-label="Andrea Miggiano · Perfil"><img class="am-site-logo" src="images/am-logo.svg" alt="am logo"></a>
      <nav class="am-nav-links">${linkHTML()}</nav><div class="am-lang-slot am-lang-desktop"></div>
    </header>`;
  document.body.insertAdjacentHTML('afterbegin', desktop + mobile);

  const oldSwitcher = document.querySelector('body > #language-switcher');
  function placeLanguageSwitcher(){
    if(!oldSwitcher) return;
    const mobileSlot = document.querySelector('.am-lang-mobile');
    const desktopSlot = document.querySelector('.am-lang-desktop');
    const move = () => {
      const target = matchMedia('(max-width:820px)').matches ? mobileSlot : desktopSlot;
      if(target && oldSwitcher.parentElement !== target) target.appendChild(oldSwitcher);
    };
    move();
    window.addEventListener('resize', move, {passive:true});
  }
  placeLanguageSwitcher();

  // Oculta el título antiguo de Experiencia; el resto de títulos antiguos ya se oculta por CSS.
  if(page === 'experience'){
    const first = Array.from(document.body.children).find(el => el.matches && el.matches('section.container') && el.querySelector(':scope > h2'));
    if(first) first.classList.add('am-original-title-hidden');
  }

  const pageTitles = {experience:'Experiencia profesional',education:'Formación',contact:'Contacto',privacy:'Privacidad'};
  if(page === 'profile'){
    const isEnglish = new URLSearchParams(window.location.search).get('lang') === 'en';
    const heroTitle = isEnglish ? 'Commercial experience:' : 'Experiencia comercial:';
    const heroLede = isEnglish
      ? 'Consultative Selling · Client Management · Commercial Organisation · Clear and autonomous way of working · Focused on objectives and lasting relationships.'
      : 'Venta Consultiva · Gestión de Clientes · Organización Comercial · Forma de trabajar clara y autónoma · Orientado a objetivos y relaciones duraderas.';
    const heroExperience = isEnglish ? 'Experience' : 'Experiencia';
    const heroCV = isEnglish ? 'CV in PDF' : 'CV en PDF';
    const hero = `<section class="am-home-hero" aria-label="${isEnglish ? 'Professional profile' : 'Perfil profesional'}">
      <div class="am-home-copy">
        <p class="am-kicker">Andrea Miggiano</p>
        <h1>${heroTitle}</h1>
        <p class="am-lede">${heroLede}</p>
        <div class="am-hero-actions"><a class="am-primary" href="experience.html${isEnglish ? '?lang=en' : ''}">${heroExperience}</a><a class="am-secondary" href="${isEnglish ? 'files/CV-Andrea-Miggiano-EN.pdf' : 'files/CV-Andrea-Miggiano.pdf'}" data-href-es="files/CV-Andrea-Miggiano.pdf" data-href-en="files/CV-Andrea-Miggiano-EN.pdf" target="_blank" rel="noopener">${heroCV}</a></div>
      </div>
    </section>`;
    const anchor = document.querySelector('.am-mobile-curtain');
    anchor.insertAdjacentHTML('afterend', hero);
  } else if(pageTitles[page]){
    const desktopName = 'Andrea Miggiano';
    const mobileName = (page === 'experience' || page === 'education' || page === 'contact') ? 'Andrea Miggiano' : 'Andrea Francesco';
    const hero = `<section class="am-page-hero"><div><p class="am-kicker"><span class="am-kicker-desktop">${desktopName}</span><span class="am-kicker-mobile">${mobileName}</span></p><h1>${pageTitles[page]}</h1></div></section>`;
    const anchor = document.querySelector('.am-mobile-curtain');
    anchor.insertAdjacentHTML('afterend', hero);
  }

  // El pie legal antiguo se oculta por CSS. Añade Privacidad justo debajo del copyright.
  document.querySelectorAll('.site-footer').forEach(footer => {
    const copy = footer.querySelector('.site-copyright');
    if(!copy || footer.querySelector('.am-footer-privacy')) return;
    const isEnglish = new URLSearchParams(window.location.search).get('lang') === 'en';
    const privacy = document.createElement('a');
    privacy.className = 'am-footer-privacy';
    privacy.href = 'privacy.html' + (isEnglish ? '?lang=en' : '');
    privacy.textContent = isEnglish ? 'Privacy' : 'Privacidad';
    copy.insertAdjacentElement('afterend', privacy);
  });

  const curtain = document.querySelector('.am-mobile-curtain');
  const menuBtn = document.querySelector('.am-mobile-menu-btn');
  function setMenu(open){
    curtain.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.textContent = open ? '×' : '☰';
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  menuBtn.addEventListener('click', () => setMenu(!curtain.classList.contains('open')));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') setMenu(false); });
  curtain.querySelectorAll('.am-nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  if(oldSwitcher){
    oldSwitcher.addEventListener('click', () => {
      if(curtain.classList.contains('open')) sessionStorage.setItem('am-finalist-menu-open','1');
    });
  }
  if(sessionStorage.getItem('am-finalist-menu-open') === '1' && matchMedia('(max-width:820px)').matches){
    sessionStorage.removeItem('am-finalist-menu-open');
    setMenu(true);
  }
})();
