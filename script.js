const lightbox = document.querySelector('#lightbox');
const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.shot').forEach((btn) => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.src;
    lightbox.showModal();
  });
});
closeBtn.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});
