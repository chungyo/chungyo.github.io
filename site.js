const nav = document.getElementById('nav');
const sectionLinks = [...document.querySelectorAll('.nav-links a')];
function updateNavigation() {
  nav?.classList.toggle('scrolled', window.scrollY > 32);
  const current = [...document.querySelectorAll('main > section[id]')]
    .filter(section => section.getBoundingClientRect().top <= 160).at(-1);
  sectionLinks.forEach(link => {
    if (current && link.getAttribute('href') === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => { updateNavigation(); scheduled = false; });
}, { passive: true });
updateNavigation();
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.more-projects').forEach(section => {
    section.dataset.wasOpen = String(section.open);
    section.open = true;
  });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('.more-projects').forEach(section => {
    section.open = section.dataset.wasOpen === 'true';
    delete section.dataset.wasOpen;
  });
});
document.querySelectorAll('.print-button').forEach(button => {
  button.addEventListener('click', () => window.print());
});
