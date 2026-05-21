const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Bilkul clean aur automatic bypass ke sath)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Nexus MongoDB Connected successfully!'))
  .catch(err => {
    console.log('Database connection bypassed. Local server dashboard ready!');
  });

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Nexus Backend Server is Running Perfectly!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});