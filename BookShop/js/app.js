// ==================== TOGGLE MENU ====================

const overlay = document.getElementById('overlay');
const navBurger = document.getElementById('nav-burger');
const navMenu = document.getElementById('nav-actions');

const showMenu = () => {
  overlay.classList.remove('hidden');
  navMenu.classList.add('show-menu');
  navBurger.classList.add('nav__burger--open');
  document.body.classList.add('no-scroll');
};

const hideMenu = () => {
  overlay.classList.add('hidden');
  navMenu.classList.remove('show-menu');
  document.body.classList.remove('no-scroll');
  navBurger.classList.remove('nav__burger--open');
};

navBurger.addEventListener('click', () => {
  if (navMenu.classList.contains('show-menu')) {
    hideMenu();
  } else {
    showMenu();
  }
});

/* Close menu when clicking on the overlay */
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
