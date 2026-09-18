import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createReview = async (req, res) => {
  try {
    const { swapId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (!swapId || !rating) {
      return errorResponse(res, 'Swap ID and rating (1-5) are required.', 400);
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return errorResponse(res, 'Rating must be an integer between 1 and 5.', 400);
    }

    const swap = await prisma.swapRequest.findUnique({
      where: { id: swapId },
    });

    if (!swap) return errorResponse(res, 'Swap not found.', 404);

    if (swap.status !== 'COMPLETED') {
      return errorResponse(res, 'Reviews can only be submitted for completed swaps.', 400);
    }

    if (swap.senderId !== reviewerId && swap.receiverId !== reviewerId) {
      return errorResponse(res, 'You are not a participant in this swap.', 403);
    }

    const revieweeId = reviewerId === swap.senderId ? swap.receiverId : swap.senderId;

    // Check for existing review
    const existing = await prisma.review.findUnique({
      where: {
        swapId_reviewerId: {
          swapId,
          reviewerId,
        },
      },
    });

    if (existing) {
      return errorResponse(res, 'You have already reviewed this swap.', 409);
    }

    const review = await prisma.review.create({
      data: {
        swapId,
        reviewerId,
        revieweeId,
        rating: ratingNum,
        comment: comment?.trim() || null,
      },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // Update reviewee's average rating
    const allReviews = await prisma.review.findMany({
      where: { revieweeId },
      select: { rating: true },
    });

    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.user.update({
      where: { id: revieweeId },
      data: { rating: parseFloat(avg.toFixed(1)) },
    });

    return successResponse(res, { review }, 'Thank you! Your review has been recorded.', 201);
  } catch (error) {
    console.error('Error creating review:', error);
    return errorResponse(res, 'Failed to submit review.', 500);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true, city: true } },
        swap: {
          include: {
            offeredItem: { select: { title: true } },
            requestedItem: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse(res, 'Failed to fetch reviews.', 500);
  }
};
