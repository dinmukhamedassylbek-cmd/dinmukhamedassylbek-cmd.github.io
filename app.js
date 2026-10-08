
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
  langToggle.textContent = lang === 'en' ? 'RU' : 'EN';
  localStorage.setItem('portfolio-lang', lang);
}
applyLanguage(currentLang);

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'ru' : 'en');
});

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('portfolio-theme', root.dataset.theme);
});

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

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a')];
const sectionObserver = new IntersectionObserver(entries => {
  const current = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if(!current) return;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current.target.id}`));
}, {rootMargin:'-35% 0px -55% 0px',threshold:[0,.2,.5]});
sections.forEach(section => sectionObserver.observe(section));

const words = ['InSAR','Sentinel-1','signal processing','GIS','2D-ESPRIT','embedded RF'];
const typing = document.getElementById('typingText');
let wi = 0, ci = words[0].length, deleting = true;
function typeTick(){
  const word = words[wi];
  if(deleting){
    ci--;
    typing.textContent = word.slice(0,ci);
    if(ci <= 0){
      deleting = false;
      wi = (wi + 1) % words.length;
      setTimeout(typeTick, 420);
      return;
    }
  }else{
    const next = words[wi];
    ci++;
    typing.textContent = next.slice(0,ci);
    if(ci >= next.length){
      deleting = true;
      setTimeout(typeTick, 1300);
      return;
    }
  }
  setTimeout(typeTick, deleting ? 45 : 68);
}
setTimeout(typeTick, 1100);

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

const projectData = {
  insar: {
    en: {
      kicker:'Research project · Sentinel-1 / InSAR',
      title:'Ground deformation monitoring in Almaty',
      text:'A complete DInSAR processing chain was built for Sentinel-1 IW SLC data. The work includes co-registration, enhanced spectral diversity, debursting, interferogram formation, topographic phase removal, phase unwrapping, displacement calculation and terrain correction.',
      items:[
        'AOI: Almaty and surrounding area',
        'Short-revisit pair comparison',
        'Coherence-based quality control',
        'Displacement products exported to GeoTIFF'
      ]
    },
    ru: {
      kicker:'Исследовательский проект · Sentinel-1 / InSAR',
      title:'Мониторинг деформаций поверхности в Алматы',
      text:'Для данных Sentinel-1 IW SLC построен полный DInSAR-пайплайн: co-registration, enhanced spectral diversity, debursting, построение интерферограммы, удаление топографической фазы, развёртка фазы, расчёт смещений и terrain correction.',
      items:[
        'Зона интереса: Алматы и окрестности',
        'Сравнение пар с коротким интервалом повторной съёмки',
        'Контроль качества по когерентности',
        'Экспорт карт смещений в GeoTIFF'
      ]
    }
  },
  esprit: {
    en: {
      kicker:'Signal processing · Positioning',
      title:'2D-ESPRIT self-localization using Iridium signals',
      text:'The project estimates azimuth and elevation from a planar antenna array and combines multiple satellite directions using least-squares intersection to estimate receiver position.',
      items:[
        'Uniform rectangular array with λ/2 spacing',
        '2D-ESPRIT AoA estimation',
        'Multi-burst averaging and noise analysis',
        'Position estimation from multiple satellites'
      ]
    },
    ru: {
      kicker:'Обработка сигналов · Позиционирование',
      title:'Самолокализация на базе 2D-ESPRIT по сигналам Iridium',
      text:'Проект оценивает азимут и угол места на плоской антенной решётке, а затем объединяет направления от нескольких спутников методом наименьших квадратов для оценки положения приёмника.',
      items:[
        'Прямоугольная антенная решётка с шагом λ/2',
        'Оценка AoA методом 2D-ESPRIT',
        'Усреднение нескольких burst и анализ шума',
        'Оценка координат по нескольким спутникам'
      ]
    }
  },
  rf: {
    en: {
      kicker:'Embedded systems · RF',
      title:'ESP32 + CC1101 RF experimental platform',
      text:'A practical embedded platform for laboratory RF experiments, local control and logging. The design combines an ESP32 with a CC1101 transceiver and Wi-Fi/BLE interfaces.',
      items:[
        'ESP32-based control',
        'CC1101 RF front end',
        'Local Wi-Fi/BLE interface',
        'Logging and export-oriented workflow'
      ]
    },
    ru: {
      kicker:'Embedded-системы · RF',
      title:'Экспериментальная RF-платформа ESP32 + CC1101',
      text:'Практическая embedded-платформа для лабораторных RF-экспериментов, локального управления и журналирования. В основе — ESP32, трансивер CC1101 и интерфейсы Wi-Fi/BLE.',
      items:[
        'Управление на ESP32',
        'RF-тракт на CC1101',
        'Локальный интерфейс Wi-Fi/BLE',
        'Журналирование и экспорт результатов'
      ]
    }
  },
  timeseries: {
    en: {
      kicker:'SAR time series',
      title:'Sentinel-1 time-series processing',
      text:'This work extends pair-based DInSAR toward multi-scene analysis, focusing on short revisit intervals, network design and the transition toward SBAS/PS-InSAR style time-series workflows.',
      items:[
        'Multi-scene Sentinel-1 stacks',
        'Short-baseline network design',
        'SBAS-oriented processing',
        'Future intelligent interpretation of deformation time series'
      ]
    },
    ru: {
      kicker:'Временные ряды SAR',
      title:'Обработка временных рядов Sentinel-1',
      text:'Работа развивает парный DInSAR в сторону многосценового анализа с акцентом на короткие интервалы повторной съёмки, построение сети пар и переход к SBAS/PS-InSAR пайплайнам.',
      items:[
        'Многосценовые стеки Sentinel-1',
        'Сеть коротких базовых линий',
        'Обработка в логике SBAS',
        'Дальнейшая интеллектуальная интерпретация временных рядов деформаций'
      ]
    }
  }
};

const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function openProject(id){
  const data = projectData[id][currentLang];
  modalContent.innerHTML = `
    <div class="modal-inner">
      <p class="modal-kicker">${data.kicker}</p>
      <h2>${data.title}</h2>
      <p>${data.text}</p>
      <ul class="modal-list">${data.items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
  modal.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.project-card').forEach(card => {
  card.querySelector('.project-open').addEventListener('click', () => openProject(card.dataset.project));
});

function closeModal(){
  modal.close();
  document.body.classList.remove('modal-open');
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if(e.target === modal) closeModal();
});

document.getElementById('copyEmail').addEventListener('click', async () => {
  const status = document.getElementById('copyStatus');
  const email = 'dinmukhamedassylbek@gmail.com';
  try{
    await navigator.clipboard.writeText(email);
    status.textContent = currentLang === 'ru' ? 'Email скопирован.' : 'Email copied.';
  }catch{
    status.textContent = email;
  }
  setTimeout(() => status.textContent = '', 2300);
});

document.getElementById('year').textContent = new Date().getFullYear();

if(matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove', e => {
    cursorGlow.style.transform = `translate(${e.clientX - 210}px,${e.clientY - 210}px)`;
  });
  portraitShell.addEventListener('mousemove', e => {
    const r = portraitShell.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    portraitShell.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  portraitShell.addEventListener('mouseleave', () => portraitShell.style.transform = '');
}
