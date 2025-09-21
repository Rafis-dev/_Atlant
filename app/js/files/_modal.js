// scrollController убирает скролл сайта при открытом модальном окне, так же убирает автоматические скроллы на сайте и дергание сайта с помощию паддинга
const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
    `;
    document.documentElement.style.scrollBehavior = 'unset';
  },
  enabledScroll() {
    document.body.style.cssText = '';
    window.scroll({ top: scrollController.scrollPosition })
    document.documentElement.style.scrollBehavior = '';
  },
}

const modalController = ({ modal, btnOpen, btnClose, time = 300 }) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(modal);
  const body = document.body;

  modalElem.style.cssText = `
  display: flex;
  visibility: hidden;
  opacity: 0;
  transition: opacity ${time}ms ease-in-out;
  `;
  // Закрытие модального окна при клике на крестик и мимо окна или на клавишу escape
  const closeModal = event => {
    const target = event.target;
    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape') {
      modalElem.style.opacity = 0;
      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, time);
      window.removeEventListener('keydown', closeModal);
    }
  }

  // Функция открытия модального окна
  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  }
  //Открываем модальное окна при клике на кнопку
  buttonElems.forEach(btn => {
    btn.addEventListener('click', openModal)
  });
  //Закрываем модальное окно
  modalElem.addEventListener('click', closeModal);
}

// В параметры передаем модальное окно, кнопку открытия и закрытия модальных окон, и время закрытия/открытия модальных окон
modalController({
  modal: '.modal1',
  btnOpen: '.modal-btn',
  btnClose: '.modal__close',
  time: 300,
});
