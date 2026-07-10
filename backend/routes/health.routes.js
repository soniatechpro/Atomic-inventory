const express = require('express');
const router = express.Router();

// Define a GET endpoint at the root of this router
router.get('/', (req, res) => {
    // Return a structured JSON response indicating the server is operational
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime() // Tells us how many seconds the server has been running
    });
});

module.exports = router;