// ==================== TOGGLE MENU ====================

const overlay = document.getElementById('overlay');
const navBurger = document.getElementById('nav-burger');
const navMenu = document.getElementById('nav-actions');

const showMenu = () => {
  navMenu.classList.add('show-menu');
  navBurger.classList.add('nav__burger--open');
  overlay.classList.remove('hidden');
  document.body.classList.add('no-scroll');
};

const hideMenu = () => {
  navMenu.classList.remove('show-menu');
  navBurger.classList.remove('nav__burger--open');
  overlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
};

navBurger.addEventListener('click', () => {
  if (navMenu.classList.contains('show-menu')) {
    hideMenu();
  } else {
    showMenu();
  }
});

overlay.addEventListener('click', () => {
  if (navMenu.classList.contains('show-menu')) {
  hideMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
    hideMenu();
  }
});
