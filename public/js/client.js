const socket = io();
const messages = document.querySelector('.active-chat ul');
const input = document.querySelector('section.active-chat form input');
const username = prompt('Wat is jouw naam?') || 'Anoniem';

socket.on('connect', () => {
    console.log('client socket.id', socket.id);
    socket.emit('message', {user: 'Server', text: `Welcome to the chat! ${username}`});
});

document.querySelector('section.active-chat form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        socket.emit('message', {user: username, text: input.value});
        input.value = '';
    }
});

socket.on('message', (message) => {
    const element = document.createElement('li');

    const user = document.createElement('address');
    user.textContent = message.user;
    user.classList.add('user');

    const text = document.createElement('p');
    text.textContent = message.text;
    text.classList.add('text');

    // append user and text to element
    element.appendChild(user);
    element.appendChild(text);

    if (message.user == username) {
        console.log(username)
        element.classList.add('eigen-bericht');
    }

    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
});