

// reports.js
// Renders the Reports page: totals + simple category bars.
// Course-safe: DOM + events + arrays/objects + localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'pet_expenses_v1';

  const monthSelect = document.querySelector('#monthSelect');
  const totalSpendingEl = document.querySelector('#totalSpending');
  const expenseCountEl = document.querySelector('#expenseCount');
  const barWrap = document.querySelector('#barWrap');
  const noData = document.querySelector('#noData');

  function loadExpenses() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function money(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function render() {
    const month = monthSelect.value;
    const expenses = loadExpenses().filter(e => String(e.month) === String(month));

    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    totalSpendingEl.textContent = money(total);
    expenseCountEl.textContent = expenses.length;

    barWrap.innerHTML = '';

    if (expenses.length === 0) {
      noData.hidden = false;
      return;
    }
    noData.hidden = true;

    const byCategory = {};
    for (const e of expenses) {
      const cat = String(e.category || 'Uncategorized');
      byCategory[cat] = (byCategory[cat] || 0) + Number(e.amount || 0);
    }

    // Sort categories by highest spending first
    const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const max = entries.length ? Math.max(...entries.map(([, v]) => v)) : 0;

    for (const [cat, value] of entries) {
      const percent = max > 0 ? (value / max) * 100 : 0;

      const row = document.createElement('div');
      row.className = 'barRow';

      const label = document.createElement('div');
      label.className = 'barLabel';
      label.textContent = cat;

      const track = document.createElement('div');
      track.className = 'barTrack';

      const fill = document.createElement('div');
      fill.className = 'barFill';
      fill.style.width = percent + '%';

      track.appendChild(fill);

      const val = document.createElement('div');
      val.className = 'barValue';
      val.textContent = money(value);

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(val);

      barWrap.appendChild(row);
    }
  }

  monthSelect.addEventListener('change', render);
  render();
});