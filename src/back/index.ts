import { WebSocketServer } from 'ws';

const createServer = (port: number) => {
  const server = new WebSocketServer({ port }, () => {
    console.log(`Start WebSocket server on the ${port} port!`);
  });

  server.on('connection', (socket) => {
    console.log(
      `A new client connected. Active connections ${server.clients.size}`,
    );

    socket.on('message', (data: string) => {
      console.log(`A new message received. Data: ${data}`);
    });

    socket.on('close', () => {
      console.log('Client disconnected.');
    });
  });
};

export default createServer;
