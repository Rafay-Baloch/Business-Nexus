const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // HTTP core module
const { Server } = require('socket.io'); // Socket.io server package
require('dotenv').config();

const app = express();

// Create HTTP server wrapping express app
const server = http.createServer(app);

// Initialize Socket.io with CORS settings matching frontend port
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Bypass setup)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Nexus MongoDB Connected successfully!'))
  .catch(err => {
    console.log('Database connection bypassed. Local server dashboard ready!');
  });

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
// Test Route
app.get('/', (req, res) => {
  res.send('Nexus Backend Server with WebRTC Signaling is Running!');
});

// -------------------------------------------------------------
// WEBRTC SIGNALING SERVER LOGIC (Socket.io)
// -------------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`🚀 New user connected to video server: ${socket.id}`);

  // 1. Join Room Handler
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`👤 User [${userId}] joined call room: [${roomId}]`);
    
    // Broadcast warning/alert to other members that a new user has joined
    socket.to(roomId).emit('user-connected', userId);
  });

  // 2. Sending WebRTC Offer
  socket.on('sending-video-offer', (data) => {
    // data contains: { roomId, offer }
    socket.to(data.roomId).emit('video-offer-received', data.offer);
  });

  // 3. Sending WebRTC Answer
  socket.on('sending-video-answer', (data) => {
    // data contains: { roomId, answer }
    socket.to(data.roomId).emit('video-answer-received', data.answer);
  });

  // 4. ICE Candidates sharing (Network connection paths)
  socket.on('sending-ice-candidate', (data) => {
    // data contains: { roomId, candidate }
    socket.to(data.roomId).emit('ice-candidate-received', data.candidate);
  });

  // 5. Disconnect Handler
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected from video server: ${socket.id}`);
  });
});
// -------------------------------------------------------------

const PORT = process.env.PORT || 5000;
// CRITICAL: Change app.listen to server.listen so socket works!
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});