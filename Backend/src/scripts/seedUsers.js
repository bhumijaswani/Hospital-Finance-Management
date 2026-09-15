
import bcrypt from 'bcrypt';
import pool from '../database/db.js';

const seed = async () => {
  const pass = await bcrypt.hash('password123', 10);
  await pool.query(
    `INSERT INTO users (name, email, password, role, department) VALUES
     ('Billing User', 'billing@hospital.com', $1, 'Billing Staff', null),
     ('Cardiology Head', 'cardio@hospital.com', $1, 'Department Head', 'Cardiology')`,
    [pass]
  );
  console.log('Seeded');
  process.exit();
};
seed();