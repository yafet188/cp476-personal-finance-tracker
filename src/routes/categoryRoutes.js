const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// All category routes are protected
router.use(protect);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Create a new category
router.post('/', categoryController.createCategory);

// Get single category
router.get('/:id', categoryController.getCategoryById);

// Update category
router.put('/:id', categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;