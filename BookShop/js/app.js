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

function truncateTitle(length, title) {
  return title.length > length ? title.slice(0, length) + '...' : title;
}

async function renderBooks() {
  const books = await fetchBooks();

  const booksContainer = document.getElementById('books');
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book');
    const truncatedTitle = truncateTitle(38, book.title);

    bookItem.innerHTML = `
    <img src="assets/images/${book.imageLink}" alt="${book.title}" class="book__image" />
    <div class="book__content">
      <h2 class="book__title">${truncatedTitle}</h2>
      <h3 class="book__author">${book.author}</h3>
      <p class="book__price">Price: $${book.price}</p>
      <div class="book__actions">
        <button class="book__btn book__btn--add">Add to bag</button>
        <button class="book__btn book__btn--more">Show more</button>
      </div>
    </div>
  `;

    fragment.append(bookItem);
  });

  booksContainer.append(fragment);
}

renderBooks();

// ==================== ADDING TO CART ====================

const bookCatalogContainer = document.getElementById('books');
const cartsContainer = document.getElementById('carts');

function addToCart(book) {
  const fragment = document.createDocumentFragment();

  const cartItem = document.createElement('div');
  cartItem.classList.add('cart');

  const truncatedTitle = truncateTitle(38, book.title);

  cartItem.innerHTML = `
    <img src="${book.imageLink}" alt="${book.title}" class="cart__image" />
      <div class="cart__info">
        <h2 class="cart__title">${truncatedTitle}</h2>
        <h3 class="cart__author">${book.author}</h3>
        <p class="cart__price">Price: $${book.price}</p>
        <div class="cart__actions">
        <div class="cart__btns">
        <button class="cart__icon cart__icon--minus"><i class="fa-solid fa-minus"></i></button>
        <span class="cart__qty">1</span>
        <button class="cart__icon cart__icon--plus"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="cart__remove"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
  `;

  cartItem.querySelector('.cart__remove').addEventListener('click', () => {
    cartItem.remove();
  });

  fragment.append(cartItem);

  cartsContainer.append(fragment);
}

bookCatalogContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('book__btn--add')) {
    const bookElement = event.target.closest('.book');
    const book = {
      title: bookElement.querySelector('.book__title').textContent,
      author: bookElement.querySelector('.book__author').textContent,
      price: bookElement.querySelector('.book__price').textContent.replace('Price: $', ''),
      imageLink: bookElement.querySelector('.book__image').src,
    };

    addToCart(book);
  }
});
