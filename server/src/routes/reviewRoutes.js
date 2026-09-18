import express from 'express';
import { createReview, getUserReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/user/:userId', getUserReviews);

export default router;
