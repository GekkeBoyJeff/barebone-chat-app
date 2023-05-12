const socket = io();
const messages = document.querySelector('.active-chat ul');
const input = document.querySelector('section.active-chat form input');
const userWelcome = document.querySelector('h2.yourName');
const activeRoomName = document.querySelector('section.active-chat header h2');

const usernameDialog = document.getElementById('usernameDialog');
const usernameForm = document.getElementById('usernameForm');
const usernameInput = document.getElementById('usernameInput');
let username;

const rooms = document.querySelector('aside ul');
const newRoomButton = document.querySelector('.newChat');

const roomDialog = document.getElementById('roomDialog');
const roomForm = document.getElementById('roomForm');
const roomInput = document.getElementById('roomInput');

checkLocalStorage();

socket.on('connect', () => {
    console.log('client socket.id', socket.id);
    // Toon het dialoogvenster
    if(!username){
      usernameDialog.showModal(username);
    }
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
// newRoomButton.addEventListener('click', () => {
//     const roomName = prompt('Wat is de naam van de nieuwe kamer?');
//     if (roomName) {
//       joinRoom(roomName);
//     }
//   });
  
  function joinRoom(roomName, welcomeMessage = false) {
    socket.emit('joinRoom', { room: roomName, welcomeMessage, user: username });
    const li = document.createElement('li');
    li.textContent = roomName;
    rooms.appendChild(li);
  
    activeRoomName.textContent = roomName;

    localStorage.setItem('currentRoom', roomName);
  
    document.querySelector('section.active-chat').classList.remove('hide');
    document.querySelector('aside').classList.remove('show');
  }
  
  usernameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    username = usernameInput.value || 'Anoniem';
    userWelcome.textContent = username;
    usernameDialog.close();
  
    // Call joinRoom after username has been set
    joinRoom('Algemene Chat', true);

    // Stuur het setUsername event naar de server
    socket.emit('setUsername', username);
  });
  
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
    document.querySelector('section.active-chat').classList.add('hide');
    document.querySelector('aside').classList.add('show');
});

// Luister naar het verzenden van het formulier en sla de gebruikersnaam op
usernameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    username = usernameInput.value || 'Anoniem';
    userWelcome.textContent = username;
    usernameDialog.close();
    hideChat();

    // Sla de gebruikersnaam op in Local Storage
    localStorage.setItem('username', username);
});

// Check of de gebruikersnaam al in Local Storage staat
function checkLocalStorage(){
  console.log('start')
  if(localStorage.getItem('username')){
      username = localStorage.getItem('username');
      userWelcome.textContent = username;
      socket.emit('getRoomList'); // Vraag de lijst met kamers op vanuit de server
      usernameDialog.close();
      console.log('username', username) 

      // Stuur het setUsername event naar de server
      socket.emit('setUsername', username);


      // Haal de huidige kamer op uit de local storage, als deze bestaat
      let currentRoom = localStorage.getItem('currentRoom');
      if (currentRoom) {
          joinRoom(currentRoom, true);
      } else {
          // Anders, ga naar de Algemene Chat
          // joinRoom('Algemene Chat', true);
          console.log('geen kamer')
      }
  }
}

document.querySelector('.card button').addEventListener('click', () => {
    // Verwijder de gebruikersnaam uit Local Storage
    localStorage.removeItem('username');
    // Verwijder ook de huidige kamer uit Local Storage
    localStorage.removeItem('currentRoom');
    // Toon het dialoogvenster
    usernameDialog.showModal();
});

function hideChat(){
    document.querySelector('section.active-chat').classList.add('hide');
    document.querySelector('aside').classList.add('show');
}

newRoomButton.addEventListener('click', () => {
  roomDialog.showModal();
});

document.querySelector('.cancel-creation').addEventListener('click', () => {
  roomDialog.close();
});

roomForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const roomName = roomInput.value;
  if (roomName) {
    joinRoom(roomName);
    roomInput.value = '';
    roomDialog.close();
  }
});