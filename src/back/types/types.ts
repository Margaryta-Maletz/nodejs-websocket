export type IncomingMessage = RegistrationRequest;

export type OutgoingResponse = RegistrationResponse | ErrorResponse;

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
