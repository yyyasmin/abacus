const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let abacusState = new Array(10).fill(null).map(() => new Array(10).fill(false));

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        abacusState = JSON.parse(message);
        console.log("Abacus State Updated: ", abacusState); // Log data changes

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(abacusState));
            }
        });
    });

    ws.send(JSON.stringify(abacusState)); // Send current state to new client
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
