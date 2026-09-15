import express from 'express';
import { fetchAuditLogs } from '../controllers/auditLogController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();
router.get('/', verifyToken, checkRole('Admin'), fetchAuditLogs);
export default router;