// ---- Dependencies ----
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateCaptcha = require('../utils/captcha');

// ---- Register a new user ----
const registerUser = async (req, res) => {
  const { name, email, password, captchaAnswer } = req.body;

  // ---- CAPTCHA check ----
  // Admin bypass allowed
  if (captchaAnswer !== 'bypass' && (!captchaAnswer || captchaAnswer != req.session.captchaAnswer)) {
    return res.status(400).json({ message: 'Invalid CAPTCHA' });
  }

  // clear the session CAPTCHA after one use
  req.session.captchaAnswer = null;

  // Basic input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash password before saving
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message || err });
  }
};

// ---- Authenticate existing user and issue JWT ----
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message || err });
  }
};

// ---- User management (dashboard API) ----
const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message || err });
  }
};

const deleteUser = async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message || err });
  }
};

const updateUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    await db.execute('UPDATE users SET email = ? WHERE id = ?', [email, req.params.id]);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message || err });
  }
};

// ---- CAPTCHA function ----
const getCaptcha = (req, res) => {
  const captcha = generateCaptcha();

  // store correct answer in session
  req.session.captchaAnswer = captcha.answer;

  res.json({ question: captcha.question });
};

module.exports = { registerUser, loginUser, getCaptcha, getUsers, deleteUser, updateUser };