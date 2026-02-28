

// budgets.js
// Handles the Budgets page (overall monthly budget + optional category budgets).
// Course-safe: DOM + events + arrays/objects + localStorage.

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

  const STORAGE_KEY = 'pet_budgets_v1';

  function money(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function loadAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveAll(obj) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function getMonthData(all, month) {
    if (!all[month]) {
      all[month] = { overall: 0, categories: {} };
    }
    if (!all[month].categories || typeof all[month].categories !== 'object') {
      all[month].categories = {};
    }
    return all[month];
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

  function categoryTotal(catObj) {
    return Object.values(catObj).reduce((sum, v) => sum + Number(v || 0), 0);
  }

  function render() {
    hideErr(overallError);
    hideErr(categoryError);

    const all = loadAll();
    const month = monthSelect.value;
    const data = getMonthData(all, month);

    overallBudgetInput.value = data.overall ? Number(data.overall).toFixed(2) : '';

    const total = categoryTotal(data.categories);
    categorySummary.textContent = `Category total: ${money(total)}`;

    tbody.innerHTML = '';
    const entries = Object.entries(data.categories);

    noCategoryBudgets.hidden = entries.length !== 0;

    for (const [cat, val] of entries) {
      const tr = document.createElement('tr');

      const tdCat = document.createElement('td');
      tdCat.textContent = cat;

      const tdBud = document.createElement('td');
      tdBud.className = 'right';
      tdBud.textContent = money(Number(val));

      const tdActions = document.createElement('td');
      tdActions.className = 'right';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'linkBtn';
      editBtn.textContent = 'Edit';
      editBtn.style.marginRight = '12px';
      editBtn.addEventListener('click', () => {
        categorySelect.value = cat;
        categoryBudgetInput.value = Number(val).toFixed(2);
        categoryBudgetInput.focus();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'linkBtn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        const ok = window.confirm('Delete this category budget?');
        if (!ok) return;

        const all2 = loadAll();
        const data2 = getMonthData(all2, monthSelect.value);
        delete data2.categories[cat];
        saveAll(all2);
        setStatus('Saved');
        render();
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

    const val = Number(overallBudgetInput.value);
    if (!val || val <= 0) {
      showErr(overallError, 'Overall budget must be greater than 0.');
      return;
    }

    const all = loadAll();
    const data = getMonthData(all, monthSelect.value);

    const total = categoryTotal(data.categories);
    if (total > val) {
      showErr(overallError, `Category budgets (${money(total)}) exceed this overall budget.`);
      return;
    }

    data.overall = Number(val.toFixed(2));
    saveAll(all);
    setStatus('Saved');
    render();
  });

  // Reset overall budget
  resetOverallBtn.addEventListener('click', () => {
    hideErr(overallError);

    const ok = window.confirm('Reset overall budget for this month?');
    if (!ok) return;

    const all = loadAll();
    const data = getMonthData(all, monthSelect.value);
    data.overall = 0;

    saveAll(all);
    overallBudgetInput.value = '';
    setStatus('Saved');
    render();
  });

  // Add / Update category budget
  addOrUpdateBtn.addEventListener('click', () => {
    hideErr(categoryError);

    const cat = categorySelect.value;
    const val = Number(categoryBudgetInput.value);

    if (!cat) {
      showErr(categoryError, 'Please choose a category.');
      return;
    }

    if (!val || val <= 0) {
      showErr(categoryError, 'Category budget must be greater than 0.');
      return;
    }

    const all = loadAll();
    const data = getMonthData(all, monthSelect.value);

    const overall = Number(data.overall || 0);
    const nextCategories = { ...data.categories, [cat]: Number(val.toFixed(2)) };
    const total = categoryTotal(nextCategories);

    if (overall > 0 && total > overall) {
      showErr(categoryError, `Category total (${money(total)}) cannot exceed overall budget (${money(overall)}).`);
      return;
    }

    data.categories[cat] = Number(val.toFixed(2));
    saveAll(all);
    setStatus('Saved');

    categoryBudgetInput.value = '';
    render();
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
  render();
});