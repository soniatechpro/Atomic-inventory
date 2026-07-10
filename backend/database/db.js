const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path where our SQLite database file will live
const DB_PATH = path.join(__dirname, 'inventory.db');

// Initialize the database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Failed to connect to the SQLite database:', err.message);
    } else {
        console.log('📦 Connected to the SQLite database file.');
    }
});

/**
 * Boots up the database layout sequentially.
 * Creates tables and inserts initial stock if empty.
 */
const initDatabase = () => {
    // db.serialize ensures that SQL commands run one after another in order
    db.serialize(() => {
        // 1. Create the inventory table if it doesn't exist yet
        db.run(`
            CREATE TABLE IF NOT EXISTS inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_name TEXT NOT NULL UNIQUE,
                stock INTEGER NOT NULL CHECK(stock >= 0),
                price REAL NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('❌ Error creating inventory table:', err.message);
                return;
            }
            console.log('📋 Inventory table verified/created.');
            
            // 2. Check if we already have records to avoid duplicate seeding
            db.get('SELECT COUNT(*) as count FROM inventory', [], (err, row) => {
                if (err) {
                    console.error('❌ Error checking database count:', err.message);
                    return;
                }

                // If the table is empty, seed it with an item
                if (row.count === 0) {
                    const insertStmt = db.prepare(`
                        INSERT INTO inventory (item_name, stock, price) VALUES (?, ?, ?)
                    `);
                    
                    // Let's stock up a highly sought-after item with exactly 10 units
                    insertStmt.run('Quantum Processor Core', 10, 299.99);
                    insertStmt.finalize();
                    
                    console.log('🌱 Database seeded with initial inventory stock.');
                } else {
                    console.log('🚀 Database already contains records. Skipping seeding.');
                }
            });
        });
    });
};

module.exports = {
    db,
    initDatabase
};