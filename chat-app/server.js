const WebSocket = require('websocket').server;
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running');
});

const wsServer = new WebSocket({
  httpServer: server,
  autoAcceptConnections: false,
});

wsServer.on('request', (req) => {
  const connection = req.accept(null, req.origin);
  console.log('WebSocket connection accepted');

  connection.on('message', (message) => {
    console.log("Printing from server",message)
    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      if (data.type === 'chat') {
        // Broadcast message to all connected clients
        wsServer.connections.forEach((client) => {
          if (client !== connection && client.connected) {
            client.send(JSON.stringify(data));
          }
        });
      }
    }
  });

  connection.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
