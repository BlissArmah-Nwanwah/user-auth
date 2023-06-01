const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Send a message to the server
  ws.send('Hello, server!');
});

ws.on('message', (data) => {
  console.log('Received message from server:', data);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});
