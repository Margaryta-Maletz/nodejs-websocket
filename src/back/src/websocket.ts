import type { WebSocket } from 'ws';
import type { WebSocketServer } from 'ws';

import type { IncomingMessage, OutgoingResponse } from '../types/types';
import { handleGameMessage } from './game';
import { handlePlayerMessage } from './player';
import { handleRoomMessage } from './room';

const connectedPlayers: Map<WebSocket, string> = new Map();

const getData = (message: IncomingMessage | OutgoingResponse) =>
  typeof message.data === 'string' ? JSON.parse(message.data) : message.data;

export async function handleMessage(
  socket: WebSocket,
  message: IncomingMessage,
  server: WebSocketServer,
): Promise<OutgoingResponse | null> {
  const playerName = connectedPlayers.get(socket);

  switch (message.type) {
    case 'reg': {
      const response = handlePlayerMessage(getData(message));

      const { name, error } = getData(response);
      if (!error) {
        connectedPlayers.set(socket, name);
      }

      return response;
    }

    case 'create_room':
    case 'add_user_to_room': {
      if (!playerName) {
        return {
          type: 'error',
          data: JSON.stringify({
            error: true,
            errorText: 'Player not logged in.',
          }),
          id: 0,
        };
      }

      return handleRoomMessage(message, playerName);
    }

    case 'add_ships': {
      handleGameMessage(socket, message, server);
      return null;
    }

    default:
      return {
        type: 'error',
        data: JSON.stringify({
          error: true,
          errorText: 'Unknown command type',
        }),
        id: 0,
      };
  }
}
