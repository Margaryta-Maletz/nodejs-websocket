import type { WebSocket } from 'ws';

import type { IncomingMessage, OutgoingResponse } from '../types/types';
import { handlePlayerMessage } from './player';

const getData = (message) =>
  typeof message.data === 'string' ? JSON.parse(message.data) : message.data;

export async function handleMessage(
  ws: WebSocket,
  message: IncomingMessage,
): Promise<OutgoingResponse | null> {
  switch (message.type) {
    case 'reg':
      return handlePlayerMessage(getData(message), message.id);

    default:
      return {
        type: 'error',
        data: JSON.stringify({
          error: true,
          errorText: 'Unknown command type',
        }),
        id: message.id,
      };
  }
}
