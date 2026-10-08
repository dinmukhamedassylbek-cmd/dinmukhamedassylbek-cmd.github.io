
const root = document.documentElement;
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
root.dataset.theme = initialTheme;
themeIcon.textContent = initialTheme === 'light' ? '◑' : '◐';

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'light' ? '◑' : '◐';
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...nav.querySelectorAll('a')];

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .5] });

sections.forEach(section => sectionObserver.observe(section));

const words = ['InSAR', 'Sentinel-1', 'signal processing', 'GIS', 'embedded systems'];
const typing = document.getElementById('typingText');
let wordIndex = 0;
let charIndex = words[0].length;
let deleting = true;

function tickTyping() {
  const word = words[wordIndex];

  if (deleting) {
    charIndex -= 1;
    typing.textContent = word.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tickTyping, 450);
      return;
    }
  } else {
    const nextWord = words[wordIndex];
    charIndex += 1;
    typing.textContent = nextWord.slice(0, charIndex);
    if (charIndex >= nextWord.length) {
      deleting = true;
      setTimeout(tickTyping, 1300);
      return;
    }
  }
  setTimeout(tickTyping, deleting ? 48 : 72);
}
setTimeout(tickTyping, 1100);

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.project-card').forEach(card => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !visible);
    });
  });
});

const copyEmail = document.getElementById('copyEmail');
const copyStatus = document.getElementById('copyStatus');
copyEmail.addEventListener('click', async () => {
  const email = 'dinmukhamedassylbek@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email copied to clipboard.';
  } catch {
    copyStatus.textContent = email;
  }
  setTimeout(() => { copyStatus.textContent = ''; }, 2500);
});

document.getElementById('year').textContent = new Date().getFullYear();
