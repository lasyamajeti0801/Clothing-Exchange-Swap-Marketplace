import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { calculateEstimatedValue } from '../services/valuationService.js';

export const getClothes = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      size,
      condition,
      city,
      minVal,
      maxVal,
      sort = 'newest',
      page = 1,
      limit = 12,
      ownerId,
      excludeOwnerId,
      status = 'ACTIVE',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category) {
      where.category = { equals: category };
    }

    if (brand) {
      where.brand = { contains: brand };
    }

    if (size) {
      where.size = { equals: size };
    }

    if (condition) {
      where.condition = { equals: condition };
    }

    if (city) {
      where.city = { contains: city };
    }

    if (minVal || maxVal) {
      where.estimatedValue = {};
      if (minVal) where.estimatedValue.gte = parseFloat(minVal);
      if (maxVal) where.estimatedValue.lte = parseFloat(maxVal);
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (excludeOwnerId) {
      where.ownerId = { not: excludeOwnerId };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
        { city: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'value_asc') orderBy = { estimatedValue: 'asc' };
    if (sort === 'value_desc') orderBy = { estimatedValue: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const [items, total] = await Promise.all([
      prisma.clothingItem.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              city: true,
              state: true,
              rating: true,
              swapCount: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.clothingItem.count({ where }),
    ]);

    return successResponse(res, {
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching clothes:', error);
    return errorResponse(res, 'Failed to retrieve clothing items.', 500);
  }
};

export const getClothingById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const item = await prisma.clothingItem.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            city: true,
            state: true,
            country: true,
            rating: true,
            swapCount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!item) {
      return errorResponse(res, 'Clothing item not found.', 404);
    }

    let isSaved = false;
    if (currentUserId) {
      const saved = await prisma.savedItem.findUnique({
        where: {
          userId_clothingId: {
            userId: currentUserId,
            clothingId: id,
          },
        },
      });
      isSaved = !!saved;
    }

    // Fetch compatible/recommended items in similar category or value range
    const recommendations = await prisma.clothingItem.findMany({
      where: {
        id: { not: item.id },
        ownerId: { not: item.ownerId },
        status: 'ACTIVE',
        OR: [
          { category: item.category },
          {
            estimatedValue: {
              gte: item.estimatedValue * 0.75,
              lte: item.estimatedValue * 1.25,
            },
          },
        ],
      },
      include: {
        images: { take: 1 },
        owner: { select: { id: true, name: true, city: true, rating: true } },
      },
      take: 4,
    });

    return successResponse(res, { item, isSaved, recommendations });
  } catch (error) {
    console.error('Error getting clothing detail:', error);
    return errorResponse(res, 'Failed to fetch item details.', 500);
  }
};

export const createClothing = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      brand,
      size,
      color,
      material,
      condition,
      purchaseAge,
      estimatedValue: userValue,
      originalPrice,
      exchangePreferences,
      city,
      state,
      imageUrl, // Support direct single URL fallback
    } = req.body;

    if (!title || !category || !brand || !size || !condition || !description) {
      return errorResponse(res, 'Please provide title, category, brand, size, condition, and description.', 400);
    }

    // Determine estimated value if not supplied by user
    let finalValue = parseFloat(userValue);
    if (!finalValue || isNaN(finalValue)) {
      const calculation = calculateEstimatedValue({
        category,
        brand,
        condition,
        purchaseAge: purchaseAge || '1-2 years',
        material: material || 'Cotton',
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      });
      finalValue = calculation.estimatedValue;
    }

    // Process uploaded images or URLs
    const imageRecords = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        imageRecords.push({
          url: `/uploads/${file.filename}`,
          isPrimary: index === 0,
          order: index,
        });
      });
    } else if (imageUrl) {
      imageRecords.push({
        url: imageUrl,
        isPrimary: true,
        order: 0,
      });
    } else {
      // High-quality fallback royalty-free placeholder image based on category
      imageRecords.push({
        url: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80`,
        isPrimary: true,
        order: 0,
      });
    }

    const newItem = await prisma.clothingItem.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory: subcategory || null,
        brand: brand.trim(),
        size,
        color: color || 'Multi',
        material: material || 'Cotton',
        condition,
        purchaseAge: purchaseAge || '1-2 years',
        estimatedValue: finalValue,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        exchangePreferences: exchangePreferences || null,
        city: city || req.user.city || 'Hyderabad',
        state: state || req.user.state || 'Telangana',
        ownerId: req.user.id,
        images: {
          create: imageRecords,
        },
      },
      include: {
        images: true,
        owner: { select: { id: true, name: true, city: true } },
      },
    });

    return successResponse(res, { item: newItem }, 'Clothing listed successfully!', 201);
  } catch (error) {
    console.error('Error creating clothing listing:', error);
    return errorResponse(res, 'Failed to create listing.', 500);
  }
};

export const updateClothing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      brand,
      size,
      color,
      material,
      condition,
      purchaseAge,
      estimatedValue,
      originalPrice,
      exchangePreferences,
      status,
    } = req.body;

    const existing = await prisma.clothingItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse(res, 'Item not found.', 404);
    }

    // Role check: Only owner or admin can update
    if (existing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to update this listing.', 403);
    }

    const updated = await prisma.clothingItem.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(category && { category }),
        ...(brand && { brand: brand.trim() }),
        ...(size && { size }),
        ...(color && { color }),
        ...(material && { material }),
        ...(condition && { condition }),
        ...(purchaseAge && { purchaseAge }),
        ...(estimatedValue && { estimatedValue: parseFloat(estimatedValue) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(exchangePreferences !== undefined && { exchangePreferences }),
        ...(status && { status }),
      },
      include: {
        images: true,
      },
    });

    return successResponse(res, { item: updated }, 'Listing updated successfully.');
  } catch (error) {
    console.error('Error updating clothing:', error);
    return errorResponse(res, 'Failed to update listing.', 500);
  }
};

export const deleteClothing = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.clothingItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse(res, 'Item not found.', 404);
    }

    if (existing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to delete this listing.', 403);
    }

    await prisma.clothingItem.delete({
      where: { id },
    });

    return successResponse(res, null, 'Listing deleted successfully.');
  } catch (error) {
    console.error('Error deleting clothing:', error);
    return errorResponse(res, 'Failed to delete listing.', 500);
  }
};
