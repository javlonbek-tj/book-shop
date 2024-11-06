// ==================== MODAL WINDOW ====================
const modalContainer = document.querySelector('.modal__container');
const modal = document.querySelector('.modal');
const booksEl = document.getElementById('books');

export async function fetchBooks() {
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
