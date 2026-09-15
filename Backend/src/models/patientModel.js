import pool from '../database/db.js';

export const createPatient = async (data) => {
  const { name, age, gender, contact, address, doctor_id, registration_fee, registered_by } = data;
  const result = await pool.query(
    `INSERT INTO patients (name, age, gender, contact, address, doctor_id, registration_fee, registered_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, age, gender, contact, address, doctor_id, registration_fee, registered_by]
  );
  return result.rows[0];
};

export const getPatientWithDoctor = async (id) => {
  const result = await pool.query(
    `SELECT p.*, d.name AS doctor_name, d.specialization, d.consultation_fee
     FROM patients p
     JOIN doctors d ON p.doctor_id = d.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};