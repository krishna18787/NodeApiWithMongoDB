const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'email is required' });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({ error: 'role is required' });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: 'password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: 'user already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      role: role.trim().toLowerCase(),
      password: hashedPassword,
    });
    const token = signToken(user);

    res.status(201).json({
      message: 'user registered successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'email is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'password is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'invalid email or password' });
    }

    const token = signToken(user);

    res.json({
      message: 'login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function me(req, res) {
  res.json({
    user: sanitizeUser(req.user),
  });
}

module.exports = {
  login,
  me,
  register,
};
