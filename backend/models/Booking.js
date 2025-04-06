
const db = require('../db/database');

// Book a module.
exports.bookModule = (userId, moduleId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO bookings (userId, moduleId) VALUES (?, ?)`,
      [userId, moduleId],
      function (err) {
        if (err) reject(err);
        else resolve({ bookingId: this.lastID, userId, moduleId });
      }
    );
  });
};

// Get bookings for a user.
exports.getBookingsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT b.id AS booking_id, m.title, m.description
       FROM bookings b
       JOIN modules m ON b.moduleId = m.id
       WHERE b.userId = ?`,
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
