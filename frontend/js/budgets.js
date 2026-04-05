// budgets.js
// Handles the Budgets page (overall monthly budget + optional category budgets).

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('pet_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const AUTH_HEADER = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  const monthSelect= document.querySelector('#monthSelect');
  const statusPill = document.querySelector('#statusPill');

  const overallBudgetInput= document.querySelector('#overallBudgetInput');
  const saveOverallBtn= document.querySelector('#saveOverallBtn');
  const resetOverallBtn= document.querySelector('#resetOverallBtn');
  const overallError= document.querySelector('#overallError');

  const categorySelect= document.querySelector('#categorySelect');
  const categoryBudgetInput= document.querySelector('#categoryBudgetInput');
  const addOrUpdateBtn= document.querySelector('#addOrUpdateBtn');
  const clearCategoryBtn= document.querySelector('#clearCategoryBtn');
  const categoryError= document.querySelector('#categoryError');

  const categorySummary= document.querySelector('#categorySummary');
  const tbody= document.querySelector('#categoryBudgetsTbody');
  const noCategoryBudgets= document.querySelector('#noCategoryBudgets');

  let allBudgets = [];

  function money(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function showErr(el, msg) {
    el.style.display = 'block';
    el.textContent = msg;
  }

  function hideErr(el) {
    el.style.display = 'none';
    el.textContent = '';
  }

  function setStatus(text) {
    statusPill.textContent = text;
  }

  function parseMonthValue(val) {
    const parts = String(val || '').split('-');
    return { year: Number(parts[0] || 0), month: Number(parts[1] || 0) };
  }

  function getBudgetsForMonth(val) {
    const { year, month } = parseMonthValue(val);
    return allBudgets.filter(b => b.year === year && b.month === month);
  }

  async function loadCategories() {
    try {
      const res = await fetch('http://localhost:3000/api/categories', { headers: AUTH_HEADER });
      const payload = await res.json();
      if (!payload.success) return;

      categorySelect.innerHTML = '<option value="">Select a category</option>';
      for (const cat of payload.data) {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      }
    } catch (err) {
      console.error('Failed to load cat:', err);
    }
  }

  async function fetchBudgets() {
    try {
      const res = await fetch('http://localhost:3000/api/budgets', { headers: AUTH_HEADER });
      const payload = await res.json();
      if (!payload.success) return;

      allBudgets = (payload.data || []).map(b => ({
        id: b.id,
        month: Number(b.month),
        year: Number(b.year),
        amount: Number(b.amount || 0),
        category: b.category || null,
        category_id: b.category_id ?? null
      }));
    } catch (err) {
      console.error('Failed to load budgets:', err);
      showErr(overallError, 'Failed load budgets.');
    }
  }

  function render() {
    hideErr(overallError);
    hideErr(categoryError);

    const budgets    = getBudgetsForMonth(monthSelect.value);
    const overall    = budgets.find(b => b.category_id === null);
    const catBudgets = budgets.filter(b => b.category_id !== null);

    // Pre-fill overall input
    overallBudgetInput.value = overall ? Number(overall.amount).toFixed(2) : '';
    setStatus(overall ? 'Saved' : 'Not saved');

    // Cat summary
    const total = catBudgets.reduce((sum, b) => sum + b.amount, 0);
    categorySummary.textContent = `Category total: ${money(total)}`;

    // Category budgets table
    tbody.innerHTML = '';
    noCategoryBudgets.hidden = catBudgets.length !== 0;

    for (const item of catBudgets) {
      const tr = document.createElement('tr');

      const tdCat = document.createElement('td');
      tdCat.textContent = item.category;

      const tdBud = document.createElement('td');
      tdBud.className = 'right';
      tdBud.textContent = money(item.amount);

      const tdActions = document.createElement('td');
      tdActions.className = 'right';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'linkBtn';
      editBtn.textContent = 'Edit';
      editBtn.style.marginRight = '12px';
      editBtn.addEventListener('click', () => {
        categorySelect.value = item.category_id;
        categoryBudgetInput.value = Number(item.amount).toFixed(2);
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        if (!window.confirm(`Delete the budget for "${item.category}"? This cannot be undone.`)) return;
        try {
          const res = await fetch(`http://localhost:3000/api/budgets/${item.id}`, {
            method: 'DELETE',
            headers: AUTH_HEADER
          });
          const payload = await res.json();
          if (!payload.success) throw new Error(payload.message);
          await fetchBudgets();
          render();
        } catch (err) {
          console.error(err);
          window.alert('Could not delete the budget.');
        }
      });

      tdActions.appendChild(editBtn);
      tdActions.appendChild(delBtn);
      tr.appendChild(tdCat);
      tr.appendChild(tdBud);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    }
  }

  saveOverallBtn.addEventListener('click', async () => {
    hideErr(overallError);
    const amount = Number(overallBudgetInput.value);
    if (!amount || amount <= 0) {
      showErr(overallError, 'Please enter a valid budget amount.');
      return;
    }

    const { year, month } = parseMonthValue(monthSelect.value);
    const existing = allBudgets.find(b => b.category_id === null && b.year === year && b.month === month);
    const url= existing ? `http://localhost:3000/api/budgets/${existing.id}` : 'http://localhost:3000/api/budgets';
    const method= existing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: AUTH_HEADER,
        body: JSON.stringify({ category_id: null, month, year, amount })
      });

      const payload = await res.json();
      if (!payload.success) throw new Error(payload.message);

      await fetchBudgets();
      render();

    } catch (err) {
      console.error(err);
      showErr(overallError, 'Could not save the overall budget.');
    }
  });

  resetOverallBtn.addEventListener('click', async () => {
    hideErr(overallError);
    const { year, month } = parseMonthValue(monthSelect.value);
    const existing = allBudgets.find(b => b.category_id === null && b.year === year && b.month === month);

    if (!existing) {
      overallBudgetInput.value = '';
      return;
    }

    if (!window.confirm('Remove the overall budget for this month?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/budgets/${existing.id}`, {
        method: 'DELETE',
        headers: AUTH_HEADER
      });
      const payload = await res.json();
      if (!payload.success) throw new Error(payload.message);
      await fetchBudgets();
      render();
    } catch (err) {
      console.error(err);
      showErr(overallError, 'Could not reset the overall budget.');
    }
  });

  addOrUpdateBtn.addEventListener('click', async () => {
    hideErr(categoryError);
    const category_id = Number(categorySelect.value);
    const amount      = Number(categoryBudgetInput.value);

    if (!category_id) {
      showErr(categoryError,'Please select a category.');
      return;
    }
    if (!amount || amount <= 0) {
      showErr(categoryError,'Please enter a valid budget amount.');
      return;
    }

    const { year, month } = parseMonthValue(monthSelect.value);
    const existing = allBudgets.find(b => b.category_id === category_id && b.year === year && b.month === month);
    const url= existing ? `http://localhost:3000/api/budgets/${existing.id}` : 'http://localhost:3000/api/budgets';
    const method= existing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: AUTH_HEADER,
        body: JSON.stringify({ category_id, month, year, amount })
      });

      const payload = await res.json();

      if (!payload.success) throw new Error(payload.message);
      categoryBudgetInput.value = '';
      categorySelect.value = '';

      await fetchBudgets();
      render();

    } catch (err) {
      console.error(err);
      showErr(categoryError, 'Could not save the category budget.');
    }
  });

  clearCategoryBtn.addEventListener('click', () => {
    hideErr(categoryError);
    categorySelect.value = '';
    categoryBudgetInput.value = '';
  });

  monthSelect.addEventListener('change', () => {
    categoryBudgetInput.value = '';
    categorySelect.value = '';
    render();
  });

  async function init() {
    await loadCategories();
    await fetchBudgets();
    render();
  }

  init();
});
