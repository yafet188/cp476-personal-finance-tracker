const db = require('../config/database');

exports.getDashboardSummary = (req, res) => {
  const summary = {
    totalExpenses: 0,
    totalBudgets: 0,
    categoryCount: 0,
    expenseCount: 0
  };

  const expenseSql = `
    SELECT COUNT(*) AS expenseCount, SUM(amount) AS totalExpenses
    FROM transactions
    WHERE type = 'expense' AND year(date) = 2026 AND month(date) = 1
  `;

  const budgetSql = `
    SELECT SUM(amount) AS totalBudgets
    FROM budgets
    WHERE year = 2026 AND month = 1
  `;

  const categorySql = `
    SELECT COUNT(*) AS categoryCount
    FROM categories
    WHERE type = 'expense'
  `;

  db.query(expenseSql, function(err, expenseResults) {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    summary.expenseCount = Number(expenseResults[0].expenseCount || 0);
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

        summary.categoryCount = Number(categoryResults[0].categoryCount || 0);

        res.status(200).json({
          success: true,
          data: summary
        });
      });
    });
  });
};