const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
}
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

// Smooth wheel scrolling on desktop; touch devices keep native scrolling.
const lenis = !reduceMotion && window.Lenis ? new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.95 }) : null;

// In-page anchors land below the sticky header.
document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  const offset = -header.offsetHeight;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.3 });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}));

// Brevo booking popup; falls back to the plain link if the Brevo script fails to load.
document.querySelectorAll('.booking-button').forEach(button => button.addEventListener('click', event => {
  if (!window.BrevoBookingPage) return;
  event.preventDefault();
  BrevoBookingPage.initStaticButton({ url: button.href });
}));

// Pause smooth scrolling while the Brevo popup is open so the page behind it stays put.
if (lenis) {
  new MutationObserver(() => {
    document.querySelector('.brevo-overlay') ? lenis.stop() : lenis.start();
  }).observe(document.body, { childList: true });
}

// Header shadow, reading progress and a slow parallax on the hero symbol.
const heroSymbol = document.querySelector('.hero-symbol');
let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('is-scrolled', y > 8);
  header.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
  if (heroSymbol && !reduceMotion && y < window.innerHeight * 1.2) heroSymbol.style.translate = `0 ${y * 0.14}px`;
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });
onScroll();

// Scroll reveals: elements entering together are staggered, then released from the reveal styles.
const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group] > *');
const finishReveal = element => element.classList.add('reveal-done');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(finishReveal);
} else {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      const delay = Math.min(index * 90, 450);
      entry.target.style.setProperty('--reveal-delay', `${delay}ms`);
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      setTimeout(() => finishReveal(entry.target), delay + 2600);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
}
