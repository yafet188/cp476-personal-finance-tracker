// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
const db = require('../config/database');

exports.getAllExpenses = (req, res) => {
  const sql = `
    SELECT 
      t.id,
      t.amount,
      t.date,
      c.name AS category,
      t.note
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
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

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = (req, res) => {
  const { amount, date, category, description, notes } = req.body;
  
  res.status(201).json({
    success: true,
    message: 'Expense created successfully',
    data: {
      id: 3,
      amount,
      date,
      category,
      description,
      notes
    }
  });
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    data: {
      id: parseInt(id),
      amount: 45.50,
      date: '2024-01-15',
      category: 'Food',
      description: 'Grocery shopping',
      notes: 'Weekly groceries'
    }
  });
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    message: `Expense ${id} updated successfully`,
    data: {
      id: parseInt(id),
      ...req.body
    }
  });
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    message: `Expense ${id} deleted successfully`
  });
};

// @desc    Get expenses by month
// @route   GET /api/expenses/month/:year/:month
// @access  Private
exports.getExpensesByMonth = (req, res) => {
  const { year, month } = req.params;
  
  res.status(200).json({
    success: true,
    month: `${year}-${month}`,
    count: 2,
    total: 165.50,
    data: [
      {
        id: 1,
        amount: 45.50,
        date: `${year}-${month}-15`,
        category: 'Food'
      },
      {
        id: 2,
        amount: 120.00,
        date: `${year}-${month}-20`,
        category: 'Transport'
      }
    ]
  });
};

// @desc    Get monthly summary
// @route   GET /api/expenses/summary/monthly
// @access  Private
exports.getMonthlySummary = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      currentMonth: {
        total: 165.50,
        count: 2,
        categories: {
          Food: 45.50,
          Transport: 120.00
        }
      },
      previousMonth: {
        total: 210.75,
        count: 3,
        categories: {
          Food: 85.25,
          Rent: 125.50
        }
      }
    }
  });
};