// ---- Imports & config ----
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

// ---- App setup ----
const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json()); // parse JSON body
app.use(express.static(path.join(__dirname, 'public'))); // serve frontend assets

//captcha
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ---- API routes ----
const authRoutes = require('./routes/AuthRoutes');
app.use('/api', authRoutes);

// ---- Frontend page routes ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});



// ---- Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   