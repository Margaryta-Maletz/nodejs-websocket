import type {
  Player,
  RegistrationRequestData,
  RegistrationResponse,
} from '../types/types';

const players: Record<string, Player> = {};

export function handlePlayerMessage(
  data: RegistrationRequestData,
): RegistrationResponse {
  const { name, password } = data;

  if (!players[name]) {
    players[name] = { name, password, wins: 0 };
    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: `P_${name}`,
        error: false,
        errorText: '',
      }),
      id: 0,
    };
  } else if (players[name].password !== password) {
    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: '',
        error: true,
        errorText: 'Invalid password',
      }),
      id: 0,
    };
  } else {
    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: `P_${name}`,
        error: false,
        errorText: '',
      }),
      id: 0,
    };
  }
}
