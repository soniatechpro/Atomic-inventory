require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Native Node.js HTTP module
const path = require('path'); // Static path resolve karne ke liye
const { initDatabase } = require('./database/db.js');
const { initSocket } = require('./socket/socket.js'); // Import socket bootstrapper

const healthRouter = require('./routes/health.routes.js');
const inventoryRouter = require('./routes/inventory.routes.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Create an explicit HTTP Server instance wrapping around our Express app instance
const server = http.createServer(app);

// Initialize our database engine
initDatabase();

// Initialize our WebSocket/Socket.io service hooked onto our HTTP Server structure
initSocket(server);

app.use(cors());
app.use(express.json());

// ==========================================
// 📡 API ENDPOINTS
// ==========================================
app.use('/api/health', healthRouter);

// 👉 IMPORTANT: Isko GET kar diya hai taaki browser se directly hit ho sake
app.get('/api/inventory/purchase-test', (req, res) => {
    const { db } = require('./database/db.js');
    // Live database mein stock 50 update karega
    db.prepare('UPDATE inventory SET stock = 50 WHERE id = 1').run();
    
    // Naya data fetch karke screen par dikhayega confirm karne ke liye
    const updatedItem = db.prepare('SELECT * FROM inventory WHERE id = 1').get();
    res.json({ 
        message: "Live stock updated to 50 successfully!", 
        current_db_state: updatedItem 
    });
});

app.use('/api/inventory', inventoryRouter);

// ==========================================
// 🌐 FRONTEND STATIC SERVING (For Production)
// ==========================================
// Render par hamari root directory 'backend' hai, isliye '../frontend/dist' perfectly link hoga
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Express v5 / path-to-regexp v8 crash fix regex wildcard route
app.get(/.*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ==========================================
// 🚀 SERVER BOOTSTRAP
// ==========================================
server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Real-Time Engine Active & Online!`);
    console.log(`📡 WebSocket ready at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});