import type { IncomingMessage, OutgoingResponse } from '../types/types';

export function logCommand(
  command: IncomingMessage | OutgoingResponse,
  type: 'incoming' | 'outgoing',
): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] `, command.type, command.data);
}
