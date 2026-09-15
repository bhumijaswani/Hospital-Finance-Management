import express from 'express';
import { addBill, fetchAllBills, fetchBillById, changeBillStatus } from '../controllers/billingController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, checkRole('Admin', 'Billing Staff'), addBill);
router.get('/', verifyToken, checkRole('Admin', 'Billing Staff'), fetchAllBills);
router.get('/:id', verifyToken, checkRole('Admin', 'Billing Staff'), fetchBillById);
router.patch('/:id/status', verifyToken, checkRole('Admin', 'Billing Staff'), changeBillStatus);

export default router;