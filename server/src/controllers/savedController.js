import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const saved = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        clothing: {
          include: {
            images: true,
            owner: { select: { id: true, name: true, city: true, rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const items = saved.map((s) => s.clothing);

    return successResponse(res, { items });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    return errorResponse(res, 'Failed to fetch saved items.', 500);
  }
};

export const saveItem = async (req, res) => {
  try {
    const { clothingId } = req.params;
    const userId = req.user.id;

    const clothing = await prisma.clothingItem.findUnique({ where: { id: clothingId } });
    if (!clothing) return errorResponse(res, 'Item not found.', 404);

    const saved = await prisma.savedItem.upsert({
      where: {
        userId_clothingId: {
          userId,
          clothingId,
        },
      },
      update: {},
      create: {
        userId,
        clothingId,
      },
    });

    return successResponse(res, { saved }, 'Item saved to your wishlist.');
  } catch (error) {
    console.error('Error saving item:', error);
    return errorResponse(res, 'Failed to save item.', 500);
  }
};

export const removeSavedItem = async (req, res) => {
  try {
    const { clothingId } = req.params;
    const userId = req.user.id;

    await prisma.savedItem.deleteMany({
      where: {
        userId,
        clothingId,
      },
    });

    return successResponse(res, null, 'Item removed from wishlist.');
  } catch (error) {
    console.error('Error removing saved item:', error);
    return errorResponse(res, 'Failed to remove saved item.', 500);
  }
};
