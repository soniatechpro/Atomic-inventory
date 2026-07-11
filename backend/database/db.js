const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'inventory.db');
const db = new Database(dbPath);

function initDatabase() {
    // Enable WAL mode for high concurrency applications
    db.pragma('journal_mode = WAL');

    db.prepare(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            stock INTEGER NOT NULL,
            price REAL NOT NULL
        )
    `).run();

    // Check if initialization data exists
    const row = db.prepare('SELECT COUNT(*) as count FROM inventory').get();
    
    if (row.count === 0) {
        db.prepare(`
            INSERT INTO inventory (item_name, stock, price) 
            VALUES ('Quantum CPU Core v4', 10, 299.99)
        `).run();
        console.log('📦 Database seeded successfully with core resources!');
    }
}

module.exports = { db, initDatabase };