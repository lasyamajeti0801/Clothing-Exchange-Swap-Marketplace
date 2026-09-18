import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalSwaps,
      completedSwaps,
      pendingSwaps,
      openReports,
      categoryCounts,
      recentUsers,
      recentSwaps,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.clothingItem.count(),
      prisma.clothingItem.count({ where: { status: 'ACTIVE' } }),
      prisma.swapRequest.count(),
      prisma.swapRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.swapRequest.count({ where: { status: { in: ['PENDING', 'NEGOTIATING'] } } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.clothingItem.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, city: true, createdAt: true, isSuspended: true },
      }),
      prisma.swapRequest.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          offeredItem: { select: { title: true } },
          requestedItem: { select: { title: true } },
          sender: { select: { name: true } },
          receiver: { select: { name: true } },
        },
      }),
    ]);

    // Estimated environmental impact from swaps
    // 1 garment reused ≈ 2.5 kg CO2 avoided, ~2,700 Liters of water saved, 0.4 kg textile waste diverted
    const itemsReused = completedSwaps * 2; // Each swap exchanges 2 garments
    const estimatedCO2SavedKg = Math.round(itemsReused * 2.5 * 10) / 10;
    const estimatedWaterSavedLiters = itemsReused * 2700;
    const estimatedWasteDivertedKg = Math.round(itemsReused * 0.4 * 10) / 10;

    const formattedCategoryStats = categoryCounts.map((c) => ({
      name: c.category,
      count: c._count.category,
    }));

    return successResponse(res, {
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        totalSwaps,
        completedSwaps,
        pendingSwaps,
        openReports,
        itemsReused,
        estimatedCO2SavedKg,
        estimatedWaterSavedLiters,
        estimatedWasteDivertedKg,
      },
      categoryStats: formattedCategoryStats,
      recentUsers,
      recentSwaps,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return errorResponse(res, 'Failed to fetch admin stats.', 500);
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, role, isSuspended } = req.query;

    const where = {};
    if (role) where.role = role;
    if (isSuspended !== undefined) where.isSuspended = isSuspended === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        state: true,
        rating: true,
        swapCount: true,
        isSuspended: true,
        createdAt: true,
        _count: {
          select: { listings: true, sentSwaps: true, receivedSwaps: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse(res, 'Failed to fetch users.', 500);
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuspended, notes } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return errorResponse(res, 'User not found.', 404);

    if (user.role === 'ADMIN') {
      return errorResponse(res, 'Cannot suspend an administrator account.', 400);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isSuspended: Boolean(isSuspended) },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user.id,
        action: isSuspended ? 'SUSPEND_USER' : 'ACTIVATE_USER',
        targetType: 'USER',
        targetId: id,
        notes: notes || null,
      },
    });

    return successResponse(res, { user: updated }, `User ${isSuspended ? 'suspended' : 'activated'}.`);
  } catch (error) {
    console.error('Error toggling user suspension:', error);
    return errorResponse(res, 'Failed to update user status.', 500);
  }
};

export const getAdminListings = async (req, res) => {
  try {
    const { search, status, category } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const listings = await prisma.clothingItem.findMany({
      where,
      include: {
        images: { take: 1 },
        owner: { select: { id: true, name: true, email: true, isSuspended: true } },
        _count: { select: { reports: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, { listings });
  } catch (error) {
    console.error('Error fetching admin listings:', error);
    return errorResponse(res, 'Failed to retrieve listings.', 500);
  }
};

export const moderateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const item = await prisma.clothingItem.findUnique({ where: { id } });
    if (!item) return errorResponse(res, 'Listing not found.', 404);

    const updated = await prisma.clothingItem.update({
      where: { id },
      data: { status: status || 'REMOVED' },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user.id,
        action: 'MODERATE_LISTING',
        targetType: 'LISTING',
        targetId: id,
        notes: `Status changed to ${status || 'REMOVED'}. Reason: ${reason || 'Violation of terms'}`,
      },
    });

    return successResponse(res, { item: updated }, 'Listing moderation applied.');
  } catch (error) {
    console.error('Error moderating listing:', error);
    return errorResponse(res, 'Failed to moderate listing.', 500);
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'RESOLVED', adminNotes } = req.body;

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return errorResponse(res, 'Report not found.', 404);

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes || 'Resolved by administrative review.',
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user.id,
        action: 'RESOLVE_REPORT',
        targetType: 'REPORT',
        targetId: id,
        notes: adminNotes || 'Report marked as resolved.',
      },
    });

    return successResponse(res, { report: updated }, 'Report resolved successfully.');
  } catch (error) {
    console.error('Error resolving report:', error);
    return errorResponse(res, 'Failed to resolve report.', 500);
  }
};
