const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Hash password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });

        // 3. Insert into database
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hash], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(401).json({ message: 'User not found' });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error checking password' });
            if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        });
    });
};
module.exports = { registerUser, loginUser };