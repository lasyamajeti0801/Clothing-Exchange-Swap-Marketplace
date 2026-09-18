import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reportedListingId, swapId, reason, description } = req.body;
    const reporterId = req.user.id;

    if (!reason || !description) {
      return errorResponse(res, 'Reason and description are required for filing a report.', 400);
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId: reportedUserId || null,
        reportedListingId: reportedListingId || null,
        swapId: swapId || null,
        reason,
        description: description.trim(),
        status: 'OPEN',
      },
    });

    return successResponse(res, { report }, 'Report filed. Our moderation team will review it shortly.', 201);
  } catch (error) {
    console.error('Error creating report:', error);
    return errorResponse(res, 'Failed to file report.', 500);
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedListing: { select: { id: true, title: true, brand: true, ownerId: true } },
        swap: {
          select: {
            id: true,
            status: true,
            offeredItem: { select: { title: true } },
            requestedItem: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return errorResponse(res, 'Failed to fetch reports.', 500);
  }
};
