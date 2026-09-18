import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import {
  SWAP_STATUSES,
  isValidTransition,
  canUserPerformTransition,
} from '../services/swapStateMachine.js';
import { compareSwapItems } from '../services/valuationService.js';
import { createNotification } from '../services/notificationService.js';

export const createSwapRequest = async (req, res) => {
  try {
    const { offeredItemId, requestedItemId, message, exchangeMethod = 'LOCAL_MEETUP' } = req.body;
    const senderId = req.user.id;

    if (!offeredItemId || !requestedItemId) {
      return errorResponse(res, 'Both offered item and requested item are required.', 400);
    }

    if (offeredItemId === requestedItemId) {
      return errorResponse(res, 'You cannot swap an item with itself.', 400);
    }

    const [offeredItem, requestedItem] = await Promise.all([
      prisma.clothingItem.findUnique({
        where: { id: offeredItemId },
        include: { images: true },
      }),
      prisma.clothingItem.findUnique({
        where: { id: requestedItemId },
        include: { images: true },
      }),
    ]);

    if (!offeredItem) return errorResponse(res, 'Offered item not found.', 404);
    if (!requestedItem) return errorResponse(res, 'Requested item not found.', 404);

    if (offeredItem.ownerId !== senderId) {
      return errorResponse(res, 'You can only offer items that you own.', 403);
    }

    if (requestedItem.ownerId === senderId) {
      return errorResponse(res, 'You cannot send a swap request for your own listing.', 400);
    }

    if (offeredItem.status !== 'ACTIVE') {
      return errorResponse(res, 'Your offered item is not available for swap.', 400);
    }

    if (requestedItem.status !== 'ACTIVE') {
      return errorResponse(res, 'The requested item is no longer available.', 400);
    }

    // Check for existing pending/negotiating swap
    const existing = await prisma.swapRequest.findFirst({
      where: {
        offeredItemId,
        requestedItemId,
        status: { in: [SWAP_STATUSES.PENDING, SWAP_STATUSES.NEGOTIATING, SWAP_STATUSES.ACCEPTED] },
      },
    });

    if (existing) {
      return errorResponse(res, 'A swap request for these items is already in progress.', 409);
    }

    const swap = await prisma.swapRequest.create({
      data: {
        senderId,
        receiverId: requestedItem.ownerId,
        offeredItemId,
        requestedItemId,
        message: message || `Hi! I would love to exchange my ${offeredItem.title} for your ${requestedItem.title}.`,
        exchangeMethod,
        status: SWAP_STATUSES.PENDING,
        messages: {
          create: [
            {
              senderId,
              content: message || `Hi! I would love to exchange my ${offeredItem.title} for your ${requestedItem.title}.`,
              messageType: 'TEXT',
            },
          ],
        },
      },
      include: {
        offeredItem: { include: { images: true } },
        requestedItem: { include: { images: true } },
        sender: { select: { id: true, name: true, avatarUrl: true, city: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true, city: true } },
      },
    });

    // Notify receiver
    await createNotification({
      userId: requestedItem.ownerId,
      actorId: senderId,
      type: 'SWAP_REQUEST',
      title: 'New Swap Proposal! 👕⇄👕',
      message: `${req.user.name} wants to swap their "${offeredItem.title}" for your "${requestedItem.title}".`,
      link: `/swaps?tab=incoming&id=${swap.id}`,
    });

    return successResponse(res, { swap }, 'Swap request proposed successfully!', 201);
  } catch (error) {
    console.error('Error creating swap request:', error);
    return errorResponse(res, 'Failed to create swap request.', 500);
  }
};

export const getUserSwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tab = 'all' } = req.query;

    const where = {
      OR: [{ senderId: userId }, { receiverId: userId }],
    };

    if (tab === 'incoming') {
      where.receiverId = userId;
      where.status = { in: [SWAP_STATUSES.PENDING, SWAP_STATUSES.NEGOTIATING] };
    } else if (tab === 'outgoing') {
      where.senderId = userId;
      where.status = { in: [SWAP_STATUSES.PENDING, SWAP_STATUSES.NEGOTIATING] };
    } else if (tab === 'active') {
      where.status = {
        in: [
          SWAP_STATUSES.ACCEPTED,
          SWAP_STATUSES.SHIPPING,
          SWAP_STATUSES.READY_FOR_EXCHANGE,
        ],
      };
    } else if (tab === 'completed') {
      where.status = SWAP_STATUSES.COMPLETED;
    } else if (tab === 'rejected') {
      where.status = {
        in: [SWAP_STATUSES.REJECTED, SWAP_STATUSES.CANCELLED, SWAP_STATUSES.EXPIRED],
      };
    }

    const swaps = await prisma.swapRequest.findMany({
      where,
      include: {
        offeredItem: { include: { images: true } },
        requestedItem: { include: { images: true } },
        sender: {
          select: { id: true, name: true, avatarUrl: true, city: true, rating: true },
        },
        receiver: {
          select: { id: true, name: true, avatarUrl: true, city: true, rating: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return successResponse(res, { swaps });
  } catch (error) {
    console.error('Error fetching user swaps:', error);
    return errorResponse(res, 'Failed to retrieve swaps.', 500);
  }
};

export const getSwapById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const swap = await prisma.swapRequest.findUnique({
      where: { id },
      include: {
        offeredItem: {
          include: {
            images: true,
            owner: { select: { id: true, name: true, city: true, rating: true, avatarUrl: true } },
          },
        },
        requestedItem: {
          include: {
            images: true,
            owner: { select: { id: true, name: true, city: true, rating: true, avatarUrl: true } },
          },
        },
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true, city: true, state: true, rating: true, swapCount: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true, city: true, state: true, rating: true, swapCount: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        reviews: true,
      },
    });

    if (!swap) {
      return errorResponse(res, 'Swap request not found.', 404);
    }

    // Security check: Only sender, receiver, or ADMIN can view swap
    if (swap.senderId !== userId && swap.receiverId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to view this swap.', 403);
    }

    // Calculate algorithmic fairness comparison
    const comparison = compareSwapItems(swap.offeredItem, swap.requestedItem);

    return successResponse(res, { swap, comparison });
  } catch (error) {
    console.error('Error fetching swap details:', error);
    return errorResponse(res, 'Failed to fetch swap details.', 500);
  }
};

export const updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, exchangeMethod, deliveryDetails } = req.body;
    const userId = req.user.id;

    const swap = await prisma.swapRequest.findUnique({
      where: { id },
      include: { offeredItem: true, requestedItem: true },
    });

    if (!swap) return errorResponse(res, 'Swap request not found.', 404);

    // Validate state transition
    if (!isValidTransition(swap.status, status)) {
      return errorResponse(
        res,
        `Cannot transition swap from ${swap.status} to ${status}. Invalid state workflow.`,
        400
      );
    }

    // Validate authorization
    if (
      !canUserPerformTransition({
        currentStatus: swap.status,
        targetStatus: status,
        userId,
        senderId: swap.senderId,
        receiverId: swap.receiverId,
        role: req.user.role,
      })
    ) {
      return errorResponse(res, 'You are not authorized to perform this transition.', 403);
    }

    // Prepare update data
    const updateData = { status };
    if (exchangeMethod) updateData.exchangeMethod = exchangeMethod;
    if (deliveryDetails !== undefined) updateData.deliveryDetails = deliveryDetails;

    // Handle side-effects
    if (status === SWAP_STATUSES.ACCEPTED) {
      await prisma.clothingItem.updateMany({
        where: { id: { in: [swap.offeredItemId, swap.requestedItemId] } },
        data: { status: 'PENDING_SWAP' },
      });
    } else if (status === SWAP_STATUSES.COMPLETED) {
      updateData.completedAt = new Date();
      updateData.senderReady = true;
      updateData.receiverReady = true;

      await prisma.clothingItem.updateMany({
        where: { id: { in: [swap.offeredItemId, swap.requestedItemId] } },
        data: { status: 'SWAPPED' },
      });

      await prisma.user.update({
        where: { id: swap.senderId },
        data: { swapCount: { increment: 1 } },
      });
      await prisma.user.update({
        where: { id: swap.receiverId },
        data: { swapCount: { increment: 1 } },
      });
    } else if (status === SWAP_STATUSES.REJECTED || status === SWAP_STATUSES.CANCELLED) {
      await prisma.clothingItem.updateMany({
        where: { id: { in: [swap.offeredItemId, swap.requestedItemId] } },
        data: { status: 'ACTIVE' },
      });
    }

    const updatedSwap = await prisma.swapRequest.update({
      where: { id },
      data: updateData,
    });

    // Create system message in chat
    await prisma.message.create({
      data: {
        swapId: id,
        senderId: userId,
        content: `System update: Swap status changed to "${status}".`,
        messageType: 'STATUS_CHANGE',
      },
    });

    // Notify the other user
    const recipientId = userId === swap.senderId ? swap.receiverId : swap.senderId;
    await createNotification({
      userId: recipientId,
      actorId: userId,
      type: status === SWAP_STATUSES.ACCEPTED ? 'SWAP_ACCEPTED' : 'SWAP_REJECTED',
      title: `Swap Status: ${status} 🔄`,
      message: `${req.user.name} updated the swap request status to "${status}".`,
      link: `/chat/${id}`,
    });

    return successResponse(res, { swap: updatedSwap }, `Swap status updated to ${status}`);
  } catch (error) {
    console.error('Error updating swap status:', error);
    return errorResponse(res, 'Failed to update swap status.', 500);
  }
};

export const counterOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOfferedItemId, note } = req.body;
    const userId = req.user.id;

    const swap = await prisma.swapRequest.findUnique({
      where: { id },
    });

    if (!swap) return errorResponse(res, 'Swap request not found.', 404);
    if (swap.senderId !== userId && swap.receiverId !== userId) {
      return errorResponse(res, 'Unauthorized to modify this swap offer.', 403);
    }

    let updatedItem = null;
    if (newOfferedItemId) {
      const item = await prisma.clothingItem.findUnique({ where: { id: newOfferedItemId } });
      if (!item || item.ownerId !== userId || item.status !== 'ACTIVE') {
        return errorResponse(res, 'Selected alternative item is invalid or not available.', 400);
      }
      updatedItem = item;
    }

    const updatedSwap = await prisma.swapRequest.update({
      where: { id },
      data: {
        status: SWAP_STATUSES.NEGOTIATING,
        ...(newOfferedItemId && { offeredItemId: newOfferedItemId }),
      },
      include: {
        offeredItem: { include: { images: true } },
        requestedItem: { include: { images: true } },
      },
    });

    const msgContent = note
      ? `${note}${updatedItem ? ` (Counter-offered: ${updatedItem.title})` : ''}`
      : `Proposed a counter-offer with ${updatedItem?.title || 'updated terms'}.`;

    const chatMsg = await prisma.message.create({
      data: {
        swapId: id,
        senderId: userId,
        content: msgContent,
        messageType: 'OFFER_MODIFIED',
        metadata: JSON.stringify({
          newOfferedItemId: updatedItem?.id,
          newOfferedItemTitle: updatedItem?.title,
          newOfferedItemValue: updatedItem?.estimatedValue,
        }),
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    const recipientId = userId === swap.senderId ? swap.receiverId : swap.senderId;
    await createNotification({
      userId: recipientId,
      actorId: userId,
      type: 'OFFER_MODIFIED',
      title: 'Counter-Offer Received! 💬',
      message: `${req.user.name} updated the offer for your exchange.`,
      link: `/chat/${id}`,
    });

    return successResponse(res, { swap: updatedSwap, message: chatMsg }, 'Counter-offer submitted!');
  } catch (error) {
    console.error('Error submitting counter-offer:', error);
    return errorResponse(res, 'Failed to submit counter-offer.', 500);
  }
};

export const markReady = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const swap = await prisma.swapRequest.findUnique({ where: { id } });
    if (!swap) return errorResponse(res, 'Swap not found.', 404);

    const isSender = userId === swap.senderId;
    const isReceiver = userId === swap.receiverId;
    if (!isSender && !isReceiver) return errorResponse(res, 'Unauthorized.', 403);

    const updateData = {};
    if (isSender) updateData.senderReady = true;
    if (isReceiver) updateData.receiverReady = true;

    // Check if both will now be ready
    const willBothBeReady = (isSender && swap.receiverReady) || (isReceiver && swap.senderReady);

    if (willBothBeReady) {
      updateData.status = SWAP_STATUSES.COMPLETED;
      updateData.completedAt = new Date();

      await prisma.clothingItem.updateMany({
        where: { id: { in: [swap.offeredItemId, swap.requestedItemId] } },
        data: { status: 'SWAPPED' },
      });

      await prisma.user.update({
        where: { id: swap.senderId },
        data: { swapCount: { increment: 1 } },
      });
      await prisma.user.update({
        where: { id: swap.receiverId },
        data: { swapCount: { increment: 1 } },
      });
    } else {
      updateData.status = SWAP_STATUSES.READY_FOR_EXCHANGE;
    }

    const updated = await prisma.swapRequest.update({
      where: { id },
      data: updateData,
      include: {
        offeredItem: { include: { images: true } },
        requestedItem: { include: { images: true } },
      },
    });

    await prisma.message.create({
      data: {
        swapId: id,
        senderId: userId,
        content: willBothBeReady
          ? 'Both users confirmed exchange! The swap has been successfully COMPLETED. 🎉 Please leave a review!'
          : `${req.user.name} marked their item ready for exchange. Waiting for the other party's confirmation.`,
        messageType: 'STATUS_CHANGE',
      },
    });

    const recipientId = isSender ? swap.receiverId : swap.senderId;
    await createNotification({
      userId: recipientId,
      actorId: userId,
      type: willBothBeReady ? 'SWAP_COMPLETED' : 'MESSAGE',
      title: willBothBeReady ? 'Swap Completed! 🎉' : 'Exchange Ready Confirmation',
      message: willBothBeReady
        ? 'Your clothing swap has been completed! Leave a review for your partner.'
        : `${req.user.name} confirmed they are ready for the handover.`,
      link: `/chat/${id}`,
    });

    return successResponse(res, { swap: updated, isCompleted: willBothBeReady });
  } catch (error) {
    console.error('Error marking ready:', error);
    return errorResponse(res, 'Failed to update readiness.', 500);
  }
};
