import pool from '../database/db.js';

export const createAuditLog = async ({ user_id, action, entity_type, entity_id, details }) => {
  await pool.query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [user_id, action, entity_type, entity_id, details || null]
  );
};

export const getAllAuditLogs = async () => {
  const result = await pool.query(
    `SELECT al.*, u.name AS user_name 
     FROM audit_logs al 
     LEFT JOIN users u ON al.user_id = u.id 
     ORDER BY al.created_at DESC`
  );
  return result.rows;
};