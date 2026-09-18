import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createReport);
router.get('/', authenticate, requireAdmin, getReports);

export default router;
