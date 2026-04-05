// expense-edit.js
// Pre-fills and submits the Edit Expense form via the backend API.

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('pet_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const AUTH_HEADER = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  const id = new URLSearchParams(window.location.search).get('id');

  const amountInput= document.querySelector('#amountInput');
  const dateInput= document.querySelector('#dateInput');
  const categoryInput = document.querySelector('#categoryInput');
  const noteInput= document.querySelector('#noteInput');
  const formError= document.querySelector('#formError');
  const editForm = document.querySelector('#editExpenseForm');

  function showError(msg) {
    formError.style.display = 'block';
    formError.textContent = msg;
  }

  if (!id) {
    showError('No expense ID found in URL.');
    return;
  }

  // Populate category dropdown with value=id, text=name
  async function loadCategories(selectedCategoryId) {
    try {
      const res = await fetch('http://localhost:3000/api/categories', {
        headers: AUTH_HEADER
      });
      const payload = await res.json();
      if (!payload.success) return;

      categoryInput.innerHTML = '<option value="">Select category</option>';
      for (const cat of payload.data) {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        categoryInput.appendChild(opt);
      }

      if (selectedCategoryId) categoryInput.value = selectedCategoryId;
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }

  // Fetch expense and pre-fill form
  async function loadExpense() {
    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        headers: AUTH_HEADER
      });
      const payload = await res.json();

      if (!payload.success || !payload.data) {
        showError('Could not find that expense.');
        return;
      }

      const e = payload.data;
      amountInput.value  = Number(e.amount || 0).toFixed(2);
      dateInput.value    = String(e.date || '').slice(0, 10);
      noteInput.value    = e.note || '';

      await loadCategories(e.category_id);
    } catch (err) {
      console.error('Failed to load expense:', err);
      showError('Could not reach the server. Make sure the backend is running.');
    }
  }

  await loadExpense();

  // Submit — PUT /api/expenses/:id
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.style.display = 'none';

    const amount      = Number(amountInput.value);
    const date        = dateInput.value;
    const category_id = categoryInput.value;
    const note        = noteInput.value.trim();

    if (!amount || amount <= 0) {
        showError('Amount must be greater than 0.');
        return;
    }

    if (!date) {
        showError('Date is required.');
        return;
    }

    if (!category_id) {
        showError('Please select a category.');
        return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'PUT',
        headers: AUTH_HEADER,
        body: JSON.stringify({ amount, date, category_id, note })
      });
      const payload = await res.json();

      if (payload.success) {
        window.location.href = 'expenses.html';
      } else {
        showError(payload.message || 'Failed to update expense.');
      }
    } catch (err) {
      console.error('Update error:', err);
      showError('Could not reach the server. Make sure the backend is running.');
    }
  });
});
