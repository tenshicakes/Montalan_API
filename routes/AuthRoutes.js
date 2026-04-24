const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); // make sure path is correct

// Destructure functions from AuthController
const { registerUser, loginUser, getUsers, deleteUser, updateUser, getCaptcha } = AuthController;

// ---- Routes ----
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

// CAPTCHA endpoint
router.get('/captcha', getCaptcha);

module.exports = router;