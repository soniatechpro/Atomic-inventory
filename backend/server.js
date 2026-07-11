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
app.post('/api/inventory/purchase-test', (req, res) => {
    res.json({ message: "Direct server logic hit working perfectly!" });
});
app.use('/api/inventory', inventoryRouter);

// ==========================================
// 🌐 FRONTEND STATIC SERVING (For Production)
// ==========================================
// Render par hamari root directory 'backend' hai, isliye '../frontend/dist' perfectly link hoga
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// // Koi bhi generic non-API web route hit ho, toh React ki main index.html file serve karna
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });
// ISKO LAGAIYE (New Express v5/path-to-regexp rule)  
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