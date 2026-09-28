const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
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
// Brevo booking popup; falls back to the plain link if the Brevo script fails to load.
document.querySelectorAll('.booking-button').forEach(button => button.addEventListener('click', event => {
  if (!window.BrevoBookingPage) return;
  event.preventDefault();
  BrevoBookingPage.initStaticButton({ url: button.href });
}));
document.querySelector('[data-form]')?.addEventListener('submit', event => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Thank you. Your private consultation request has been received.';
  event.currentTarget.reset();
});
