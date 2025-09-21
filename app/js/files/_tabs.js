// JQUERY
$('.tab').on('click', function (e) {
  e.preventDefault();
  $($(this).siblings()).removeClass('tab--active');
  $($(this).parent().siblings().find('div')).removeClass('tabs-content--active');

  $(this).addClass('tab--active');
  $($(this).attr('href')).addClass('tabs-content--active');
});

// Вебкадеми с изменениями

// Нашли все заголовки табов по data атрибуту
const tabHeaders = document.querySelectorAll('[data-tab]');
// Нашли все контент боксы
const contentBoxes = document.querySelectorAll('[data-tab-content]');

tabHeaders.forEach(function (item) {
  item.addEventListener('click', function () {
    // Добавляем и убираем active у заголовков табов
    document.querySelectorAll('.tabs-list__item').forEach((block) => block.classList.remove('active'));
    this.classList.add('active');
    // 1. Скрыть все content box
    contentBoxes.forEach(function (item) {
      item.classList.remove('active');
    });

    // 2. Выбрать нужный content box и показать его
    const contentBox = document.querySelector('#' + this.dataset.tab);
    contentBox.classList.add('active');

  })
})