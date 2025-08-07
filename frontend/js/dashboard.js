const BACKEND_URL = 'http://localhost:3000'; 

let currentPage = 1;
const ITEMS_PER_PAGE = 10;


async function fetchUserProfile() {
  const res = await fetch(`${BACKEND_URL}/api/auth/profile`, { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  const data = await res.json();
  if (!data.success || !data.user) throw new Error('Not authenticated');
  return data.user;
}
function renderPagination(pagination) {
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = ''; 

  const { page, totalPages } = pagination;

  if (totalPages <= 1) {
    paginationDiv.style.display = 'none'; 
    return;
  } else {
    paginationDiv.style.display = 'flex'; 
  }

  
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.disabled = page <= 1;
  prevBtn.addEventListener('click', () => fetchExpenses(page - 1));
  paginationDiv.appendChild(prevBtn);

  
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(totalPages, page + 2);

  
  if (page <= 3) endPage = Math.min(5, totalPages);
  if (page > totalPages - 3) startPage = Math.max(1, totalPages - 4);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    if (i === page) pageBtn.classList.add('active');
    pageBtn.addEventListener('click', () => fetchExpenses(i));
    paginationDiv.appendChild(pageBtn);
  }

  
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = page >= totalPages;
  nextBtn.addEventListener('click', () => fetchExpenses(page + 1));
  paginationDiv.appendChild(nextBtn);
}


async function checkPremiumStatusAndShowDownload() {
  try {
    const user = await fetchUserProfile();

    document.getElementById('usernameDisplay').textContent = user.username;
    if (user.isPremium) {
      document.getElementById('premiumSection').style.display = 'none';
      document.getElementById('leaderboardSection').style.display = 'block';
      document.getElementById('downloadBtn').style.display = 'inline-block';
      loadLeaderboard();
    } else {
      document.getElementById('premiumSection').style.display = 'block';
      document.getElementById('leaderboardSection').style.display = 'none';
      document.getElementById('downloadBtn').style.display = 'none';
    }
  } catch (e) {
    window.location.href = 'login.html';
  }
}

async function downloadExpensesCSV() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/expenses`, { credentials: 'include' });
    const result = await response.json();

    if (!result.success || !result.expenses.length) {
      alert('No expenses available for download.');
      return;
    }

    const expenses = result.expenses;
    let csv = 'Amount,Category,Description,Date\n';
    expenses.forEach(e => {
      const desc = e.description ? e.description.replace(/"/g,'""') : '';
      csv += `"${e.amount}","${e.category}","${desc}","${e.expense_date}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download expenses:', error);
    alert('Failed to download expenses.');
  }
}

document.getElementById('downloadBtn').addEventListener('click', downloadExpensesCSV);

async function logout() {
  await fetch(`${BACKEND_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', logout);

async function fetchExpenses(page = 1, limit = ITEMS_PER_PAGE) {
  currentPage = page;
  const res = await fetch(`${BACKEND_URL}/api/expenses?page=${page}&limit=${limit}`, { credentials: 'include' });
  const data = await res.json();
  if (data.success) {
    populateExpenses(data.expenses);
    renderPagination(data.pagination);
  } else {
    alert('Failed to load expenses');
  }
}

function populateExpenses(expenses) {
  const container = document.getElementById('expensesList');
  container.innerHTML = '';
  if (!expenses.length) {
    container.innerHTML = '<p>No expenses found.</p>';
    return;
  }
  expenses.forEach(expense => {
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <div>
        <strong>${expense.category}</strong> - ₹${Number(expense.amount).toFixed(2)}  on ${expense.expense_date} <br/>
        <small>${expense.description || ''}</small>
      </div>
      <div class="expense-controls">
        <button onclick="deleteExpense(${expense.id})">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function addExpense(event) {
  event.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const expenseDate = document.getElementById('expenseDate').value;
  const description = document.getElementById('description').value.trim();
  const messageDiv = document.getElementById('expenseMessage');
  messageDiv.textContent = '';
  if (!amount || !category || !expenseDate) {
    messageDiv.textContent = 'Amount, category and date are required.';
    return;
  }
  const res = await fetch(`${BACKEND_URL}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ amount, category, description, expense_date: expenseDate })
  });
  const data = await res.json();
  if (data.success) {
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Expense added successfully!';
    document.getElementById('expenseForm').reset();
    
    fetchExpenses(currentPage);
     loadLeaderboard();
  } else {
    messageDiv.style.color = 'red';
    messageDiv.textContent = data.message || 'Failed to add expense.';
  }
}

document.getElementById('expenseForm').addEventListener('submit', addExpense);

window.deleteExpense = async function(id) {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  const res = await fetch(`${BACKEND_URL}/api/expenses/${id}`, { method: 'DELETE', credentials: 'include' });
  const data = await res.json();
  if (data.success) {
    fetchExpenses(currentPage);
    loadLeaderboard();
  } else {
    alert(data.message || 'Failed to delete expense.');
  }
};

document.getElementById('upgradeBtn').addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

async function loadLeaderboard() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/leaderboard`, { credentials: 'include' });
    const data = await res.json();
    if (data.success && data.leaderboard?.length) {
      const leaderboard = document.getElementById('leaderboard');
      leaderboard.innerHTML = '';
      data.leaderboard.forEach((user, idx) => {
        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        div.innerHTML = `
          <div>#${idx+1}</div>
          <div>${user.username}</div>
          <div>₹${Number(user.total_spent).toFixed(2)}</div>
          <div>${user.total_expenses}</div>
        `;
        leaderboard.appendChild(div);
      });
    } else {
      document.getElementById('leaderboard').innerHTML = '<em>No data</em>';
    }
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await checkPremiumStatusAndShowDownload();
  fetchExpenses(1, ITEMS_PER_PAGE);
});
