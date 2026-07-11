const express = require('express');
const router = express.Router();
// Destructuring exactly matching the controller exports
const { getInventoryStatus, processPurchase } = require('../controllers/inventory.controller.js');

// Verify that the handlers are actual functions before passing to router to prevent crashes
if (typeof getInventoryStatus !== 'function' || typeof processPurchase !== 'function') {
    console.error('❌ CRITICAL CONFIGURATION ERROR: Inventory controller functions are not exported properly!');
}

// Map the endpoints cleanly
router.get('/status', getInventoryStatus);
router.post('/purchase', processPurchase);

module.exports = router;