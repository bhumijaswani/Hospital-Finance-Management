import express from 'express';
import { fetchAllDoctors, fetchDoctorById } from '../controllers/doctorController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, fetchAllDoctors);
router.get('/:id', verifyToken, fetchDoctorById);

export default router;