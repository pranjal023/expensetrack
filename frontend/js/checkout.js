

const form = document.getElementById('paymentForm');
const messageDiv = document.getElementById('paymentMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageDiv.textContent = '';
  messageDiv.style.color = 'red';

  const amount = form.amount.value;
  const cardNumber = form.cardNumber.value.trim();
  const expiryDate = form.expiryDate.value.trim();
  const cvv = form.cvv.value.trim();

  if (!cardNumber || !expiryDate || !cvv) {
    messageDiv.textContent = 'Please fill all card details.';
    return;
  }

  
  const orderRes = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  const orderData = await orderRes.json();
  if (!orderData.success) {
    messageDiv.textContent = 'Failed to create order: ' + (orderData.message || '');
    return;
  }
  
  
  const paymentSuccess = Math.random() < 0.7; 
  const paymentStatus = paymentSuccess ? 'SUCCESS' : 'FAILED';

  
  const updateRes = await fetch('/api/payment/update-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: orderData.orderId, paymentStatus }),
  });

  const updateData = await updateRes.json();

  if (!updateData.success) {
    messageDiv.textContent = 'Error updating payment status.';
    return;
  }

  if (paymentStatus === 'SUCCESS') {
    messageDiv.style.color = 'green';
  }

  messageDiv.textContent = updateData.message;

  if (paymentStatus === 'SUCCESS') {
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);
  }
});
