import pool from '../database/db.js';

// Create new user (signup)
export const createUser = async (userData) => {
  const { name, email, password, role, department } = userData;
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, department)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, department, created_at`,
    [name, email, password, role, department]
  );
  return result.rows[0];
};
// Find user by email (login)
export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
// Find user by id
export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, department, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Get all users (Admin use case)
export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, role, department, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};