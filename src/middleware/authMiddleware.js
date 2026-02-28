// @desc    Protect routes - authentication middleware stub
exports.protect = (req, res, next) => {
  // TODO: Implement JWT verification
  console.log('Auth middleware - to be implemented');
  
  // For now, attach a mock user to request
  req.user = {
    id: 1,
    email: 'user@example.com',
    name: 'Test User'
  };
  
  next();
};

// @desc    Optional: Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // TODO: Implement role-based access
    next();
  };
};