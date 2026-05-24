import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3333';
let socket = null;

export const initializeSocket = (userId) => {
  socket = io(SOCKET_URL);
  socket.emit('register-user', userId);
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
