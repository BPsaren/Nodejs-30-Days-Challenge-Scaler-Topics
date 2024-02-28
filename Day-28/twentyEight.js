import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const server = http.createServer(app);

// Move the CORS middleware setup after app initialization
const corsOptions = {
    origin: 'http://localhost:5500',
    methods: "GET,POST,PATCH,DELETE,HEAD",
    credential: true,
};
app.use(cors(corsOptions)); // Enable CORS for all routes

function setupWebSocketServer(server) {
    const wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocketServer.OPEN) {
                    client.send(message);
                    console.log(`Sent message to another client: ${message}`);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.send('Welcome to the collaborative editing tool!');
        console.log('Sent welcome message to the client');
    });
}

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

setupWebSocketServer(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});