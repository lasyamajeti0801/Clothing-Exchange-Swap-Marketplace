import express from 'express';
import { calculateEstimatedValue, compareSwapItems } from '../services/valuationService.js';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.post('/estimate', (req, res) => {
  const result = calculateEstimatedValue(req.body);
  return successResponse(res, result);
});

router.post('/compare', (req, res) => {
  const { offeredItem, requestedItem } = req.body;
  const result = compareSwapItems(offeredItem || {}, requestedItem || {});
  return successResponse(res, result);
});

export default router;
