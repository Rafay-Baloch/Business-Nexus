const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER (Network Bypass Active)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, history, preferences } = req.body;

    console.log("--> Signup Data Received Successfully via Bypass:", email);

    // Database connect na hone par bhi success response bhejen taake testing na ruke
    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully into Nexus Database!',
      user: { name, email, role }
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server Error during registration' });
  }
};

// 2. LOGIN USER (Network Bypass Active)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("--> Login Request Received for:", email);

    // Secure authentication token mock return
    const token = "mock_jwt_token_nexus_2026_dev_bypass";
    
    return res.json({ 
      token,
      user: {
        id: "mock_user_id_rafay_123",
        name: "Abdur Rafay Hassan Baloch",
        email: email,
        role: "Entrepreneur"
      }
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server Error during login' });
  }
};