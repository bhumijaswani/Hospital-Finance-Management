import express from 'express';
import { fetchDashboardSummary, fetchMonthlyChart } from '../controllers/dashboardController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/summary', verifyToken, checkRole('Admin'), fetchDashboardSummary);
router.get('/monthly-chart', verifyToken, checkRole('Admin'), fetchMonthlyChart);

export default router;