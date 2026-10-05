const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const memoryStore = require('../data/memoryStore');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, bloodGroup, dateOfBirth, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    const existingUser = memoryStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const newUser = memoryStore.createUser({
      name,
      email,
      password, // in real mongo we hash
      role: role || 'patient',
      phone: phone || '',
      bloodGroup: bloodGroup || 'O+',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1995-01-01'),
      gender: gender || 'Male',
      allergies: [],
      chronicConditions: [],
      emergencyContact: { name: '', phone: '', relation: '' }
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to CareSetu.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bloodGroup: newUser.bloodGroup,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = memoryStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    // In demo environment, we check password or accept password123
    const isMatch = (password === user.password || password === 'password123');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        allergies: user.allergies,
        chronicConditions: user.chronicConditions,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Demo 1-Click Login
exports.demoLogin = async (req, res) => {
  try {
    const { role } = req.query; // 'patient' or 'doctor'
    const targetEmail = role === 'doctor' ? 'dr.gupta@caresetu.in' : 'rahul@caresetu.in';

    const user = memoryStore.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo profile not found.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Logged in as Demo ${user.role === 'doctor' ? 'Doctor' : 'Patient'}: ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        allergies: user.allergies,
        chronicConditions: user.chronicConditions,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
  }

  const user = memoryStore.findUserByEmail(email);
  if (!user) {
    // Return friendly generic response for security
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions and security PIN have been sent.'
    });
  }

  res.json({
    success: true,
    message: `A password reset link with verification OTP (839201) has been sent to ${email}.`,
    demoOtp: '839201'
  });
};

// Get Current User Profile
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updated = memoryStore.updateUser(req.user._id || req.user.id, req.body);
    res.json({
      success: true,
      message: 'Health profile updated successfully.',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Account & All Data (Privacy compliance)
exports.deleteAccount = async (req, res) => {
  try {
    memoryStore.deleteUser(req.user._id || req.user.id);
    res.json({
      success: true,
      message: 'Your account and all associated medical records have been permanently erased from CareSetu.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Demo Data
exports.resetDemoData = async (req, res) => {
  memoryStore.resetDemoData();
  res.json({
    success: true,
    message: 'CareSetu demo data has been reset to original state.'
  });
};
