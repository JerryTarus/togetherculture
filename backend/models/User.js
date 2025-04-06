
const db = require('../db/database');
const bcrypt = require('bcrypt');

// Create new user with auto-approval for admin accounts.
// For members, membershipType and interests are saved.
exports.createUser = async (name, email, password, role = 'member', membershipType = null, interests = {}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  // Auto-approve admin accounts; members remain pending.
  const isApproved = role === 'admin' ? 1 : 0;
  const { caring = 0, sharing = 0, creating = 0, experiencing = 0, working = 0 } = interests;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (name, email, password, role, isApproved, membershipType, caring, sharing, creating, experiencing, working)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, isApproved, membershipType, caring, sharing, creating, experiencing, working],
      function (err) {
        if (err) reject(err);
        else resolve({
          id: this.lastID,
          name,
          email,
          role,
          isApproved,
          membershipType,
          caring,
          sharing,
          creating,
          experiencing,
          working
        });
      }
    );
  });
};

// Find user by email.
exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Get user by ID.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Update user profile.
exports.updateUserProfile = (id, name, membershipType, interests) => {
  const { caring = 0, sharing = 0, creating = 0, experiencing = 0, working = 0 } = interests;
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET name = ?, membershipType = ?, caring = ?, sharing = ?, creating = ?, experiencing = ?, working = ? WHERE id = ?`,
      [name, membershipType, caring, sharing, creating, experiencing, working, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      }
    );
  });
};

// Approve user.
exports.approveUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET isApproved = 1 WHERE id = ?`, [userId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

// Unapprove user.
exports.unapproveUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET isApproved = 0 WHERE id = ?`, [userId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

// Get all pending users.
exports.getPendingUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM users WHERE isApproved = 0`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Count the number of admin users.
exports.getAdminCount = () => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS count FROM users WHERE role = 'admin'`, (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
};

// Delete a user.
exports.deleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM users WHERE id = ?`, [userId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

// Update a user's role.
exports.updateUserRole = (userId, newRole) => {
  const isApproved = newRole === 'admin' ? 1 : 0;
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET role = ?, isApproved = ? WHERE id = ?`, [newRole, isApproved, userId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};
