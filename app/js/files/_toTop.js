// Скрипт для кнопки которая скроллит наверх, появляется после скролла первого блока на станице

window.addEventListener('scroll', () => {
  const toTop = document.querySelector('.footnote-btn__button');
  let y = window.scrollY;
  let heroHight = document.querySelector(".main-slider, .main-section").offsetHeight;

  if (y > heroHight) {
    toTop.classList.add('footnote-btn__button_active');
  } else {
    toTop.classList.remove('footnote-btn__button_active');
  }
});