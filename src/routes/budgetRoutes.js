const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// All budget routes are protected
router.use(protect);

// Get all budgets
router.get('/', budgetController.getAllBudgets);

// Create a new budget
router.post('/', budgetController.createBudget);

// Get single budget
router.get('/:id', budgetController.getBudgetById);

// Update budget
router.put('/:id', budgetController.updateBudget);

// Delete budget
router.delete('/:id', budgetController.deleteBudget);

// Get current month budget
router.get('/current/month', budgetController.getCurrentMonthBudget);

// Get budget vs actual spending
router.get('/:year/:month/spending', budgetController.getBudgetVsActual);

module.exports = router;