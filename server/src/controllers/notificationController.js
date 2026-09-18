import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return successResponse(res, { notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return errorResponse(res, 'Failed to fetch notifications.', 500);
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    return successResponse(res, null, 'Notification marked as read.');
  } catch (error) {
    console.error('Error marking notification read:', error);
    return errorResponse(res, 'Failed to update notification.', 500);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return successResponse(res, null, 'All notifications marked as read.');
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return errorResponse(res, 'Failed to update notifications.', 500);
  }
};
