const { db } = require('../database/db.js');

/**
 * Retrieves the current stock status of an item.
 */
const getItemById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, item_name, stock, price FROM inventory WHERE id = ?', [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

/**
 * Executes an atomic stock deduction.
 * Returns true if successful, false if stock was insufficient.
 */
const purchaseItemAtomic = (id) => {
    return new Promise((resolve, reject) => {
        // The core atomic update query containing our strict conditional gate
        const query = `
            UPDATE inventory 
            SET stock = stock - 1 
            WHERE id = ? AND stock > 0
        `;

        // run() returns information about the executed mutation via 'this'
        db.run(query, [id], function (err) {
            if (err) return reject(err);

            // 'this.changes' tells us exactly how many rows matched and were altered.
            // If it is 0, it means the item does not exist or stock was already 0!
            if (this.changes === 0) {
                resolve(false); 
            } else {
                resolve(true); // Stock successfully reduced by 1
            }
        });
    });
};

module.exports = {
    getItemById,
    purchaseItemAtomic
};