const nav = document.getElementById('nav');
const caseLinks = [...document.querySelectorAll('.case-toc a[data-part]')];
const caseSections = [...document.querySelectorAll('.case-section[id]')];
const sectionLinks = [...document.querySelectorAll('.nav-links a')];
function updateNavigation() {
  const activeCase = caseSections.filter(section => section.getBoundingClientRect().top <= 180).at(-1);
  caseLinks.forEach(link => {
    if (activeCase && link.dataset.part === activeCase.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
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

let imageDialog;
let imageTrigger;
document.querySelectorAll('a[data-image-viewer]').forEach(link => {
  link.addEventListener('click', event => {
    if (!('HTMLDialogElement' in window) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!imageDialog) {
      imageDialog = document.createElement('dialog');
      imageDialog.className = 'image-lightbox';
      imageDialog.setAttribute('aria-labelledby', 'image-dialog-title');
      imageDialog.innerHTML = '<div class="image-lightbox-header"><h2 id="image-dialog-title"></h2><button type="button" class="image-lightbox-close" autofocus>닫기 ×</button></div><img alt=""><p class="image-lightbox-note">공개 자료의 제품 화면 · Esc 키 또는 닫기로 돌아가기</p>';
      document.body.append(imageDialog);
      imageDialog.querySelector('button').addEventListener('click', () => imageDialog.close());
      imageDialog.addEventListener('click', e => {
        const rect = imageDialog.getBoundingClientRect();
        if (e.target === imageDialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) imageDialog.close();
      });
      imageDialog.addEventListener('close', () => imageTrigger?.focus({ preventScroll: true }));
    }
    imageTrigger = link;
    imageDialog.querySelector('h2').textContent = link.dataset.caption;
    const image = imageDialog.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    imageDialog.showModal();
  });
});
