const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.14.96:4000');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Send a message to the server
  ws.send('Hello, server!');
});

ws.on('message', (data) => {
  console.log('Received message from server:', data);
});



ws.on('error', (error) => {
    console.log('Error to WebSocket server', error);
    
    // Send a message to the server
    // ws.send('Hello, server!');
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});