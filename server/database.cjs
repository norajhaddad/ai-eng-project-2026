
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(
  path.join(__dirname, 'parties.db')
);

db.exec(`
  CREATE TABLE IF NOT EXISTS parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    member_ids TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('SQLite database ready!');

module.exports = db;
