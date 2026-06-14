import express from 'express';
import { getDashboardTotals, getMonthlySummary } from '../controllers/reportsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardTotals);
router.get('/monthly-summary', protect, getMonthlySummary);

export default router;
