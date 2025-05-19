import type { WebSocket, WebSocketServer } from 'ws';

import type {
  AddShipsRequest,
  CreateGameResponse,
  Game,
  PlayerInRoom,
  StartGameResponse,
} from '../types/types';
import { logCommand } from '../utils/logger';
import { rooms } from './room';

const games: Record<string, Game> = {};

export function handleGameMessage(
  socket: WebSocket,
  message: AddShipsRequest,
  server: WebSocketServer,
): void {
  const { type, data } = message;

  switch (type) {
    case 'add_ships': {
      const { gameId, ships, indexPlayer } =
        typeof data === 'string' ? JSON.parse(data) : data;
      games[gameId].players[indexPlayer] = {
        ships,
        board: [],
        remainingShips: 10,
      };
      if (Object.keys(games[gameId].players).length === 2) {
        broadcastStartGame(gameId, server);
      }
      break;
    }

    default:
      console.error(`Unknown game command: ${type}`);
  }
}

export function broadcastCreateGame(room: string, server: WebSocketServer) {
  const players: PlayerInRoom[] = rooms[room].roomUsers;
  const idGame = `game_${Object.keys(games).length + 1}`;
  games[idGame] = {
    gameId: idGame,
    players: {},
    currentPlayerIndex: String(players[0].index),
  };

  players.forEach((player) => {
    const createGameResponse: CreateGameResponse = {
      type: 'create_game',
      data: JSON.stringify({
        idGame,
        idPlayer: player.index,
      }),
      id: 0,
    };

    server.clients.forEach((client) => {
      client.send(JSON.stringify(createGameResponse));

      logCommand(createGameResponse, 'outgoing');
    });
  });
}

function broadcastStartGame(gameId: string, server: WebSocketServer) {
  const players = Object.keys(games[gameId]);
  players.forEach((player) => {
    const startGameResponse: StartGameResponse = {
      type: 'start_game',
      data: JSON.stringify({
        ships: games[gameId].players[player].ships,
        currentPlayerIndex: players[0],
      }),
      id: 0,
    };

    server.clients.forEach((client) => {
      client.send(JSON.stringify(startGameResponse));
    });

    logCommand(startGameResponse, 'outgoing');
  });
}
