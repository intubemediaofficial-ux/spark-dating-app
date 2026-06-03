require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const swipeRoutes = require('./routes/swipe');
const chatRoutes = require('./routes/chat');
const safetyRoutes = require('./routes/safety');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} is online`);
  });

  // Send message via socket
  socket.on('sendMessage', async (data) => {
    const { matchId, content, senderId, receiverId } = data;

    // Save message to database
    const prisma = require('./config/database');
    try {
      const message = await prisma.message.create({
        data: {
          matchId,
          senderId,
          content,
          type: 'TEXT',
        },
        include: {
          sender: {
            select: { id: true, name: true, photos: true },
          },
        },
      });

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', message);
      }

      // Confirm to sender
      socket.emit('messageSent', message);
    } catch (error) {
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Notify match
  socket.on('newMatch', (data) => {
    const { matchedUserId } = data;
    const matchedSocketId = onlineUsers.get(matchedUserId);
    if (matchedSocketId) {
      io.to(matchedSocketId).emit('matchNotification', data);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiverId, matchId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', { matchId, userId: socket.userId });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Spark Dating API running on port ${PORT}`);
});

module.exports = { app, server, io };
