const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON body

// serve static frontend files from public/
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/AuthRoutes');
app.use('/api', authRoutes);

// default route – load login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// convenient route to serve register page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   