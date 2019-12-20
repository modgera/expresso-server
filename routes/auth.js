const express = require('express');
const router = express.Router();
const { login, registration } = require('../controllers/auth');

router.post('/registration', registration);
router.post('/login', login);

module.exports = router;
