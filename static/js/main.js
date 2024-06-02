
const socket = io()

socket.on('message', (msg) => {
    let msgElement = document.createElement('li')
    msgElement.className = 'list-group-item'
    msgElement.innerHTML = msg
    let messages = document.getElementById('messages')
    messages.append(msgElement)
});

socket.on('error', function(msg) {
    alert(msg);
});

socket.on('initial_messages', (messages) => {
    let messageList = document.getElementById('messages')
    messageList.innerHTML = '';
    messages.forEach( msg => {
        let msgElement = document.createElement('li')
        msgElement.className = 'list-group-item'
        msgElement.innerHTML = msg
        messageList.append(msgElement)
    })
});


let currentRoom = null;
let loggedInUser = null;

socket.on('room_updated', function(rooms) {
    let roomsList = document.getElementById('chat_rooms');
    roomsList.innerHTML = '';
    rooms.forEach(function(room) {
        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.appendChild(document.createTextNode(room));
        roomsList.appendChild(li);
    })
});

socket.on('room_created', function(room) {
    let roomsList = document.getElementById('chat_rooms');
    let li = document.createElement('li');
    li.className = 'list-group-item';
    li.appendChild(document.createTextNode(room));
    roomsList.appendChild(li);
});

socket.on('room_deleted', function(room) {
    let roomsList = document.getElementById('chat_rooms');
    let items = roomsList.getElementsByTagName('li');
    for (let i = 0; i < items.length; ++i) {
        if (items[i].textContent === room) {
            roomsList.removeChild(items[i]);
            break;
        }
    }
});

function createRoom() {
    let username = document.getElementById('username').value;
    let room = document.getElementById('room').value;
    if (username && room) {
        socket.emit('create_room', {username: username, room: room});
        currentRoom = room;
    } else {
        alert('Enter the required information first.');
    }
};

function joinRoom() {
    let username = document.getElementById('username').value;
    let room = document.getElementById('join-room').value;
    if (username && room) {
        socket.emit('join', {username: username, room: room});
        currentRoom = room;
    } else {
        alert('Enter your information and select a room to join first!');
    }
};

function sendMessage() {
    let message = document.getElementById('message').value;
    let username = document.getElementById('username').value;
    if (message && username && room) {
        socket.emit('message', {username: username, room: currentRoom, message: message});
        document.getElementById('message').value = '';
    } else {
        alert('you aren\'t in a room dumb dumb...');
    }
};
