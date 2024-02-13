const express = require('express');
const http = require('http');
const setupWebSocket = require('./setupWebSocket');

const app = express();
const server = http.createServer(app);

// Serve HTML page with JavaScript for WebSocket connection
app.get('/websocket', (req, res) => {
  res.sendFile(__dirname + '/websocket.html');
});

// Setup WebSocket server
setupWebSocket(server);

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
