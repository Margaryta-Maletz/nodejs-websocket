export type IncomingMessage =
  | RegistrationRequest
  | CreateRoomRequest
  | AddUserToRoom;

export type OutgoingResponse =
  | RegistrationResponse
  | RoomUpdateResponse
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
