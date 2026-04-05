const db = require('../config/database');

// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private
exports.getAllCategories = async (req, res) => {
    try {
        const sql = `SELECT id, name, type FROM categories WHERE (user_id = ? OR user_id IS NULL) AND type = 'expense' ORDER BY id ASC`;
        const [rows] = await db.query(sql, [req.user.id]);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name ? req.body.name.trim() : '';

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const checkSql = `SELECT id FROM categories WHERE type = 'expense' AND name = ? AND (user_id = ? OR user_id IS NULL)`;
        const [existing] = await db.query(checkSql, [name, req.user.id]);

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const insertSql = `INSERT INTO categories (user_id, name, type) VALUES (?, ?, 'expense')`;
        await db.query(insertSql, [req.user.id, name]);

        res.status(201).json({ success: true, message: 'Category created' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
    try {
        const sql = `SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)`;
        const [rows] = await db.query(sql, [req.params.id, req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
    try {
        const name = req.body.name ? req.body.name.trim() : '';

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const sql = `UPDATE categories SET name = ? WHERE id = ? AND type = 'expense'`;
        const [result] = await db.query(sql, [name, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category updated' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
    try {
        const sql = `DELETE FROM categories WHERE id = ? AND type = 'expense'`;
        const [result] = await db.query(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};