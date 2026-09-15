import express from 'express';
import {
  addExpenseRequest,
  fetchExpenses,
  fetchExpenseById,
  reviewExpense,
} from '../controllers/expenseController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, checkRole('Department Head'), addExpenseRequest);
router.get('/', verifyToken, checkRole('Admin', 'Department Head'), fetchExpenses);
router.get('/:id', verifyToken, checkRole('Admin', 'Department Head'), fetchExpenseById);
router.patch('/:id/status', verifyToken, checkRole('Admin'), reviewExpense);

export default router;