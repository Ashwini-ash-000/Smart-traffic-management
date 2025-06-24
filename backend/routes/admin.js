const express = require('express');
const router = express.Router();
const pool = require('../db'); // Make sure db.js exports the pool
const bcrypt = require('bcrypt');

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = result.rows[0];

    // NOTE: plaintext for now
    const passwordMatch = password === admin.password;

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', adminId: admin.id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
