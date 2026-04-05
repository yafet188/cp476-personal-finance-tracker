const db = require('../config/database');

// @desc    Get all budgets for logged in user
// @route   GET /api/budgets
// @access  Private
exports.getAllBudgets = async (req, res) => {
    try {
        const sql = `
            SELECT b.id, b.month, b.year, b.amount, c.name AS category, b.category_id 
            FROM budgets b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.user_id = ? 
            ORDER BY b.year DESC, b.month DESC
        `;
        const [rows] = await db.query(sql, [req.user.id]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res) => {
    try {

        const category_id = req.body.category_id || req.body.categoryId;
        const { month, year, amount } = req.body;

        const sql = `INSERT INTO budgets (user_id, category_id, month, year, amount) VALUES (?, ?, ?, ?, ?)`;
        await db.query(sql, [req.user.id, category_id, month, year, amount]);

        res.status(201).json({ success: true, message: 'Budget created' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudgetById = async (req, res) => {
    try {
        const sql = `
            SELECT b.*, c.name AS category 
            FROM budgets b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = ? AND b.user_id = ?
        `;
        const [rows] = await db.query(sql, [req.params.id, req.user.id]);

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const category_id = req.body.category_id || req.body.categoryId;
        const { month, year, amount } = req.body;

        const sql = `UPDATE budgets SET month = ?, year = ?, amount = ?, category_id = ? WHERE id = ? AND user_id = ?`;

        const [result] = await db.query(sql, [month, year, amount, category_id, req.params.id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found or changes made'
            });
        }

        res.status(200).json({ success: true, message: 'Budget updated' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
    try {
        const sql = `DELETE FROM budgets WHERE id = ? AND user_id = ?`;

        const [result] = await db.query(sql, [req.params.id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found or you do not have permission to delete it'
            });
        }

        res.status(200).json({ success: true, message: 'Budget deleted' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get current month budget
// @route   GET /api/budgets/current/month
// @access  Private
exports.getCurrentMonthBudget = async (req, res) => {
    try {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const sql = `
            SELECT b.*, c.name AS category
            FROM budgets b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.user_id = ? AND b.month = ? AND b.year = ?
        `;
        const [rows] = await db.query(sql, [req.user.id, month, year]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get budget vs actual spending for a month
// @route   GET /api/budgets/:year/:month/spending
// @access  Private
exports.getBudgetVsActual = async (req, res) => {
    try {
        const { year, month } = req.params;

        const sql = `
            SELECT 
                c.name AS category, 
                b.amount AS budget, 
                IFNULL(SUM(t.amount), 0) AS actual,
                (b.amount - IFNULL(SUM(t.amount), 0)) AS remaining
            FROM budgets b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN transactions t ON t.category_id = b.category_id 
                AND t.user_id = b.user_id 
                AND t.type = 'expense' 
                AND MONTH(t.date) = b.month 
                AND YEAR(t.date) = b.year
            WHERE b.user_id = ? AND b.month = ? AND b.year = ?
            GROUP BY b.id
        `;
        const [rows] = await db.query(sql, [req.user.id, month, year]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};