import { io } from 'socket.io-client';

// If running locally, hit port 5000. If deployed on server, look at current browser address!
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : window.location.origin;

export const fetchCurrentStatus = async () => {
    const response = await fetch(`${BACKEND_URL}/api/inventory/status`);
    if (!response.ok) {
        throw new Error('Failed to fetch initial inventory status from server');
    }
    return response.json();
};

export const executePurchase = async () => {
    const response = await fetch(`${BACKEND_URL}/api/inventory/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Transaction failed in processing engine');
    }
    return data;
};

export const connectSocketStream = (onStockUpdate) => {
    // Open a dynamic websocket connection to the evaluated server link
    const socket = io(BACKEND_URL);

    socket.on('stock_updated', (updatedItem) => {
        console.log('🔌 Real-time update received via socket:', updatedItem);
        onStockUpdate(updatedItem);
      });

    return () => {
        socket.disconnect();
        console.log('❌ Socket stream disconnected cleanly');
    };
};