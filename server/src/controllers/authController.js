import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, city = 'Hyderabad', state = 'Telangana', avatarUrl } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters.', 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 'Passwords do not match.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Please provide a valid email address.', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        city,
        state,
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        city: true,
        state: true,
        country: true,
        rating: true,
        swapCount: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    return successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Unable to register user.', 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    if (user.isSuspended) {
      return errorResponse(res, 'Your account has been suspended by administration.', 403);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      city: user.city,
      state: user.state,
      country: user.country,
      rating: user.rating,
      swapCount: user.swapCount,
      createdAt: user.createdAt,
    };

    const token = generateToken(safeUser);

    return successResponse(res, { user: safeUser, token }, 'Logged in successfully');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Unable to log in.', 500);
  }
};

export const getMe = async (req, res) => {
  try {
    return successResponse(res, { user: req.user });
  } catch (error) {
    return errorResponse(res, 'Failed to fetch current user.', 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, city, state, avatarUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(bio !== undefined && { bio }),
        ...(city && { city }),
        ...(state && { state }),
        ...(avatarUrl && { avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        rating: true,
        swapCount: true,
        updatedAt: true,
      },
    });

    return successResponse(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Unable to update profile.', 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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
        listings: {
          where: { status: 'ACTIVE' },
          include: { images: true },
          orderBy: { createdAt: 'desc' },
        },
        reviewsReceived: {
          include: {
            reviewer: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'User profile not found.', 404);
    }

    return successResponse(res, { profile: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse(res, 'Unable to fetch user profile.', 500);
  }
};
