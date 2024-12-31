const express = require('express');
const router = express.Router();
const { analyzeRelease } = require('../controllers/qaController.js');

router.post('/analyze', analyzeRelease);

module.exports = router; 