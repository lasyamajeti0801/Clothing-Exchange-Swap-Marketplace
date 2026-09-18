import express from 'express';
import {
  getClothes,
  getClothingById,
  createClothing,
  updateClothing,
  deleteClothing,
} from '../controllers/clothesController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getClothes);
router.get('/:id', optionalAuthenticate, getClothingById);
router.post('/', authenticate, upload.array('images', 5), createClothing);
router.put('/:id', authenticate, updateClothing);
router.delete('/:id', authenticate, deleteClothing);

export default router;
