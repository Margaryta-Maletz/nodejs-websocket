import { WebSocketServer } from 'ws';

import { handleMessage } from './src/websocket';
import type { ErrorResponse, IncomingMessage } from './types/types';
import { logCommand } from './utils/logger';

const createServer = (port: number) => {
  const server = new WebSocketServer({ port }, () => {
    console.log(`Start WebSocket server on the ${port} port!`);
  });

  server.on('connection', (socket) => {
    console.log(
      `A new client connected. Active connections ${server.clients.size}`,
    );

    socket.on('message', async (data: string) => {
      try {
        const payload: IncomingMessage = JSON.parse(data);
        logCommand(payload, 'incoming');

        const response = await handleMessage(socket, payload);
        if (response) {
          socket.send(JSON.stringify(response));
          logCommand(response, 'outgoing');
        }
      } catch (error) {
        console.error('Error processing message:', error);
        const errorResponse: ErrorResponse = {
          type: 'error',
          id: 0,
          data: JSON.stringify({
            error: true,
            errorText: 'Invalid JSON or command',
          }),
        };
        socket.send(JSON.stringify(errorResponse));
        logCommand(errorResponse, 'outgoing');
      }
    });

    socket.on('close', () => {
      console.log(
        `Client disconnected. Active connections ${server.clients.size}`,
      );
    });
  });
};

export default createServer;
