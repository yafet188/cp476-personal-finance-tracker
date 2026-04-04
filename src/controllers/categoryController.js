const db = require('../config/database');

// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private

exports.getAllCategories = (req, res) => {
  const sql = `
    SELECT 
      id,
      name,
      type
    FROM categories
    WHERE type = 'expense'
    ORDER BY id ASC
  `;

  db.query(sql, function(err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  });
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = (req, res) => {
  const name = String(req.body.name || '').trim();

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required'
    });
  }

  const checkSql = `
    SELECT id
    FROM categories
    WHERE type = 'expense' AND name = ?
  `;

  db.query(checkSql, [name], function(err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'That category already exists'
      });
    }

    const insertSql = `
      INSERT INTO categories (user_id, name, type)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [1, name, 'expense'], function(err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: {
          id: result.insertId,
          name: name,
          type: 'expense'
        }
      });
    });
  });
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    data: {
      id: parseInt(id),
      name: 'Food',
      type: 'expense',
      isDefault: true
    }
  });
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = (req, res) => {
  const id = Number(req.params.id);
  const name = String(req.body.name || '').trim();

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Valid category id is required'
    });
  }

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Category name is required'
    });
  }

  const checkSql = `
    SELECT id
    FROM categories
    WHERE type = 'expense' AND name = ? AND id <> ?
  `;

  db.query(checkSql, [name, id], function(err, results) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'That category already exists'
      });
    }

    const updateSql = `
      UPDATE categories
      SET name = ?
      WHERE id = ? AND type = 'expense'
    `;

    db.query(updateSql, [name, id], function(err, result) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: {
          id: id,
          name: name,
          type: 'expense'
        }
      });
    });
  });
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Valid category id is required'
    });
  }

  const deleteSql = `
    DELETE FROM categories
    WHERE id = ? AND type = 'expense'
  `;

  db.query(deleteSql, [id], function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Could not delete category. It may already be used by expenses or budgets.'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  });
};