// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private
exports.getAllCategories = (req, res) => {
  res.status(200).json({
    success: true,
    count: 5,
    data: [
      { id: 1, name: 'Food', type: 'expense', isDefault: true },
      { id: 2, name: 'Rent', type: 'expense', isDefault: true },
      { id: 3, name: 'Transportation', type: 'expense', isDefault: true },
      { id: 4, name: 'Entertainment', type: 'expense', isDefault: true },
      { id: 5, name: 'Utilities', type: 'expense', isDefault: true }
    ]
  });
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = (req, res) => {
  const { name, type } = req.body;
  
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: {
      id: Date.now(), // temporary ID
      name,
      type: type || 'expense',
      isDefault: false
    }
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
  const { id } = req.params;
  const { name, type } = req.body;
  
  res.status(200).json({
    success: true,
    message: `Category ${id} updated successfully`,
    data: {
      id: parseInt(id),
      name,
      type: type || 'expense',
      isDefault: false
    }
  });
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  
  res.status(200).json({
    success: true,
    message: `Category ${id} deleted successfully`
  });
};