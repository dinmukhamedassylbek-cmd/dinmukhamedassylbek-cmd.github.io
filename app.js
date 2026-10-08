
const root = document.documentElement;
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const cursorGlow = document.getElementById('cursorGlow');
const portraitShell = document.getElementById('portraitShell');

let currentLang = localStorage.getItem('portfolio-lang') || 'en';
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersLight = matchMedia('(prefers-color-scheme: light)').matches;
root.dataset.theme = savedTheme || (prefersLight ? 'light' : 'dark');

function applyLanguage(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-ru]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  if(langToggle) langToggle.textContent = lang === 'en' ? 'RU' : 'EN';
  localStorage.setItem('portfolio-lang', lang);
}
applyLanguage(currentLang);

if(langToggle){
  langToggle.addEventListener('click', () => applyLanguage(currentLang === 'en' ? 'ru' : 'en'));
}
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
  });
}
if(menuToggle && nav){
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 65}ms`;
  revealObserver.observe(el);
});

if(nav){
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver(entries => {
    const current = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if(!current) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current.target.id}`));
  }, {rootMargin:'-35% 0px -55% 0px',threshold:[0,.2,.5]});
  sections.forEach(section => sectionObserver.observe(section));
}

const typing = document.getElementById('typingText');
if(typing){
  const words = ['InSAR','Sentinel-1','geospatial analysis','GIS','SAR time series','embedded systems'];
  let wi = 0, ci = words[0].length, deleting = true;
  function typeTick(){
    const word = words[wi];
    if(deleting){
      ci--;
      typing.textContent = word.slice(0,ci);
      if(ci <= 0){
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(typeTick,420);
        return;
      }
    }else{
      const next = words[wi];
      ci++;
      typing.textContent = next.slice(0,ci);
      if(ci >= next.length){
        deleting = true;
        setTimeout(typeTick,1300);
        return;
      }
    }
    setTimeout(typeTick,deleting ? 45 : 68);
  }
  setTimeout(typeTick,1100);
}

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const copyButton = document.getElementById('copyEmail');
if(copyButton){
  copyButton.addEventListener('click', async () => {
    const status = document.getElementById('copyStatus');
    const email = 'dinmukhamedassylbek@gmail.com';
    try{
      await navigator.clipboard.writeText(email);
      status.textContent = currentLang === 'ru' ? 'Email скопирован.' : 'Email copied.';
    }catch{
      status.textContent = email;
    }
    setTimeout(() => status.textContent = '',2300);
  });
}

const year = document.getElementById('year');
if(year) year.textContent = new Date().getFullYear();

if(cursorGlow && matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove', e => {
    cursorGlow.style.transform = `translate(${e.clientX - 210}px,${e.clientY - 210}px)`;
  });
}
if(portraitShell && matchMedia('(pointer:fine)').matches){
  portraitShell.addEventListener('mousemove', e => {
    const r = portraitShell.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    portraitShell.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  portraitShell.addEventListener('mouseleave', () => portraitShell.style.transform = '');
}
