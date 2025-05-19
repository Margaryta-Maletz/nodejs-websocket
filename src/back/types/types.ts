export type IncomingMessage =
  | RegistrationRequest
  | CreateRoomRequest
  | AddUserToRoom
  | AddShipsRequest;

export type OutgoingResponse =
  | RegistrationResponse
  | RoomUpdateResponse
  | CreateGameResponse
  | StartGameResponse
  | ErrorResponse;

export type RegistrationRequest = {
  type: 'reg';
  data: string;
  id: number;
};

export type RegistrationRequestData = {
  name: string;
  password: string;
};

export type RegistrationResponse = {
  type: 'reg';
  data:
    | {
        name: string;
        index: string;
        error: boolean;
        errorText: string;
      }
    | string;
  id: number;
};

export type Player = {
  name: string;
  password: string;
  wins: number;
};

export type ErrorResponse = {
  type: 'error';
  id: number;
  data:
    | {
        error: boolean;
        errorText: string;
      }
    | string;
};

export type CreateRoomRequest = {
  type: 'create_room';
  data: string;
  id: number;
};

export type AddUserToRoom = {
  type: 'add_user_to_room';
  data:
    | {
        indexRoom: number | string;
      }
    | string;
  id: number;
};

export type RoomUpdateResponse = {
  type: 'update_room';
  data: Room[] | string;
  id: number;
};

export type Room = {
  roomId: string;
  roomUsers: PlayerInRoom[];
};

export type PlayerInRoom = {
  name: string;
  index: number | string;
};

export type CreateGameResponse = {
  type: 'create_game';
  data:
    | {
        idGame: number | string;
        idPlayer: number | string;
      }
    | string;
  id: number;
};

export type AddShipsRequest = {
  type: 'add_ships';
  data:
    | {
        gameId: string;
        ships: Ship[];
        indexPlayer: string;
      }
    | string;
  id: number;
};

export type StartGameResponse = {
  type: 'start_game';
  data: string;
  id: number;
};

export type ShipPosition = {
  x: number;
  y: number;
};

export type Ship = {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type Game = {
  gameId: string;
  players: Record<string, PlayerGameState>;
  currentPlayerIndex: string;
  winner?: string;
};

export type PlayerGameState = {
  ships: Ship[];
  board: string[][];
  remainingShips: number;
};

export type Attack = {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
};

export type AttackResult = {
  position: ShipPosition;
  currentPlayer: string;
  status: 'miss' | 'killed' | 'shot';
};

export type FinishResult = {
  winPlayer: string;
};
