// --==================== TOGGLE GIFTS ====================

const giftsToggle = document.getElementById('gifts-toggle');
const giftOptions = document.getElementById('gift-options');
const giftCheckboxes = document.querySelectorAll('.checkout__gift-input');

giftsToggle.addEventListener('change', () => {
  if (giftsToggle.checked) {
    giftOptions.classList.remove('hidden');
  } else {
    giftOptions.classList.add('hidden');
  }
});

giftCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const checkedCount = document.querySelectorAll('.checkout__gift-input:checked').length;

    if (checkedCount >= 2) {
      giftCheckboxes.forEach((box) => {
        if (!box.checked) {
          box.disabled = true;
        }
      });
    } else {
      giftCheckboxes.forEach((box) => {
        box.disabled = false;
      });
    }
  });
});

// --==================== INPUT VALIDATION ====================

const form = document.getElementById('checkout-form');
const completeButton = document.getElementById('complete-button');
const requiredInputs = form.querySelectorAll('.checkout__input[required]');
const paymentOptions = form.querySelectorAll('input[name="payment"]');
const paymentError = document.getElementById('payment-error');
const dateInput = document.getElementById('dates');

const today = new Date();

const nextDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

const errorMessages = {
  name: 'Name must be at least 4 characters.',
  surname: 'Surname must be at least 5 characters.',
  street: 'Street must be at least 5 characters.',
  house: 'House number must be a positive number.',
  flat: 'Flat number must be a positive number and not start with a dash.',
  dates: 'Date must not be earlier than the next day.',
  payment: 'Please select a payment method.',
};

function validateInput(input, showError = false) {
  const errorSpan = document.getElementById(`${input.id}-error`);
  let isValid = true;

  if (input.type === 'text' && (input.id === 'name' || input.id === 'surname')) {
    // Check for no spaces and minimum length
    if (
      /\s/.test(input.value) ||
      (input.id === 'name' && input.value.length < 4) ||
      (input.id === 'surname' && input.value.length < 5)
    ) {
      isValid = false;
      if (showError) {
        input.classList.add('checkout__input--error');
        errorSpan.textContent = `The ${input.id} should have no spaces and at least ${
          input.id === 'name' ? 4 : 5
        } characters.`;
      }
    } else {
      input.classList.remove('checkout__input--error');
      if (errorSpan) errorSpan.textContent = '';
    }
  } else if (input.type === 'date') {
    const selectedDate = new Date(input.value);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < nextDay) {
      isValid = false;
      if (showError) {
        input.classList.add('checkout__input--error');
        errorSpan.textContent = errorMessages[input.id] || 'Invalid date';
      }
    } else {
      input.classList.remove('checkout__input--error');
      if (errorSpan) errorSpan.textContent = '';
    }
  } else if (!input.checkValidity()) {
    isValid = false;
    if (showError) {
      input.classList.add('checkout__input--error');
      errorSpan.textContent = errorMessages[input.id] || 'Invalid input';
    }
  } else {
    input.classList.remove('checkout__input--error');
    if (errorSpan) errorSpan.textContent = '';
  }

  return isValid;
}

function validatePayment(showError = false) {
  const isChecked = Array.from(paymentOptions).some((option) => option.checked);

  if (!isChecked && showError) {
    paymentError.textContent = 'Please select a payment method.';
    return false;
  }

  paymentError.textContent = '';
  return isChecked;
}

function validateForm() {
  let allValid = true;

  requiredInputs.forEach((input) => {
    if (!validateInput(input, false)) {
      allValid = false;
    }
  });

  if (!validatePayment(false)) {
    allValid = false;
  }

  completeButton.disabled = !allValid;
}

requiredInputs.forEach((input) => {
  input.addEventListener('input', () => {
    validateForm();
  });

  input.addEventListener('blur', () => {
    validateInput(input, true);
    validateForm();
  });
});

paymentOptions.forEach((option) => {
  option.addEventListener('change', () => {
    validatePayment(true);
    validateForm();
  });
});

validateForm();

// --==================== RENDERING ORDER ====================

const checkoutEl = document.getElementById('checkout');
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const streetInput = document.getElementById('street');
const houseInput = document.getElementById('house');
const flatInput = document.getElementById('flat');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value;
  const surname = surnameInput.value;
  const street = streetInput.value;
  const house = houseInput.value;
  const flat = flatInput.value;
  const dates = dateInput.value;
  const payment = document.querySelector('input[name="payment"]:checked')
    ? document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent
    : 'None';

  const selectedGifts = [];
  document.querySelectorAll('.checkout__gift-options input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) {
      const label = document.querySelector(`label[for="${checkbox.id}"]`).textContent;
      selectedGifts.push(label);
    }
  });

  const orderSummary = `
    <div class="order__info">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Surname:</strong> ${surname}</p>
    <p><strong>Street:</strong> ${street}</p>
    <p><strong>House Number:</strong> ${house}</p>
    <p><strong>Flat Number:</strong> ${flat}</p>
    <p><strong>Delivery Date:</strong> ${dates}</p>
    <p><strong>Payment Method:</strong> ${payment}</p>
    <p><strong>Gifts:</strong> ${selectedGifts.length > 0 ? selectedGifts.join(', ') : 'No gifts'}</p>
    </div>
    <a href="../index.html" class="order__link">Back to Shop</a>
`;

  const fragment = document.createDocumentFragment();
  const orderEl = document.createElement('div');
  orderEl.classList.add('order');

  orderEl.innerHTML = `
    <h2 class="order__title">Order Summary</h2>
    <div class="order__summary">${orderSummary}</div>
  `;

  fragment.append(orderEl);
  checkoutEl.append(fragment);

  document.querySelectorAll('#checkout-form input').forEach((input) => {
    input.disabled = true;
    input.value = '';
  });

  completeButton.disabled = true;
  localStorage.clear();
});
