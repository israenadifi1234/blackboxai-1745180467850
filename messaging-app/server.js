const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    console.log(`${username} joined the chat`);
    socket.broadcast.emit('user joined', username);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { username: socket.username, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.username);
    if (socket.username) {
      socket.broadcast.emit('user left', socket.username);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
