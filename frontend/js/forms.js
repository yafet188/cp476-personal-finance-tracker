

// forms.js
// Handles expense add/edit forms.
// Course-safe: DOM + events + arrays/objects + localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const EXPENSES_KEY = 'pet_expenses_v1';
  const CATEGORIES_KEY = 'pet_categories_v1';

  const addForm = document.querySelector('#addExpenseForm');
  const editForm = document.querySelector('#editExpenseForm');

  // If we're not on a form page, do nothing.
  if (!addForm && !editForm) return;

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

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeMonthKey(isoDate) {
    // YYYY-MM-DD -> YYYY-MM
    return String(isoDate || '').slice(0, 7);
  }

  function getAllExpenses() {
    const list = loadJSON(EXPENSES_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function setAllExpenses(list) {
    saveJSON(EXPENSES_KEY, list);
  }

  function getCategories() {
    const list = loadJSON(CATEGORIES_KEY, []);
    if (!Array.isArray(list)) return [];
    return list
      .map(c => String(c.name || '').trim())
      .filter(Boolean);
  }

  function populateCategorySelect(selectEl, selectedValue) {
    if (!selectEl) return;

    const categories = getCategories();

    // If categories storage is empty, keep whatever is hardcoded in HTML.
    if (categories.length === 0) {
      if (selectedValue != null) selectEl.value = selectedValue;
      return;
    }

    selectEl.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select category';
    selectEl.appendChild(placeholder);

    for (const name of categories) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      selectEl.appendChild(opt);
    }

    if (selectedValue != null) {
      selectEl.value = categories.includes(selectedValue) ? selectedValue : '';
    }
  }

  function showError(el, msg) {
    if (!el) return;
    el.style.display = 'block';
    el.textContent = msg;
  }

  function hideError(el) {
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function nextId(expenses) {
    return expenses.length
      ? Math.max(...expenses.map(x => Number(x.id) || 0)) + 1
      : 1;
  }

  // Shared field ids on both add + edit pages
  const amountInput = document.querySelector('#amountInput');
  const dateInput = document.querySelector('#dateInput');
  const categoryInput = document.querySelector('#categoryInput');
  const noteInput = document.querySelector('#noteInput');
  const formError = document.querySelector('#formError');

  // -------------------------
  // ADD EXPENSE
  // -------------------------
  if (addForm) {
    // Default date = today (only if empty)
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    populateCategorySelect(categoryInput, categoryInput?.value);

    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(formError);

      const amount = Number(amountInput.value);
      const date = dateInput.value;
      const category = categoryInput.value;
      const note = noteInput.value.trim();

      if (!amount || amount <= 0) {
        showError(formError, 'Amount must be greater than 0.');
        return;
      }
      if (!date) {
        showError(formError, 'Date is required.');
        return;
      }
      if (!category) {
        showError(formError, 'Please select a category.');
        return;
      }

      const expenses = getAllExpenses();

      const newExpense = {
        id: nextId(expenses),
        month: normalizeMonthKey(date),
        date,
        category,
        note,
        amount
      };

      expenses.push(newExpense);
      setAllExpenses(expenses);

      window.location.href = 'expenses.html';
    });
  }

  // -------------------------
  // EDIT EXPENSE
  // -------------------------
  if (editForm) {
    const id = getQueryParam('id');
    const expenses = getAllExpenses();
    const expense = expenses.find(x => String(x.id) === String(id));

    if (!expense) {
      showError(formError, 'Could not find that expense to edit.');
      return;
    }

    // Prefill
    amountInput.value = Number(expense.amount || 0).toFixed(2);
    dateInput.value = expense.date || '';
    noteInput.value = expense.note || '';

    populateCategorySelect(categoryInput, expense.category);

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideError(formError);

      const amount = Number(amountInput.value);
      const date = dateInput.value;
      const category = categoryInput.value;
      const note = noteInput.value.trim();

      if (!amount || amount <= 0) {
        showError(formError, 'Amount must be greater than 0.');
        return;
      }
      if (!date) {
        showError(formError, 'Date is required.');
        return;
      }
      if (!category) {
        showError(formError, 'Please select a category.');
        return;
      }

      expense.amount = amount;
      expense.date = date;
      expense.month = normalizeMonthKey(date);
      expense.category = category;
      expense.note = note;

      setAllExpenses(expenses);
      window.location.href = 'expenses.html';
    });
  }
});