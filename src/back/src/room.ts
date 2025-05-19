import type { WebSocketServer } from 'ws';

import type {
  ErrorResponse,
  PlayerInRoom,
  RoomUpdateResponse,
} from '../types/types';
import type { IncomingMessage } from '../types/types';
import { logCommand } from '../utils/logger';

const rooms: Record<string, { roomUsers: PlayerInRoom[] }> = {};

export function handleRoomMessage(
  message: IncomingMessage,
  playerName: string,
): RoomUpdateResponse | ErrorResponse {
  switch (message.type) {
    case 'create_room': {
      const roomId = `room_${Object.keys(rooms).length + 1}`;
      rooms[roomId] = { roomUsers: [] };

      rooms[roomId].roomUsers.push({
        name: playerName,
        index: `P_${playerName}`,
      });
      break;
    }

    case 'add_user_to_room': {
      const { indexRoom } =
        typeof message.data === 'string'
          ? JSON.parse(message.data)
          : message.data;

      if (rooms[indexRoom]) {
        rooms[indexRoom].roomUsers.push({
          name: playerName,
          index: `P_${playerName}`,
        });
      } else {
        return {
          type: 'error',
          data: JSON.stringify({
            error: true,
            errorText: `Room not found: ${indexRoom}`,
          }),
          id: 0,
        };
      }
    }
  }

  return {
    type: 'update_room',
    data: JSON.stringify(
      Object.entries(rooms).map(([roomId, { roomUsers }]) => ({
        roomId,
        roomUsers,
      })),
    ),
    id: 0,
  };
}

export function broadcastRoomUpdate(server: WebSocketServer): void {
  const updateRoomResponse: RoomUpdateResponse = {
    type: 'update_room',
    data: JSON.stringify(
      Object.entries(rooms).map(([roomId, { roomUsers }]) => ({
        roomId,
        roomUsers,
      })),
    ),
    id: 0,
  };

  server.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(updateRoomResponse));

      logCommand(updateRoomResponse, 'outgoing');
    }
  });
}
