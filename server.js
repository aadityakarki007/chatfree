const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let users = {};  // Store users' names based on socket id

// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the username for the socket
  socket.on('new user', (username) => {
    users[socket.id] = username;  // Store the username using the socket id
    console.log(`${username} joined the chat`);
  });

  // Handle incoming chat messages
  socket.on('chat message', (msg) => {
    const username = users[socket.id];  // Get the username for the sender
    const message = { username, text: msg };  // Create an object with username and message text
    console.log('Message received:', message);
    io.emit('chat message', message);  // Broadcast the message to all clients
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username} disconnected`);
    delete users[socket.id];  // Remove the user from the list of users
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
