import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { createNotification } from '../services/notificationService.js';

export const getSwapMessages = async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user.id;

    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
    });

    if (!swap) return errorResponse(res, 'Swap not found.', 404);

    if (swap.senderId !== userId && swap.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to view this conversation.', 403);
    }

    const messages = await prisma.message.findMany({
      where: { swapId },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread messages sent by the other party as read
    await prisma.message.updateMany({
      where: {
        swapId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    return successResponse(res, { messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return errorResponse(res, 'Failed to retrieve messages.', 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { swapId } = req.params;
    const { content, messageType = 'TEXT', metadata = null } = req.body;
    const senderId = req.user.id;

    if (!content || !content.trim()) {
      return errorResponse(res, 'Message content cannot be empty.', 400);
    }

    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
    });

    if (!swap) return errorResponse(res, 'Swap not found.', 404);

    if (swap.senderId !== senderId && swap.receiverId !== senderId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to message in this swap.', 403);
    }

    const message = await prisma.message.create({
      data: {
        swapId,
        senderId,
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

    // Notify the other user
    const recipientId = senderId === swap.senderId ? swap.receiverId : swap.senderId;
    await createNotification({
      userId: recipientId,
      actorId: senderId,
      type: 'MESSAGE',
      title: `Message from ${req.user.name} 💬`,
      message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
      link: `/chat/${swapId}`,
    });

    return successResponse(res, { message }, 'Message sent.', 201);
  } catch (error) {
    console.error('Error sending message:', error);
    return errorResponse(res, 'Failed to send message.', 500);
  }
};
