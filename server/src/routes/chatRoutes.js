import express from 'express';
import { getSwapMessages, sendMessage } from '../controllers/chatController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/:swapId/messages', getSwapMessages);
router.post('/:swapId/messages', sendMessage);

export default router;
