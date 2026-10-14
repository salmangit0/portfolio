const body = document.body;
const hero = document.querySelector('.hero');
const header = document.querySelector('[data-header]');
const windToggle = document.querySelector('[data-wind-toggle]');
const windLabel = document.querySelector('[data-wind-label]');
const copyButton = document.querySelector('[data-copy-email]');
const copyFeedback = document.querySelector('[data-copy-feedback]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let gustTimer;
let gustEndTimer;

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

windToggle?.addEventListener('click', () => {
  const calm = body.classList.toggle('wind-calm');
  hero?.classList.toggle('wind-calm', calm);
  windToggle.setAttribute('aria-pressed', String(calm));
  if (windLabel) windLabel.textContent = calm ? 'Motion paused' : 'Ambient motion';
});

copyButton?.addEventListener('click', async () => {
  const email = 'salmanpkty@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    if (copyFeedback) copyFeedback.textContent = 'Email copied to clipboard.';
  } catch {
    if (copyFeedback) copyFeedback.textContent = 'Select the email address above to copy it.';
  }
  window.setTimeout(() => {
    if (copyFeedback) copyFeedback.textContent = '';
  }, 3000);
});

function scheduleGust() {
  if (reducedMotion.matches || document.hidden) return;
  const delay = 25000 + Math.random() * 25000;
  window.clearTimeout(gustTimer);
  gustTimer = window.setTimeout(() => {
    if (!body.classList.contains('wind-calm') && hero) {
      hero.classList.add('gusting');
      window.clearTimeout(gustEndTimer);
      gustEndTimer = window.setTimeout(() => hero.classList.remove('gusting'), 3800);
    }
    scheduleGust();
  }, delay);
}

function clearGust() {
  window.clearTimeout(gustTimer);
  window.clearTimeout(gustEndTimer);
  hero?.classList.remove('gusting');
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearGust();
  else scheduleGust();
});

if (!reducedMotion.matches) scheduleGust();

if (hero && !reducedMotion.matches) {
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 4;
    hero.style.setProperty('--parallax-x', `${x.toFixed(2)}px`);
    hero.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--parallax-x', '0px');
    hero.style.setProperty('--parallax-y', '0px');
  });
}

const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${Math.min(entry.target.getBoundingClientRect().top / 1000, 0.35)}s`;
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
}
