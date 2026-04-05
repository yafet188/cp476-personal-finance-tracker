// dashboard.js
// Populates the Dashboard page using data from localStorage.

document.addEventListener('DOMContentLoaded', () => {

  const token = localStorage.getItem('pet_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const AUTH_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };

  const monthSelect = document.querySelector('#monthSelect');
  const totalSpentEl = document.querySelector('#totalSpent');
  const budgetEl = document.querySelector('#budget');
  const remainingEl = document.querySelector('#remaining');
  const progressTextEl = document.querySelector('#budgetProgressText');
  const progressBar = document.querySelector('#progressBar');
  const progressWrap = document.querySelector('.progress');
  const categoryTbody = document.querySelector('#categoryTableBody');
  const emptyState = document.querySelector('#emptyState');
  let dashboardData = null;

  function money(n) {
    const num = Number(n || 0);
    return '$' + num.toFixed(2);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }


  async function fetchDashboard() {
    try {

      let url = 'http://localhost:3000/api/dashboard';
      const selectedMonth = monthSelect.value;

      // If a specific month is selected (not "all"), append query parameters
      if (selectedMonth && selectedMonth !== 'all') {
        const [year, month] = selectedMonth.split('-');
        url += `?year=${year}&month=${month}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: AUTH_HEADER
      });

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = 'login.html';
          return;
        }
        throw new Error('Failed to load');
      }

      const payload = await res.json();

      // Adapt to your backend's specific response structure (usually payload.data)
      dashboardData = payload.data || payload;

      render();
    } catch (err) {
      console.error('Dashboard error:', err);
    }
  }

    if (monthSelect) {
      monthSelect.addEventListener('change', () => {
        fetchDashboard();
      });
    }

  function render() {
    const data = dashboardData || {
      totalExpenses: 0,
      totalBudgets: 0,
      categoryCount: 0,
      expenseCount: 0
    };

    const totalSpent = Number(data.totalExpenses || 0);
    const overallBudget = Number(data.totalBudgets || 0);
    const remaining = overallBudget - totalSpent;

    totalSpentEl.textContent = money(totalSpent);
    budgetEl.textContent = money(overallBudget);
    remainingEl.textContent = money(remaining);

    let percent = 0;
    if (overallBudget > 0) {
      percent = clamp((totalSpent / overallBudget) * 100, 0, 999);
    }
    const percentRounded = Math.round(percent);
    progressTextEl.textContent = `${percentRounded}% used`;

    const ariaNow = clamp(percentRounded, 0, 100);
    if (progressWrap) progressWrap.setAttribute('aria-valuenow', String(ariaNow));
    progressBar.style.width = clamp(percent, 0, 100) + '%';

    categoryTbody.innerHTML = '';

    if (data.categoryCount === 0 && data.expenseCount === 0) {
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    const rows = [
      { label: 'Expenses This Month', spent: totalSpent, budget: overallBudget, remaining: remaining },
      { label: 'Expense Transactions', spent: Number(data.expenseCount || 0), budget: 0, remaining: null },
      { label: 'Expense Categories', spent: Number(data.categoryCount || 0), budget: 0, remaining: null }
    ];

    var i;
    for (i = 0; i < rows.length; i++) {
      const r = rows[i];
      const tr = document.createElement('tr');

      const tdCat = document.createElement('td');
      tdCat.textContent = r.label;

      const tdSpent = document.createElement('td');
      tdSpent.className = 'right';
      tdSpent.textContent = i === 0 ? money(r.spent) : String(r.spent);

      const tdBudget = document.createElement('td');
      tdBudget.className = 'right';
      tdBudget.textContent = i === 0 ? money(r.budget) : '—';

      const tdRemaining = document.createElement('td');
      tdRemaining.className = 'right';
      if (i === 0) {
        tdRemaining.textContent = money(r.remaining);
      } else {
        tdRemaining.textContent = '—';
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
    monthSelect.addEventListener('change', function() {
      fetchDashboard(function() {
        render();
      });
    });
  }

  // Initial render
  fetchDashboard(function() {
    render();
  });
});