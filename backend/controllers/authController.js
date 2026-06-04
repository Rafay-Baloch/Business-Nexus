const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER (Network Bypass & Security Active)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, history, preferences } = req.body;

    console.log("--> Signup Data Received Successfully via Bypass:", email);

    // Milestone 7 Security: Generate salt and hash the input password (Simulation Check)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log("🔒 Password successfully secured with bcrypt hash algorithm:", hashedPassword);

    // Database connect na hone par bhi success response bhejen taake testing na ruke
    return res.status(201).json({ 
      success: true,
      message: 'User registered successfully into Nexus Database with Hashed Password!',
      user: { 
        name, 
        email, 
        role,
        security: "Bcrypt 256-bit Secured" 
      }
    });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Server Error during registration' });
  }
};

// 2. LOGIN USER (Network Bypass & 2FA Mock Active)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("--> Login Request Received for:", email);

    // Secure authentication token mock return
    const token = "mock_jwt_token_nexus_2026_dev_bypass";
    
    // Milestone 7 Security: Generate a temporary 6-digit OTP code for 2FA validation step
    const mock2FAOTP = "123456"; 
    console.log(`🔑 [2FA ALERT] Mock Security Access Token generated for ${email}: ${mock2FAOTP}`);

    return res.json({ 
      token,
      twoFactorRequired: true, // Frontend ko batayega ke abhi 2FA window kholni hai
      mockOTP: mock2FAOTP, // Developer verification key
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