const iconMenu = document.querySelector('.icon-menu');
const body = document.body;
if (iconMenu) {
  const menuBody = document.querySelector('.menu__body');
  iconMenu.addEventListener("click", function (e) {
    iconMenu.classList.toggle('_active');
    menuBody.classList.toggle('_active');
    body.classList.toggle('_lock');
  });
}