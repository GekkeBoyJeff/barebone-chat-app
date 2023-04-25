const socket = io();
const messages = document.querySelector('.active-chat ul');
const input = document.querySelector('section.active-chat form input');
const username = prompt('Wat is jouw naam?') || 'Anoniem';
const userWelcome = document.querySelector('h2.yourName');
const activeRoomName = document.querySelector('section.active-chat header h2');

socket.on('connect', () => {
    console.log('client socket.id', socket.id);
    userWelcome.textContent = username;
    joinRoom('Algemene Chat', true);
  });

document.querySelector('section.active-chat form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
      const message = { user: username, text: input.value };
      socket.emit('message', message);
      input.value = '';
    }
  });

  socket.on('message', (message) => {
    displayMessage(message);
});

// rooms

const rooms = document.querySelector('aside ul');
const newRoomButton = document.querySelector('aside button');

newRoomButton.addEventListener('click', () => {
    const roomName = prompt('Wat is de naam van de nieuwe kamer?');
    if (roomName) {
      joinRoom(roomName);
    }
  });
  
  function joinRoom(roomName, welcomeMessage = false) {
    socket.emit('joinRoom', { room: roomName, welcomeMessage, user: username });
    const li = document.createElement('li');
    li.textContent = roomName;
    rooms.appendChild(li);

    activeRoomName.textContent = roomName;
  }  
  
  socket.on('loadMessages', (messages) => {
    document.querySelector('.active-chat ul').innerHTML = '';
    messages.forEach((message) => {
      displayMessage(message);
    });
  });

socket.on('roomList', (roomList) => {
    rooms.innerHTML = '';
    roomList.forEach((roomName) => {
      const li = document.createElement('li');
      li.textContent = roomName;
      li.addEventListener('click', () => {
        joinRoom(roomName);
      });
      rooms.appendChild(li);
      if(activeRoomName.textContent == roomName){
        li.classList.add('active');
      }
    });
  });  

  function displayMessage(message) {
    const element = document.createElement('li');
  
    const user = document.createElement('address');
    user.textContent = message.user;
    user.classList.add('user');
  
    const text = document.createElement('p');
    text.textContent = message.text;
    text.classList.add('text');
  
    element.appendChild(user);
    element.appendChild(text);
  
    if (message.user == username) {
      console.log(username)
      element.classList.add('eigen-bericht');
    }
  
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
  }

// close chat button
var closeChat = document.querySelector('section.active-chat header button.close-chat');
closeChat.addEventListener('click', () => {
    document.querySelector('section.active-chat').classList.remove('active');
});

