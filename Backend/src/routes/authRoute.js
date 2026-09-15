
import express from 'express';

import { login, logout, getCurrentUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyToken, getCurrentUser);

export default router;