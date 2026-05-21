const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['Investor', 'Entrepreneur'] // Sirf yeh do roles allowed hain
  },
  // Profile Extended Information (Week 1 Milestone 2 ke liye required)
  bio: { 
    type: String, 
    default: "" 
  },
  history: { 
    type: String, 
    default: "" // Startup history ya Investment history
  },
  preferences: { 
    type: String, 
    default: "" // Industries of interest (e.g., Tech, FinTech)
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);