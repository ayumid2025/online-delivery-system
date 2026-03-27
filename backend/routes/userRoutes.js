const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password_hash: hash, role });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
