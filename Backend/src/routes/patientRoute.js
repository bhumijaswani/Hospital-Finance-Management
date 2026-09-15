import express from 'express';
import { registerPatient, fetchPatientById } from '../controllers/patientController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, checkRole('Admin', 'Billing Staff'), registerPatient);
router.get('/:id', verifyToken, checkRole('Admin', 'Billing Staff', 'Department Head'), fetchPatientById);
export default router;