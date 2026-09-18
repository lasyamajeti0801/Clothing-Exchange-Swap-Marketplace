import express from 'express';
import {
  createSwapRequest,
  getUserSwaps,
  getSwapById,
  updateSwapStatus,
  counterOffer,
  markReady,
} from '../controllers/swapController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createSwapRequest);
router.get('/', getUserSwaps);
router.get('/:id', getSwapById);
router.put('/:id/status', updateSwapStatus);
router.post('/:id/counter-offer', counterOffer);
router.post('/:id/ready', markReady);

export default router;
