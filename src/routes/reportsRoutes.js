const express = require('express');
const router = express.Router();
const { getReportsSummary } = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReportsSummary);

module.exports = router;