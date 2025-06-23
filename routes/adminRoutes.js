// routes/adminRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Activity = require('../models/Activity');
const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET } = require('../config/admin');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN_USERNAME) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/activity', authMiddleware, async (req, res) => {
  const data = await Activity.find().sort({ timestamp: -1 });
  res.json(data);
});

module.exports = router;
