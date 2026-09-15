import express from 'express';
import { addUser, fetchAllUsers, fetchUserById } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, checkRole('Admin'), addUser);
router.get('/', verifyToken, checkRole('Admin'), fetchAllUsers);
router.get('/:id', verifyToken, checkRole('Admin'), fetchUserById);

export default router;