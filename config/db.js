// ---- Database setup (MySQL connection pool) ----
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to reuse connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify the database connection at startup (non-blocking)
pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL');
    conn.release();
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });

module.exports = pool;
