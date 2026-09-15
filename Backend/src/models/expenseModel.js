import pool from '../database/db.js';

// Create new expense request (Department Head)
export const createExpenseRequest = async (data) => {
  const { department, amount, reason, requested_by } = data;
  const result = await pool.query(
    `INSERT INTO expenses (department, amount, reason, requested_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [department, amount, reason, requested_by]
  );
  return result.rows[0];
};

// Get all expense requests (Admin view)
export const getAllExpenses = async () => {
  const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
  return result.rows;
};

// Get single expense by id
export const getExpenseById = async (id) => {
  const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
  return result.rows[0];
};

// Get expenses by department (Department Head apni requests dekhe)
export const getExpensesByDepartment = async (department) => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE department = $1 ORDER BY created_at DESC',
    [department]
  );
  return result.rows;
};

// Update status (Admin approve/reject)
export const updateExpenseStatus = async (id, status, reviewed_by) => {
  const result = await pool.query(
    `UPDATE expenses SET status = $1, reviewed_by = $2 WHERE id = $3 RETURNING *`,
    [status, reviewed_by, id]
  );
  return result.rows[0];
};