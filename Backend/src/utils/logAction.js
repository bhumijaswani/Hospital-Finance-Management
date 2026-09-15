import { createAuditLog } from '../models/auditLogModel.js';

export const logAction = async (data) => {
  try {
    await createAuditLog(data);
  } catch (err) {
    console.error('Audit log failed:', err); // silently log, don't break main flow
  }
};