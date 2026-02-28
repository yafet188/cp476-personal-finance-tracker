

// dashboard.js
// Populates the Dashboard page using data from localStorage.
// Course-safe: DOM + events + arrays/objects.

document.addEventListener('DOMContentLoaded', () => {
  const EXPENSES_KEY = 'pet_expenses_v1';
  const BUDGETS_KEY = 'pet_budgets_v1';
  const CATEGORIES_KEY = 'pet_categories_v1';

  const monthSelect = document.querySelector('#monthSelect');
  const totalSpentEl = document.querySelector('#totalSpent');
  const budgetEl = document.querySelector('#budget');
  const remainingEl = document.querySelector('#remaining');
  const progressTextEl = document.querySelector('#budgetProgressText');
  const progressBar = document.querySelector('#progressBar');
  const progressWrap = document.querySelector('.progress');
  const categoryTbody = document.querySelector('#categoryTableBody');
  const emptyState = document.querySelector('#emptyState');

  function loadJSON(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function money(n) {
    const num = Number(n || 0);
    return '$' + num.toFixed(2);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getCategoriesList() {
    // Stored as [{id, name}, ...]
    const list = loadJSON(CATEGORIES_KEY, []);
    if (!Array.isArray(list)) return [];
    return list
      .map(c => ({
        id: Number(c.id),
        name: String(c.name || '').trim()
      }))
      .filter(c => c.name.length > 0);
  }

  function getExpensesForMonth(monthKey) {
    const list = loadJSON(EXPENSES_KEY, []);
    if (!Array.isArray(list)) return [];
    return list.filter(e => String(e.month) === String(monthKey));
  }

  function getBudgetForMonth(monthKey) {
    // Stored as an object: { "YYYY-MM": { overall: number, categories: {"Food": 100, ...} } }
    const all = loadJSON(BUDGETS_KEY, {});
    const data = all && typeof all === 'object' ? all[monthKey] : null;
    if (!data || typeof data !== 'object') {
      return { overall: 0, categories: {} };
    }
    return {
      overall: Number(data.overall || 0),
      categories: (data.categories && typeof data.categories === 'object') ? data.categories : {}
    };
  }

  function sumSpent(expenses) {
    return expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }

  function groupSpentByCategory(expenses) {
    const map = {};
    for (const e of expenses) {
      const cat = String(e.category || 'Uncategorized');
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    }
    return map;
  }

  function buildCategoryRows({ spentByCat, catBudgets, knownCats }) {
    // Union of known categories + categories with spending + categories with budgets
    const set = new Set();

    for (const c of knownCats) set.add(c);
    for (const k of Object.keys(spentByCat)) set.add(k);
    for (const k of Object.keys(catBudgets)) set.add(k);

    const rows = [];
    for (const cat of set) {
      const spent = Number(spentByCat[cat] || 0);
      const budget = Number(catBudgets[cat] || 0);
      const remaining = budget > 0 ? (budget - spent) : null;

      rows.push({ cat, spent, budget, remaining });
    }

    // Sort: highest spent first, then alphabetical
    rows.sort((a, b) => {
      if (b.spent !== a.spent) return b.spent - a.spent;
      return a.cat.localeCompare(b.cat);
    });

    return rows;
  }

  function render() {
    const monthKey = monthSelect?.value || '2026-01';

    const expenses = getExpensesForMonth(monthKey);
    const totalSpent = sumSpent(expenses);

    const budgetData = getBudgetForMonth(monthKey);
    const overallBudget = Number(budgetData.overall || 0);
    const remaining = overallBudget > 0 ? (overallBudget - totalSpent) : 0;

    // Top cards
    totalSpentEl.textContent = money(totalSpent);
    budgetEl.textContent = money(overallBudget);
    remainingEl.textContent = money(remaining);

    // Progress
    let percent = 0;
    if (overallBudget > 0) {
      percent = clamp((totalSpent / overallBudget) * 100, 0, 999);
    }
    const percentRounded = Math.round(percent);
    progressTextEl.textContent = `${percentRounded}% used`;

    // ARIA and width
    const ariaNow = clamp(percentRounded, 0, 100);
    if (progressWrap) progressWrap.setAttribute('aria-valuenow', String(ariaNow));
    progressBar.style.width = clamp(percent, 0, 100) + '%';

    // Category table
    const spentByCat = groupSpentByCategory(expenses);

    const categoriesList = getCategoriesList().map(c => c.name);
    const rows = buildCategoryRows({
      spentByCat,
      catBudgets: budgetData.categories,
      knownCats: categoriesList
    });

    categoryTbody.innerHTML = '';

    if (expenses.length === 0 && rows.length === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    for (const r of rows) {
      const tr = document.createElement('tr');

      const tdCat = document.createElement('td');
      tdCat.textContent = r.cat;

      const tdSpent = document.createElement('td');
      tdSpent.className = 'right';
      tdSpent.textContent = money(r.spent);

      const tdBudget = document.createElement('td');
      tdBudget.className = 'right';
      tdBudget.textContent = r.budget > 0 ? money(r.budget) : '—';

      const tdRemaining = document.createElement('td');
      tdRemaining.className = 'right';
      if (r.remaining === null) {
        tdRemaining.textContent = '—';
      } else {
        tdRemaining.textContent = money(r.remaining);
      }

      tr.appendChild(tdCat);
      tr.appendChild(tdSpent);
      tr.appendChild(tdBudget);
      tr.appendChild(tdRemaining);

      categoryTbody.appendChild(tr);
    }
  }

  // Re-render when the month changes
  if (monthSelect) {
    monthSelect.addEventListener('change', render);
  }

  // Initial render
  render();
});