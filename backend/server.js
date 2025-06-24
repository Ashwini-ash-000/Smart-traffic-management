const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads folder if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// PostgreSQL connection pool
const pool = new Pool({
  user: 'smart_traffic_user',
  host: 'dpg-d1d7spbe5dus73b3e0v0-a.oregon-postgres.render.com',
  database: 'smart_traffic',
  password: 'f3tEFy4au4ObpztFOejZqmtsGvLyqaJg',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Routes
app.get('/', (req, res) => {
  res.send('Smart Traffic Backend API is running.');
});

// GET traffic data
app.get('/api/traffic', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM traffic_data ORDER BY timestamp DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching traffic data:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST traffic data
app.post('/api/traffic', async (req, res) => {
  const { location, congestion_level, incident } = req.body;
  try {
    await pool.query(
      'INSERT INTO traffic_data (location, congestion_level, incident, timestamp) VALUES ($1, $2, $3, NOW())',
      [location, congestion_level, incident]
    );
    res.status(200).json({ message: 'Traffic data added successfully.' });
  } catch (err) {
    console.error('Error adding traffic data:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET citizen reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citizen_reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST citizen report with photo
app.post('/api/reports', upload.single('photo'), async (req, res) => {
  const { report_type, location } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await pool.query(
      'INSERT INTO citizen_reports (report_type, location, photo_url, status, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [report_type, location, filePath, 'Pending']
    );
    res.status(200).json({ message: 'Report submitted successfully.' });
  } catch (err) {
    console.error('Error submitting report:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
