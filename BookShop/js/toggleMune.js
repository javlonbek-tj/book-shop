const overlay = document.getElementById('overlay');
const navBurgerEl = document.getElementById('nav-burger');
const navCloseEl = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-actions');
const headerEl = document.getElementById('header');

const showMenu = () => {
  navMenu.classList.add('show-menu');
  overlay.classList.remove('hidden');
  document.body.classList.add('no-scroll');
  headerEl.classList.remove('header__sticky');
};

const hideMenu = () => {
  navMenu.classList.remove('show-menu');
  overlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  headerEl.classList.add('header__sticky');
};

navBurgerEl.addEventListener('click', showMenu);

navCloseEl.addEventListener('click', hideMenu);

overlay.addEventListener('click', hideMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
    hideMenu();
  }
});
