import prisma from '../config/db.js';

export const createNotification = async ({ userId, actorId = null, type, title, message, link = null }) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        title,
        message,
        link,
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};
