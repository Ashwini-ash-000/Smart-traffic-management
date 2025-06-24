// routes/reports.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

// PostgreSQL pool
const pool = new Pool({
  user: 'smart_traffic_user',
  host: 'dpg-d1d7spbe5dus73b3e0v0-a.oregon-postgres.render.com',
  database: 'smart_traffic',
  password: 'f3tEFy4au4ObpztFOejZqmtsGvLyqaJg',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// GET all citizen reports
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citizen_reports ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST a new citizen report with image
router.post('/', upload.single('photo'), async (req, res) => {
  const { report_type, location } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await pool.query(
      'INSERT INTO citizen_reports (report_type, location, photo_url, status, timestamp) VALUES ($1, $2, $3, $4, NOW())',
      [report_type, location, filePath, 'Pending']
    );
    res.status(200).json({ message: 'Report submitted successfully.' });
  } catch (err) {
    console.error('Error submitting report:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;