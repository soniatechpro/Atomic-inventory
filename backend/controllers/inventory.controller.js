const { db } = require('../database/db.js');

const getInventoryStatus = (req, res) => {
    try {
        const item = db.prepare('SELECT * FROM inventory WHERE id = 1').get();
        if (!item) {
            return res.status(404).json({ message: 'Resource pool not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const processPurchase = (req, res) => {
    // Direct operational transaction closure block using better-sqlite3 transactions
    const executeTransaction = db.transaction(() => {
        const item = db.prepare('SELECT * FROM inventory WHERE id = 1').get();
        
        if (!item || item.stock <= 0) {
            throw new Error('Atomic zero reached. Transaction halted.');
        }

        db.prepare('UPDATE inventory SET stock = stock - 1 WHERE id = 1').run();
        
        const updatedItem = db.prepare('SELECT * FROM inventory WHERE id = 1').get();
        return updatedItem;
    });

    try {
        const updatedItem = executeTransaction();
        
        // Emit global state via WebSockets
        const io = req.app.get('socketio');
        if (io) {
            io.emit('stock_updated', updatedItem);
        }

        res.status(200).json({ message: 'Secured purchase sequence cleared', item: updatedItem });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getInventoryStatus, processPurchase };