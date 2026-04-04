// reports.js
// Renders the Reports page: totals + simple category bars.

document.addEventListener('DOMContentLoaded', () => {
  const monthSelect = document.querySelector('#monthSelect');
  const totalSpendingEl = document.querySelector('#totalSpending');
  const expenseCountEl = document.querySelector('#expenseCount');
  const barWrap = document.querySelector('#barWrap');
  const noData = document.querySelector('#noData');

  let reportData = null;

  function fetchReports(callback) {
    fetch('http://localhost:3000/api/reports')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Failed to load reports');
        }
        return res.json();
      })
      .then(function(payload) {
        reportData = payload && payload.data ? payload.data : null;
        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error(err);
        reportData = null;
        noData.hidden = false;
      });
  }

  function money(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function render() {
    const data = reportData || {
      totalExpenses: 0,
      totalBudgets: 0,
      byCategory: []
    };

    const total = Number(data.totalExpenses || 0);
    const rows = Array.isArray(data.byCategory) ? data.byCategory : [];

    totalSpendingEl.textContent = money(total);
    expenseCountEl.textContent = rows.length;

    barWrap.innerHTML = '';

    if (rows.length === 0) {
      noData.hidden = false;
      return;
    }
    noData.hidden = true;

    let max = 0;
    let i;

    for (i = 0; i < rows.length; i++) {
      const spent = Number(rows[i].spent || 0);
      if (spent > max) {
        max = spent;
      }
    }

    for (i = 0; i < rows.length; i++) {
      const cat = String(rows[i].category || 'Uncategorized');
      const value = Number(rows[i].spent || 0);
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

  monthSelect.addEventListener('change', function() {
    fetchReports(function() {
      render();
    });
  });

  fetchReports(function() {
    render();
  });
});