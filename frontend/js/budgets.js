// budgets.js
// Handles the Budgets page (overall monthly budget + optional category budgets).

document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.querySelector('#monthSelect');
  const statusPill = document.querySelector('#statusPill');

  const overallBudgetInput = document.querySelector('#overallBudgetInput');
  const saveOverallBtn = document.querySelector('#saveOverallBtn');
  const resetOverallBtn = document.querySelector('#resetOverallBtn');
  const overallError = document.querySelector('#overallError');

  const categorySelect = document.querySelector('#categorySelect');
  const categoryBudgetInput = document.querySelector('#categoryBudgetInput');
  const addOrUpdateBtn = document.querySelector('#addOrUpdateBtn');
  const clearCategoryBtn = document.querySelector('#clearCategoryBtn');
  const categoryError = document.querySelector('#categoryError');

  const categorySummary = document.querySelector('#categorySummary');
  const tbody = document.querySelector('#categoryBudgetsTbody');
  const noCategoryBudgets = document.querySelector('#noCategoryBudgets');

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

  function fetchBudgets(callback) {
    fetch('http://localhost:3000/api/budgets')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Failed to load budgets');
        }
        return res.json();
      })
      .then(function(payload) {
        const list = Array.isArray(payload.data) ? payload.data : [];

        allBudgets = list.map(function(item) {
          return {
            id: item.id,
            month: Number(item.month || 0),
            year: Number(item.year || 0),
            amount: Number(item.amount || 0),
            category: item.category ? String(item.category).trim() : null,
            spent: Number(item.spent || 0),
            remaining: Number(item.remaining || 0),
            percentageUsed: Number(item.percentageUsed || 0)
          };
        });

        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error(err);
        showErr(overallError, 'Could not load budgets.');
      });
  }

  function getMonthNumber(monthValue) {
    const parts = String(monthValue || '').split('-');
    return Number(parts[1] || 0);
  }

  function getYearNumber(monthValue) {
    const parts = String(monthValue || '').split('-');
    return Number(parts[0] || 0);
  }

  function getBudgetsForMonth(monthValue) {
    const monthNum = getMonthNumber(monthValue);
    const yearNum = getYearNumber(monthValue);

    return allBudgets.filter(function(item) {
      return item.month === monthNum && item.year === yearNum;
    });
  }

  function render() {
    hideErr(overallError);
    hideErr(categoryError);

    const month = monthSelect.value;
    const budgets = getBudgetsForMonth(month);

    overallBudgetInput.value = '';
    categoryBudgetInput.value = '';

    let total = 0;
    let i;

    for (i = 0; i < budgets.length; i++) {
      total += Number(budgets[i].amount || 0);
    }

    categorySummary.textContent = `Category total: ${money(total)}`;

    tbody.innerHTML = '';
    noCategoryBudgets.hidden = budgets.length !== 0;

    for (i = 0; i < budgets.length; i++) {
      const item = budgets[i];
      const tr = document.createElement('tr');

      const tdCat = document.createElement('td');
      tdCat.textContent = item.category || 'Overall';

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
      editBtn.addEventListener('click', function() {
        window.alert('Edit Budget is not connected to the database yet.');
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', function() {
        window.alert('Delete Budget is not connected to the database yet.');
      });

      tdActions.appendChild(editBtn);
      tdActions.appendChild(delBtn);

      tr.appendChild(tdCat);
      tr.appendChild(tdBud);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    }

    setStatus('Saved');
  }

  // Save overall budget
  saveOverallBtn.addEventListener('click', () => {
    hideErr(overallError);
    window.alert('Save Overall Budget is not connected to the database yet.');
  });

  // Reset overall budget
  resetOverallBtn.addEventListener('click', () => {
    hideErr(overallError);
    window.alert('Reset Overall Budget is not connected to the database yet.');
  });

  // Add / Update category budget
  addOrUpdateBtn.addEventListener('click', () => {
    hideErr(categoryError);
    window.alert('Add / Update Category Budget is not connected to the database yet.');
  });

  clearCategoryBtn.addEventListener('click', () => {
    hideErr(categoryError);
    categoryBudgetInput.value = '';
  });

  monthSelect.addEventListener('change', () => {
    setStatus('Saved');
    categoryBudgetInput.value = '';
    render();
  });

  // Initial render
  fetchBudgets(function() {
    render();
  });
});