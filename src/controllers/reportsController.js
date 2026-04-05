const db = require('../config/database');

exports.getReportsSummary = async (req, res) => {
    try {
        const date = new Date();
        const month = req.query.month || (date.getMonth() + 1);
        const year = req.query.year || date.getFullYear();

        const expenseSql = `
            SELECT SUM(amount) AS totalExpenses
            FROM transactions
            WHERE type = 'expense' AND user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
        `;
        const [[expenseResults]] = await db.query(expenseSql, [req.user.id, month, year]);

        const budgetSql = `
            SELECT SUM(amount) AS totalBudgets
            FROM budgets
            WHERE user_id = ? AND month = ? AND year = ?
        `;
        const [[budgetResults]] = await db.query(budgetSql, [req.user.id, month, year]);

        const categorySql = `
            SELECT c.name AS category, SUM(t.amount) AS spent
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.type = 'expense' AND t.user_id = ? AND MONTH(t.date) = ? AND YEAR(t.date) = ?
            GROUP BY c.name
            ORDER BY spent DESC
        `;
        const [categoryResults] = await db.query(categorySql, [req.user.id, month, year]);

        const summary = {
            totalExpenses: Number(expenseResults.totalExpenses || 0),
            totalBudgets: Number(budgetResults.totalBudgets || 0),
            byCategory: categoryResults.map(row => ({
                category: row.category,
                spent: Number(row.spent || 0)
            }))
        };

        res.status(200).json({ success: true, data: summary });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};