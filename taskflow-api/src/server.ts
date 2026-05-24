import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import logger from './config/logger';

const PORT = process.env.PORT || 3333;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

interface UsersMap {
  [key: string]: string;
}

const users: UsersMap = {};

io.on('connection', (socket) => {
  logger.info(`Usu√°rio conectado: ${socket.id}`);

  socket.on('register-user', (userId: string) => {
    users[userId] = socket.id;
    logger.info(`Usu√°rio ${userId} registrado com socket ${socket.id}`);
  });

  socket.on('send-notification', ({ to, notification }: { to: string; notification: any }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit('new-notification', notification);
    }
  });

  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    logger.info(`Usu√°rio desconectado: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  logger.info(`Ì∫Ä Server running on port ${PORT}`);
  logger.info(`Ì≥ù API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`Ìºç Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Ì¥å Socket.IO ready`);
});

export { io };
