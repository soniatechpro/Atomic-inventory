const { Server } = require('socket.io');

// We hold a reference to our IO instance globally within this file scope
let ioInstance = null;

/**
 * Initializes the Socket.io server instance attached to our HTTP server setup.
 */
const initSocket = (httpServer) => {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: "*", // Allows connections from any frontend origin during development
            methods: ["GET", "POST"]
        }
    });

    // Event listener for when a client browser establishes a websocket pipeline
    ioInstance.on('connection', (socket) => {
        console.log(`🔌 Client connected to real-time sync: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return ioInstance;
};

/**
 * Broadcasts an updated item stock payload to ALL connected websocket clients instantly.
 */
const broadcastStock = (itemData) => {
    if (!ioInstance) {
        console.warn("⚠️ Warning: Socket.io engine has not been initialized yet!");
        return;
    }
    
    // ioInstance.emit broadcasts to every connected socket on the channel 'stock_updated'
    ioInstance.emit('stock_updated', itemData);
    console.log(`📢 Broadcasted updated stock status for item ID ${itemData.id} (New Stock: ${itemData.stock})`);
};

module.exports = {
    initSocket,
    broadcastStock
};