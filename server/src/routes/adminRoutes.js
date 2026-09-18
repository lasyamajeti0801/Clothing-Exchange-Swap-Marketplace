import express from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  getAdminListings,
  moderateListing,
  resolveReport,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/listings', getAdminListings);
router.put('/listings/:id/status', moderateListing);
router.put('/reports/:id/resolve', resolveReport);

export default router;
