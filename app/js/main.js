// Нашли все заголовки табов по data атрибуту
const tabHeaders = document.querySelectorAll('[data-tab]');
// Нашли все контент боксы
const contentBoxes = document.querySelectorAll('[data-tab-content]');

tabHeaders.forEach(function (item) {
  item.addEventListener('click', function () {
    // Добавляем и убираем active у заголовков табов
    document
      .querySelectorAll('.tabs-list__item')
      .forEach(block => block.classList.remove('active'));
    this.classList.add('active');
    // 1. Скрыть все content box
    contentBoxes.forEach(function (item) {
      item.classList.remove('active');
    });

    // 2. Выбрать нужный content box и показать его
    const contentBox = document.querySelector('#' + this.dataset.tab);
    contentBox.classList.add('active');
  });
});

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  centeredSlides: true,
  loop: true,
  effect: 'cards',
  breakpoints: {
    // when window width is >= 320px
    320: {
      perSlideOffset: 2,
    },
    // when window width is >= 480px
    480: {
      perSlideOffset: 3,
    },
    // when window width is >= 580px
    580: {
      perSlideOffset: 4,
    },
    640: {
      perSlideOffset: 6,
    },
    768: {
      perSlideOffset: 8,
    },
  },
  cardsEffect: {
    slideShadows: false,
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.accordion');
  const accordion = document.querySelector('.accordion');
  const content1 = accordion.querySelector('.accordion__content');
  // Чтобы одна колонка по умолчанию была открыта
  if (accordion.classList.contains('open')) {
    content1.style.maxHeight = content1.scrollHeight + 'px';
  }

  accordions.forEach(el => {
    el.addEventListener('click', e => {
      const self = e.currentTarget;
      const control = self.querySelector('.accordion__control');
      const content = self.querySelector('.accordion__content');

      document
        .querySelectorAll('.accordion')
        .forEach(block => block.classList.remove('open'));
      document
        .querySelectorAll('.accordion__content')
        .forEach(box => (box.style.maxHeight = null));
      self.classList.add('open');
      // Ниже код для скрин-ридеров
      if (self.classList.contains('open')) {
        control.setAttribute('aria-expanded', true);
        content.setAttribute('aria-hidden', false);
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        control.setAttribute('aria-expanded', false);
        content.setAttribute('aria-hidden', true);
        content.style.maxHeight = null;
      }
    });
  });
});

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
    window.scroll({ top: scrollController.scrollPosition });
    document.documentElement.style.scrollBehavior = '';
  },
};

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
      event.code === 'Escape'
    ) {
      modalElem.style.opacity = 0;
      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, time);
      window.removeEventListener('keydown', closeModal);
    }
  };

  // Функция открытия модального окна
  const openModal = () => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = 1;
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };
  //Открываем модальное окна при клике на кнопку
  buttonElems.forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  //Закрываем модальное окно
  modalElem.addEventListener('click', closeModal);
};

// В параметры передаем модальное окно, кнопку открытия и закрытия модальных окон, и время закрытия/открытия модальных окон
modalController({
  modal: '.modal1',
  btnOpen: '.modal-btn',
  btnClose: '.modal__close',
  time: 300,
});
