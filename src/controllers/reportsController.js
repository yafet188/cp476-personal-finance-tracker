const db = require('../config/database');

exports.getReportsSummary = (req, res) => {
  const summary = {
    totalExpenses: 0,
    totalBudgets: 0,
    byCategory: []
  };

  const expenseSql = `
    SELECT SUM(amount) AS totalExpenses
    FROM transactions
    WHERE type = 'expense' AND YEAR(date) = 2026 AND MONTH(date) = 1
  `;

  const budgetSql = `
    SELECT SUM(amount) AS totalBudgets
    FROM budgets
    WHERE year = 2026 AND month = 1
  `;

  const categorySql = `
    SELECT c.name AS category, SUM(t.amount) AS spent
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense' AND YEAR(t.date) = 2026 AND MONTH(t.date) = 1
    GROUP BY c.name
    ORDER BY spent DESC
  `;

  db.query(expenseSql, function(err, expenseResults) {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    summary.totalExpenses = Number(expenseResults[0].totalExpenses || 0);

    db.query(budgetSql, function(err, budgetResults) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      summary.totalBudgets = Number(budgetResults[0].totalBudgets || 0);

      db.query(categorySql, function(err, categoryResults) {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        var rows = [];
        var i;

        for (i = 0; i < categoryResults.length; i++) {
          rows.push({
            category: categoryResults[i].category,
            spent: Number(categoryResults[i].spent || 0)
          });
        }

        summary.byCategory = rows;

        res.status(200).json({
          success: true,
          data: summary
        });
      });
    });
  });
};