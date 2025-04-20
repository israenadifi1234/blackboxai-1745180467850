const socket = io();

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usersList = document.getElementById('users-list');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

let username = null;
let usersOnline = new Set();

function addMessage({ username: sender, message }) {
  const messageElem = document.createElement('div');
  messageElem.classList.add('p-2', 'rounded', sender === username ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left');
  messageElem.textContent = `${sender}: ${message}`;
  messages.appendChild(messageElem);
  messages.scrollTop = messages.scrollHeight;
}

function updateUsersList() {
  usersList.innerHTML = '';
  usersOnline.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    usersList.appendChild(li);
  });
}

loginBtn.addEventListener('click', () => {
  const enteredUsername = usernameInput.value.trim();
  if (enteredUsername) {
    username = enteredUsername;
    socket.emit('join', username);
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
  }
});

logoutBtn.addEventListener('click', () => {
  location.reload();
});

socket.on('user joined', (user) => {
  usersOnline.add(user);
  updateUsersList();
  addMessage({ username: 'System', message: `${user} joined the chat` });
});

socket.on('user left', (user) => {
  usersOnline.delete(user);
  updateUsersList();
  addMessage({ username: 'System', message: `${user} left the chat` });
});

socket.on('chat message', (data) => {
  addMessage(data);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit('chat message', msg);
    messageInput.value = '';
  }
});
