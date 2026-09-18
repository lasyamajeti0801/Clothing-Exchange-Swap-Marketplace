import { Server } from 'socket.io';
import { verifyToken } from './utils/jwt.js';
import prisma from './config/db.js';

let ioInstance = null;

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  ioInstance = io;

  // Socket middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Invalid token'));
    }

    socket.user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    // Join personal user room for direct notifications
    socket.join(`user:${socket.user.id}`);

    // Join swap negotiation room
    socket.on('join_swap', async (swapId) => {
      try {
        const swap = await prisma.swapRequest.findUnique({
          where: { id: swapId },
          select: { senderId: true, receiverId: true },
        });

        if (!swap) {
          socket.emit('error', { message: 'Swap not found' });
          return;
        }

        if (swap.senderId !== socket.user.id && swap.receiverId !== socket.user.id && socket.user.role !== 'ADMIN') {
          socket.emit('error', { message: 'Unauthorized for this swap room' });
          return;
        }

        socket.join(`swap:${swapId}`);
      } catch (err) {
        console.error('Socket join error:', err);
      }
    });

    socket.on('leave_swap', (swapId) => {
      socket.leave(`swap:${swapId}`);
    });

    socket.on('typing', ({ swapId }) => {
      socket.to(`swap:${swapId}`).emit('user_typing', {
        userId: socket.user.id,
        name: socket.user.name,
      });
    });

    socket.on('stop_typing', ({ swapId }) => {
      socket.to(`swap:${swapId}`).emit('user_stop_typing', {
        userId: socket.user.id,
      });
    });

    socket.on('send_message', async ({ swapId, content, messageType = 'TEXT', metadata = null }) => {
      try {
        if (!content || !content.trim()) return;

        const swap = await prisma.swapRequest.findUnique({
          where: { id: swapId },
        });

        if (!swap) return;
        if (swap.senderId !== socket.user.id && swap.receiverId !== socket.user.id && socket.user.role !== 'ADMIN') {
          return;
        }

        const message = await prisma.message.create({
          data: {
            swapId,
            senderId: socket.user.id,
            content: content.trim(),
            messageType,
            metadata: metadata ? JSON.stringify(metadata) : null,
          },
          include: {
            sender: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        });

        io.to(`swap:${swapId}`).emit('new_message', message);

        const recipientId = socket.user.id === swap.senderId ? swap.receiverId : swap.senderId;
        io.to(`user:${recipientId}`).emit('new_notification', {
          title: `New message from ${socket.user.name}`,
          message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
          link: `/chat/${swapId}`,
        });
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
};

export const getIO = () => ioInstance;
