// expenses.js
// Renders the Expenses page (list + filters + delete).
// Course-safe: DOM + events + arrays/objects + localStorage.

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
    // iso: YYYY-MM-DD
    const [y, m, d] = String(iso).split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = Number(m);
    if (!mm || mm < 1 || mm > 12) return iso;
    return `${months[mm - 1]} ${Number(d)}, ${y}`;
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

        const all = getAllExpenses();
        const idx = all.findIndex(x => String(x.id) === String(e.id));
        if (idx !== -1) {
          all.splice(idx, 1);
          setAllExpenses(all);
        }
        render();
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
  populateCategoryFilter();
  render();
});
