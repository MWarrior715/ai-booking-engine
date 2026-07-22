import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Devuelve una instancia lazy de Socket.io.
 * En deploys serverless (Vercel) donde no hay servidor Socket.io persistente,
 * la conexión falla silenciosamente y el cliente opera en modo REST puro.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false,
    });

    socket.on('connect_error', () => {
      // No crashear la UI si el servidor WebSocket no está disponible.
      socket?.disconnect();
    });
  }
  return socket;
}
