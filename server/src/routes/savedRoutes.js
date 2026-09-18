import express from 'express';
import { getSavedItems, saveItem, removeSavedItem } from '../controllers/savedController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getSavedItems);
router.post('/:clothingId', saveItem);
router.delete('/:clothingId', removeSavedItem);

export default router;
