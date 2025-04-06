
const db = require('../db/database');

// Create a new module.
exports.createModule = (title, description, createdBy) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO modules (title, description, createdBy) VALUES (?, ?, ?)`,
      [title, description, createdBy],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, title, description, createdBy });
      }
    );
  });
};

// Get all modules.
exports.getAllModules = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM modules`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get module by ID (if needed).
exports.getModuleById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM modules WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
