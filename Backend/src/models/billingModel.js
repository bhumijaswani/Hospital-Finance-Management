import pool from '../database/db.js';

// Create a new bill
export const createBill = async (billData) => {
  const { patient_name, patient_contact, department, amount, description, created_by } = billData;
  const result = await pool.query(
    `INSERT INTO bills (patient_name, patient_contact, department, amount, description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [patient_name, patient_contact, department, amount, description, created_by]
  );
  return result.rows[0];
};

// Get all bills
export const getAllBills = async () => {
  const result = await pool.query('SELECT * FROM bills ORDER BY created_at DESC');
  return result.rows;
};

// Get single bill by id
export const getBillById = async (id) => {
  const result = await pool.query('SELECT * FROM bills WHERE id = $1', [id]);
  return result.rows[0];
};

// Update bill status (Pending -> Completed)
export const updateBillStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE bills SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};