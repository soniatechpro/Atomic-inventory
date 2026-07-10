const express = require('express');
const router = express.Router();

// Controller ko import kar rahe hain
const inventoryController = require('../controllers/inventory.controller.js');

// 1. Status Check (GET request)
router.get('/status', inventoryController.getStatus);

// 2. Real Purchase (POST request)
router.post('/purchase', inventoryController.purchase);

module.exports = router;