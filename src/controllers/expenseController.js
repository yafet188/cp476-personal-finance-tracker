const db = require('../config/database');

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
exports.getAllExpenses = async (req, res) => {
    try {
        const sql = `
            SELECT t.id, t.amount, t.date, c.name AS category, t.note
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = 'expense'
            ORDER BY t.date DESC
        `;
        const [rows] = await db.query(sql, [req.user.id]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
    try {
        const { amount, date, category_id, note } = req.body;
        const sql = `
            INSERT INTO transactions (user_id, category_id, date, type, amount, note) 
            VALUES (?, ?, ?, 'expense', ?, ?)
        `;

        await db.query(sql, [req.user.id, category_id, date, amount, note]);

        res.status(201).json({ success: true, message: 'Expense created' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
    try {
        const sql = `SELECT * FROM transactions WHERE id = ? AND user_id = ? AND type = 'expense'`;
        const [rows] = await db.query(sql, [req.params.id, req.user.id]);

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        const { amount, date, category_id, note } = req.body;
        const sql = `UPDATE transactions SET amount = ?, date = ?, category_id = ?, note = ? WHERE id = ? AND user_id = ? AND type = 'expense'`;

        await db.query(sql, [amount, date, category_id, note, req.params.id, req.user.id]);

        res.status(200).json({ success: true, message: 'Expense updated' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private

exports.deleteExpense = async (req, res) => {
    try {
        const sql = `DELETE FROM transactions WHERE id = ? AND user_id = ? AND type = 'expense'`;
        await db.query(sql, [req.params.id, req.user.id]);

        res.status(200).json({ success: true, message: 'Expense deleted' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get expenses by month
// @route   GET /api/expenses/month/:year/:month
// @access  Private
exports.getExpensesByMonth = async (req, res) => {
    try {
        const sql = `
            SELECT t.id, t.amount, t.date, c.name AS category, t.note 
            FROM transactions t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = ? AND t.type = 'expense' AND YEAR(t.date) = ? AND MONTH(t.date) = ?
        `;

        const [rows] = await db.query(sql, [req.user.id, req.params.year, req.params.month]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get monthly summary
// @route   GET /api/expenses/summary/monthly
// @access  Private
exports.getMonthlySummary = async (req, res) => {
    try {
        const sql = `
            SELECT c.name as category, SUM(t.amount) as total 
            FROM transactions t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = ? AND t.type = 'expense' AND YEAR(t.date) = ? AND MONTH(t.date) = ? 
            GROUP BY c.name
        `;
        const [rows] = await db.query(sql, [req.user.id, req.query.year, req.query.month]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};