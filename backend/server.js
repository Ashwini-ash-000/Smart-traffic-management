const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'smart_traffic_user',
  host: 'dpg-d1d7spbe5dus73b3e0v0-a.oregon-postgres.render.com',
  database: 'smart_traffic',
  password: 'f3tEFy4au4ObpztFOejZqmtsGvLyqaJg',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Smart Traffic Backend API is running.');
});

// GET: Fetch recent traffic data
app.get('/api/traffic', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM traffic_data ORDER BY timestamp DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching traffic data:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST: Insert new traffic data
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

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
