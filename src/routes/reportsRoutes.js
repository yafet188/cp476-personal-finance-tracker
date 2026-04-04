const express = require('express');
const router = express.Router();
const { getReportsSummary } = require('../controllers/reportsController');

router.get('/', getReportsSummary);

module.exports = router;