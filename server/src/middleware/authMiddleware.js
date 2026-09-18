import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';
import prisma from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in.', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 'Invalid or expired session. Please log in again.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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
        isSuspended: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User account no longer exists.', 401);
    }

    if (user.isSuspended) {
      return errorResponse(res, 'Your account has been suspended. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 'Authentication failed.', 500);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, name: true, role: true, isSuspended: true },
        });
        if (user && !user.isSuspended) {
          req.user = user;
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
};
