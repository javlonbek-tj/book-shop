const overlay = document.getElementById('overlay');
const navBurgerEls = document.querySelectorAll('.nav__burger');
const navCloseEls = document.querySelectorAll('.nav__close');
const navMenu = document.getElementById('nav-actions');
const headerEls = document.querySelectorAll('.header');

const showMenu = () => {
  navMenu.classList.add('show-menu');
  overlay.classList.remove('hidden');
  document.body.classList.add('no-scroll');
  headerEls.forEach((headerEl) => headerEl.classList.remove('header__sticky'));
  localStorage.setItem('headerSticky', 'false');
};

const hideMenu = () => {
  navMenu.classList.remove('show-menu');
  overlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
  headerEls.forEach((headerEl) => headerEl.classList.add('header__sticky'));
  localStorage.setItem('headerSticky', 'true');
};

const stickyState = localStorage.getItem('headerSticky');
if (stickyState === 'false') {
  headerEls.forEach((headerEl) => headerEl.classList.remove('header__sticky'));
} else {
  headerEls.forEach((headerEl) => headerEl.classList.add('header__sticky'));
}

navBurgerEls.forEach((navBurgerEl) =>
  navBurgerEl.addEventListener('click', showMenu)
);

navCloseEls.forEach((navCloseEl) =>
  navCloseEl.addEventListener('click', hideMenu)
);

overlay.addEventListener('click', hideMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
    hideMenu();
  }
});
