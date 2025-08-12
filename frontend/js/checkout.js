import { apiPost } from './api.js';

const form = document.getElementById('paymentForm');
const messageDiv = document.getElementById('paymentMessage');

form.addEventListener('submit', async e => {
  e.preventDefault();
  messageDiv.textContent = '';
  messageDiv.style.color = 'red';

  const amount = form.amount.value;

  try {
    // 1. Create order on backend
    const { success, paymentLink, message } = await apiPost('/api/payment/create-order', { amount });
    if (!success) {
      messageDiv.textContent = 'Failed to create order: ' + (message || 'Unknown error');
      return;
    }

    // 2. Redirect user to Cashfree payment page
    window.location.href = paymentLink;
  } catch (err) {
    console.error('Checkout error:', err);
    messageDiv.textContent = err.message || 'Error initiating payment. Please try again.';
  }
});
