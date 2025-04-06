// backend/db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'togetherCulture.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users table with extra fields for members.
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      isApproved INTEGER DEFAULT 0,
      membershipType TEXT,
      caring INTEGER DEFAULT 0,
      sharing INTEGER DEFAULT 0,
      creating INTEGER DEFAULT 0,
      experiencing INTEGER DEFAULT 0,
      working INTEGER DEFAULT 0
    )
  `);

  // Modules table.
  db.run(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      createdBy INTEGER,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Bookings table.
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      moduleId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (moduleId) REFERENCES modules(id)
    )
  `);
});


module.exports = db;
