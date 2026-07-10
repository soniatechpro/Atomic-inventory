require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // Native Node.js HTTP module
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

app.use('/api/health', healthRouter);
// Test endpoint directly inline
app.post('/api/inventory/purchase-test', (req, res) => {
    res.json({ message: "Direct server logic hit working perfectly!" });
});
app.use('/api/inventory', inventoryRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// 🚀 CRITICAL: We now run server.listen instead of app.listen to support standard sockets
server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Real-Time Engine Active & Online!`);
    console.log(`📡 WebSocket ready at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});