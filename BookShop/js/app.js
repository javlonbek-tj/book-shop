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

// ==================== RENDERING BOOK ELEMENT ====================

async function fetchBooks() {
  const response = await fetch('../../books.json');
  const data = await response.json();
  return data;
}

async function renderBooks() {
  const books = await fetchBooks();

  const booksContainer = document.getElementById('books');
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book');

    const truncatedTitle = book.title.length > 50 ? book.title.slice(0, 50) + '...' : book.title;

    bookItem.innerHTML = `
    <img src="assets/images/${book.imageLink}" alt="${book.title}" class="book__image" />
    <div class="book__content">
      <h2 class="book__title">${truncatedTitle}</h2>
      <h3 class="book__author">${book.author}</h3>
      <p class="book__price">Price: $${book.price}</p>
      <div class="book__actions">
        <button class="book__btn">Add to bag</button>
        <button class="book__btn book__btn--more">Show more</button>
      </div>
    </div>
  `;

    fragment.append(bookItem);
  });

  booksContainer.append(fragment);
}

renderBooks();
