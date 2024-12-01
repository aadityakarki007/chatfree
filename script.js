const socket = io();  // Establish connection to the server

// DOM elements
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messages = document.getElementById('messages');

// Show the chat container after login
loginButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('new user', username);  // Send the username to the server
    loginContainer.style.display = 'none';  // Hide login form
    chatContainer.style.display = 'flex';  // Show chat container
  }
});

// Send message when button is clicked
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    socket.emit('chat message', message);  // Emit message to server
    messageInput.value = '';  // Clear input field
  }
});

// Listen for incoming messages
socket.on('chat message', (msg) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('username');
  usernameElement.textContent = msg.username;  // Display the sender's name

  const messageTextElement = document.createElement('span');
  messageTextElement.classList.add('text');
  messageTextElement.textContent = msg.text;  // Display the message text

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(messageTextElement);

  // Add class for sent/received messages
  if (msg.username === socket.id) {
    messageElement.classList.add('sent');
  } else {
    messageElement.classList.add('received');
  }

  messages.appendChild(messageElement);  // Display message in chat window
  messages.scrollTop = messages.scrollHeight;  // Scroll to bottom
});
