
// ==================== MODAL WINDOW ====================

const modalContainer = document.querySelector('.modal__container');
const modal = document.querySelector('.modal');
const booksEl = document.getElementById('books');

async function fetchBooks() {
  const response = await fetch('../../books.json');
  const data = await response.json();
  return data;
}

async function showModal(bookId) {
  const books = await fetchBooks();
  const book = books.find((book) => book.id.toString() === bookId.toString());

  if (book) {
    modalContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const bookItem = document.createElement('div');
    const buttonEl = document.createElement('button');
    bookItem.classList.add('modal__content');
    buttonEl.classList.add('modal__close-button');

    buttonEl.innerHTML = `<i class='fa-solid fa-x'></i>`;

    buttonEl.addEventListener('click', closeModal);

    bookItem.innerHTML = `
      <h2 class="modal__header">${book.title}</h2>
      <p class="modal__desc">${book.description}</p>
    `;

    fragment.append(buttonEl, bookItem);
    modalContainer.append(fragment);
  }
}

const closeModal = function () {
  overlay.classList.add('hidden');
  modal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
};

booksEl.addEventListener('click', (e) => {
  if (e.target.closest('.book__btn--more')) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    const book = e.target.closest('.book');
    if (book) {
      const bookId = book.getAttribute('data-id');
      showModal(bookId);
    }
  }
});

overlay.addEventListener('click', closeModal);

// ==================== RENDERING BOOK ELEMENT ====================

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
    bookItem.setAttribute('draggable', 'true');
    bookItem.setAttribute('data-id', book.id);

    const fullImagePath = `assets/images/${book.imageLink}`;

    bookItem.addEventListener('dragstart', (event) => {
      const bookData = {
        ...book,
        imageLink: fullImagePath,
      };
      event.dataTransfer.setData('bookData', JSON.stringify(bookData));
      event.dataTransfer.effectAllowed = 'move';
    });

    const truncatedTitle = truncateTitle(38, book.title);

    bookItem.innerHTML = `
    <img src="${fullImagePath}" alt="${book.title}" class="book__image" />
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
const cartSection = document.getElementById('cart');
const cartsEl = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function addToCart(book) {
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

  const existedCartProductIndex = cartProducts.findIndex((cart) => cart.id.toString() === book.id.toString());
  let newQuantity = 1;

  if (existedCartProductIndex !== -1) {
    cartProducts[existedCartProductIndex].qty += 1;
  } else {
    const newCartProduct = {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageLink: book.imageLink,
      qty: newQuantity,
    };

    cartProducts.push(newCartProduct);
  }

  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

  renderCarts();
}

// ==================== RENDER CARTS ====================

function renderCarts() {
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

  cartsEl.innerHTML = '';
  let cartTotalSum = 0;

  cartProducts.forEach((book) => {
    const fragment = document.createDocumentFragment();

    cartTotalSum += book.price * book.qty;

    cartTotal.textContent = `Total: $${cartTotalSum}`;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart__item');
    cartItem.setAttribute('data-id', book.id);

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
        <span class="cart__qty">${book.qty}</span>
        <button class="cart__icon cart__icon--plus"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="cart__remove"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
  `;

    cartItem.querySelector('.cart__remove').addEventListener('click', () => {
      cartItem.remove();

      cartProducts = cartProducts.filter((cartProduct) => cartProduct.id.toString() !== book.id.toString());

      localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    });

    fragment.append(cartItem);

    cartsEl.append(fragment);
  });
}

renderCarts();

bookCatalogContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('book__btn--add')) {
    const bookElement = event.target.closest('.book');
    const book = {
      id: bookElement.dataset.id,
      title: bookElement.querySelector('.book__title').textContent,
      author: bookElement.querySelector('.book__author').textContent,
      price: bookElement.querySelector('.book__price').textContent.replace('Price: $', ''),
      imageLink: bookElement.querySelector('.book__image').src,
    };

    addToCart(book);
  }
});

// ==================== DRAG AND DROP ====================

cartSection.addEventListener('dragover', (event) => {
  event.preventDefault();
});

cartSection.addEventListener('drop', (event) => {
  event.preventDefault();
  const bookData = event.dataTransfer.getData('bookData');
  if (bookData) {
    const book = JSON.parse(bookData);
    addToCart(book);
  }
});

// ============== INCREASING AND DECREASING CART QUANTITIES ==============

cartsEl.addEventListener('click', (e) => {
  if (e.target.closest('.cart__icon--plus')) {
    e.preventDefault();
    const cartProduct = e.target.closest('.cart__item');
    if (cartProduct) {
      increaseQty(cartProduct.dataset.id);
      renderCarts();
    }
  }

  if (e.target.closest('.cart__icon--minus')) {
    e.preventDefault();
    const cartProduct = e.target.closest('.cart__item');
    if (cartProduct) {
      decreaseQty(cartProduct.dataset.id);
      renderCarts();
    }
  }
});

function increaseQty(cartId) {
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

  cartProducts = cartProducts.map((cartProduct) => {
    if (cartProduct.id.toString() === cartId.toString()) {
      cartProduct.qty += 1;
    }
    return cartProduct;
  });

  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
}

function decreaseQty(cartId) {
  let cartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];

  cartProducts = cartProducts.map((cartProduct) => {
    if (cartProduct.id.toString() === cartId.toString()) {
      cartProduct.qty = cartProduct.qty > 1 ? cartProduct.qty - 1 : 1;
    }
    return cartProduct;
  });

  localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
}
