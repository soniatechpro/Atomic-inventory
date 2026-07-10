const inventoryService = require('../services/inventory.service.js');
const { broadcastStock } = require('../socket/socket.js');

const getStatus = async (req, res) => {
    try {
        const item = await inventoryService.getItemById(1);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: 'Database fetch error: ' + error.message });
    }
};

const purchase = async (req, res) => {
    try {
        const itemId = 1;
        const success = await inventoryService.purchaseItemAtomic(itemId);
        
        if (!success) {
            return res.status(400).json({ 
                success: false, 
                message: 'Transaction failed. Item is completely out of stock!' 
            });
        }

        const updatedItem = await inventoryService.getItemById(itemId);
        
        // Socket broadcast if running
        try {
            broadcastStock(updatedItem);
        } catch (sErr) {
            console.log("Socket broadcast skipped, frontend not connected yet.");
        }

        res.status(200).json({
            success: true,
            message: 'Purchase completed successfully!',
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({ error: 'Transaction processing error: ' + error.message });
    }
};

// CRITICAL: Make sure both functions are exported cleanly!
module.exports = {
    getStatus,
    purchase
};