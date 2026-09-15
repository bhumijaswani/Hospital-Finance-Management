import pool from '../database/db.js';

export const getAllDoctors=async()=>{
  const result=await pool.query('SELECT id,name,specialization,consultation_fee FROM doctors ORDER BY name');
  return result.rows;
};

export const getDoctorById=async(id)=>{
  const result=await pool.query('SELECT * FROM doctors WHERE id=$1',[id]);
  return result.rows[0];
};
