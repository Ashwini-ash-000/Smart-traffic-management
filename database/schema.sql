CREATE TABLE traffic_data (
  id SERIAL PRIMARY KEY,
  location TEXT,
  congestion_level INT,
  incident TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
