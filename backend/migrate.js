
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'db', 'togetherCulture.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Drop tables if they exist.
  db.run(`DROP TABLE IF EXISTS bookings`);
  db.run(`DROP TABLE IF EXISTS modules`);
  db.run(`DROP TABLE IF EXISTS users`);

  // Re-create the users table with updated schema.
  db.run(`
    CREATE TABLE users (
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

  // Re-create the modules table.
  db.run(`
    CREATE TABLE modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      createdBy INTEGER,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    )
  `);

  // Re-create the bookings table.
  db.run(`
    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      moduleId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (moduleId) REFERENCES modules(id)
    )
  `);
});

db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database migration complete.');
  }
});
