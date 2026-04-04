// expenses.js
// Renders the Expenses page (list + filters + delete).

document.addEventListener('DOMContentLoaded', () => {
  const EXPENSES_KEY = 'pet_expenses_v1';
  const CATEGORIES_KEY = 'pet_categories_v1';

  const monthSelect = document.querySelector('#monthSelect');
  const categoryFilter = document.querySelector('#categoryFilter');
  const searchNotes = document.querySelector('#searchNotes');
  const applyBtn = document.querySelector('#applyFiltersBtn');
  const clearBtn = document.querySelector('#clearFiltersBtn');
  const tbody = document.querySelector('#expensesTbody');
  const summaryText = document.querySelector('#summaryText');
  const noResults = document.querySelector('#noResults');

  let allExpenses = [];
  let allCategories = [];

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

  function money(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function formatDate(iso) {
    if (!iso) return '';

    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return String(iso);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = dt.getMonth();
    const d = dt.getDate();
    const y = dt.getFullYear();

    return `${months[mm]} ${d}, ${y}`;
  }

  function getAllExpenses() {
    if (allExpenses.length > 0) {
      return allExpenses;
    }
    const list = loadJSON(EXPENSES_KEY, []);
    return Array.isArray(list) ? list : [];
  }

  function setAllExpenses(list) {
    saveJSON(EXPENSES_KEY, list);
  }

  function getCategories() {
    if (allCategories.length > 0) {
      return allCategories;
    }
    const list = loadJSON(CATEGORIES_KEY, []);
    if (!Array.isArray(list)) return [];
    return list
      .map(c => String(c.name || '').trim())
      .filter(Boolean);
  }

  function populateCategoryFilter() {
    // Keep the first option (All Categories)
    const current = categoryFilter.value;
    const categories = getCategories();

    // If categories storage is empty, keep the current hardcoded options.
    if (categories.length === 0) return;

    categoryFilter.innerHTML = '';

    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All Categories';
    categoryFilter.appendChild(allOpt);

    for (const name of categories) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      categoryFilter.appendChild(opt);
    }

    categoryFilter.value = categories.includes(current) ? current : 'all';
  }

  function getFilteredExpenses() {
    const month = monthSelect.value;
    const category = categoryFilter.value;
    const query = searchNotes.value.trim().toLowerCase();

    return getAllExpenses().filter(e => {
      const monthOk = String(e.month) === String(month);
      const catOk = category === 'all' ? true : String(e.category) === String(category);
      const note = String(e.note || '').toLowerCase();
      const noteOk = query === '' ? true : note.includes(query);
      return monthOk && catOk && noteOk;
    });
  }

  function fetchExpenses(callback) {
    fetch('http://localhost:3000/api/expenses')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Failed to load expenses');
        }
        return res.json();
      })
      .then(function(payload) {
        const list = Array.isArray(payload.data) ? payload.data : [];

        allExpenses = list.map(function(item) {
          return {
            id: item.id,
            amount: Number(item.amount || 0),
            date: item.date,
            month: String(item.date || '').slice(0, 7),
            category: String(item.category || '').trim(),
            note: String(item.note || item.notes || item.description || '').trim()
          };
        });

        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error(err);
        summaryText.textContent = 'Could not load expenses.';
        noResults.hidden = false;
      });
  }

  function fetchCategories(callback) {
    fetch('http://localhost:3000/api/categories')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Failed to load categories');
        }
        return res.json();
      })
      .then(function(payload) {
        const list = Array.isArray(payload.data) ? payload.data : [];

        allCategories = list
          .map(function(c) {
            return String(c.name || '').trim();
          })
          .filter(function(name) {
            return Boolean(name);
          });

        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  function render() {
    const rows = getFilteredExpenses();

    tbody.innerHTML = '';

    const total = rows.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    summaryText.textContent = `Showing ${rows.length} expense${rows.length === 1 ? '' : 's'} • Total: ${money(total)}`;

    if (rows.length === 0) {
      noResults.hidden = false;
      return;
    }

    noResults.hidden = true;

    for (const e of rows) {
      const tr = document.createElement('tr');

      const tdDate = document.createElement('td');
      tdDate.textContent = formatDate(e.date);

      const tdCat = document.createElement('td');
      tdCat.textContent = e.category;

      const tdNote = document.createElement('td');
      tdNote.textContent = e.note;

      const tdAmt = document.createElement('td');
      tdAmt.className = 'right';
      tdAmt.textContent = money(e.amount);

      const tdActions = document.createElement('td');
      tdActions.className = 'right';

      const edit = document.createElement('a');
      edit.href = `expenses-edit.html?id=${encodeURIComponent(e.id)}`;
      edit.textContent = 'Edit';
      edit.style.marginRight = '12px';

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'linkBtn';
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        const confirmed = window.confirm('Are you sure you want to delete this expense? This action cannot be undone.');
        if (!confirmed) return;

        fetch('http://localhost:3000/api/expenses/' + encodeURIComponent(e.id), {
          method: 'DELETE'
        })
          .then(function(res) {
            if (!res.ok) {
              throw new Error('Failed to delete expense');
            }
            fetchExpenses(function() {
              render();
            });
          })
          .catch(function(err) {
            console.error(err);
            window.alert('Could not delete the expense.');
          });
      });

      tdActions.appendChild(edit);
      tdActions.appendChild(del);

      tr.appendChild(tdDate);
      tr.appendChild(tdCat);
      tr.appendChild(tdNote);
      tr.appendChild(tdAmt);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    }
  }

  // Wire events
  applyBtn.addEventListener('click', render);
  clearBtn.addEventListener('click', () => {
    categoryFilter.value = 'all';
    searchNotes.value = '';
    render();
  });
  monthSelect.addEventListener('change', render);

  // Initial setup
  fetchCategories(function() {
    populateCategoryFilter();
  });

  fetchExpenses(function() {
    render();
  });
});
