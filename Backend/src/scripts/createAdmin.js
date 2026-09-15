import bcrypt from 'bcrypt';
import pool from '../database/db.js';

const createAdmin=async()=>{
  const hashedPassword= await bcrypt.hash('admin123',10);
  await pool.query( `INSERT INTO users (name, email, password, role, department)
  VALUES ($1, $2, $3, $4, $5)`, ['Admin User', 'admin@hospital.com', hashedPassword, 'Admin', null] );
  
   console.log('Admin created successfully');
   process.exit();
}
createAdmin();