CREATE TABLE traffic_data (
  id SERIAL PRIMARY KEY,
  location TEXT,
  congestion_level INT,
  incident TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE citizen_reports (
  id SERIAL PRIMARY KEY,
  issue_type TEXT,
  location TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL -- Store hashed passwords in production
);
