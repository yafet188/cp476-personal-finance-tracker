const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// All expense routes are protected
router.use(protect);

router.route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);

router.route('/:id')
  .get(expenseController.getExpenseById)
  .put(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

router.get('/month/:year/:month', expenseController.getExpensesByMonth);
router.get('/summary/monthly', expenseController.getMonthlySummary);

module.exports = router;