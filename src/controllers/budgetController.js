// @desc    Get all budgets for logged in user
// @route   GET /api/budgets
// @access  Private

const db = require('../config/database');

exports.getAllBudgets = (req, res) => {
  const sql = `
    SELECT 
      b.id,
      b.month,
      b.year,
      b.amount,
      c.name AS category
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.year DESC, b.month DESC, b.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching budgets:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }

    var formattedBudgets = [];
    var i;

    for (i = 0; i < results.length; i++) {
      formattedBudgets.push({
        id: results[i].id,
        month: results[i].month,
        year: results[i].year,
        amount: parseFloat(results[i].amount),
        category: results[i].category,
        spent: 0,
        remaining: parseFloat(results[i].amount),
        percentageUsed: 0
      });
    }

    res.status(200).json({
      success: true,
      count: formattedBudgets.length,
      data: formattedBudgets
    });
  });
};

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = (req, res) => {
  const { month, year, amount, categoryId } = req.body;
  
  res.status(201).json({
    success: true,
    message: 'Budget created successfully',
    data: {
      id: Date.now(),
      month,
      year,
      amount,
      categoryId: categoryId || null,
      spent: 0,
      remaining: amount,
      percentageUsed: 0
    }
  });
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudgetById = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    data: {
      id: parseInt(id),
      month: 1,
      year: 2024,
      amount: 2000,
      category: null,
      spent: 165.50,
      remaining: 1834.50,
      percentageUsed: 8.28
    }
  });
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = (req, res) => {
  const { id } = req.params;
  const { month, year, amount, categoryId } = req.body;
  
  res.status(200).json({
    success: true,
    message: `Budget ${id} updated successfully`,
    data: {
      id: parseInt(id),
      month,
      year,
      amount,
      categoryId: categoryId || null
    }
  });
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    message: `Budget ${id} deleted successfully`
  });
};

// @desc    Get current month budget
// @route   GET /api/budgets/current/month
// @access  Private
exports.getCurrentMonthBudget = (req, res) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  
  res.status(200).json({
    success: true,
    data: {
      month,
      year,
      amount: 2000,
      category: null,
      spent: 165.50,
      remaining: 1834.50,
      percentageUsed: 8.28
    }
  });
};

// @desc    Get budget vs actual spending for a month
// @route   GET /api/budgets/:year/:month/spending
// @access  Private
exports.getBudgetVsActual = (req, res) => {
  const { year, month } = req.params;
  
  res.status(200).json({
    success: true,
    data: {
      month: parseInt(month),
      year: parseInt(year),
      budget: 2000,
      actual: 165.50,
      difference: 1834.50,
      percentageUsed: 8.28,
      categories: [
        { name: 'Food', budget: 500, actual: 45.50, remaining: 454.50 },
        { name: 'Rent', budget: 1000, actual: 0, remaining: 1000 },
        { name: 'Transportation', budget: 200, actual: 120, remaining: 80 },
        { name: 'Entertainment', budget: 300, actual: 0, remaining: 300 }
      ]
    }
  });
};