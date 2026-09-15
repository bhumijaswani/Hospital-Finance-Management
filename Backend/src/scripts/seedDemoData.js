import pool from '../database/db.js';

const departments = ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Neurology'];
const reasons = [
  'New diagnostic equipment purchase',
  'Staff training program',
  'Emergency ward renovation',
  'Medical supplies restock',
  'Ambulance maintenance',
  'Software license renewal',
  'Furniture replacement',
  'Lab equipment calibration',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomAmount = (min, max) => Math.floor(Math.random() * (max - min) + min);

// Random date within the last 6 months
const randomDate = () => {
  const daysAgo = Math.floor(Math.random() * 180);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const seed = async () => {
  try {
    // 1. Get existing users and doctors to reference
    const usersRes = await pool.query('SELECT id, role, department FROM users');
    const doctorsRes = await pool.query('SELECT id FROM doctors');
    const users = usersRes.rows;
    const doctors = doctorsRes.rows;

    const adminUser = users.find(u => u.role === 'Admin');
    const deptHeads = users.filter(u => u.role === 'Department Head');

    if (!adminUser || doctors.length === 0) {
      console.log('Need at least 1 Admin user and doctors seeded first. Aborting.');
      process.exit();
    }

    // 2. Seed ~40 patients + bills
    console.log('Seeding patients and bills...');
    const patientNames = [
      'Ravi Kumar', 'Sunita Sharma', 'Amit Verma', 'Priya Singh', 'Rajesh Gupta',
      'Neha Joshi', 'Vikas Yadav', 'Pooja Mehta', 'Sanjay Rao', 'Kavita Nair',
      'Manoj Tiwari', 'Anjali Kapoor', 'Deepak Malhotra', 'Rina Desai', 'Suresh Iyer',
    ];

    for (let i = 0; i < 40; i++) {
      const name = randomFrom(patientNames) + ' ' + (i + 1);
      const doctorId = randomFrom(doctors).id;
      const createdAt = randomDate();

      const patientRes = await pool.query(
        `INSERT INTO patients (name, age, gender, contact, address, blood_group, doctor_id, registration_fee, registered_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          name,
          randomAmount(5, 80),
          randomFrom(['Male', 'Female']),
          `9${randomAmount(100000000, 999999999)}`,
          'Sample Address, City',
          randomFrom(['A+', 'B+', 'O+', 'AB+', 'O-']),
          doctorId,
          100,
          adminUser.id,
          createdAt,
        ]
      );

      const patientId = patientRes.rows[0].id;
      const billStatus = Math.random() > 0.2 ? 'Completed' : 'Pending'; // 80% completed

await pool.query(
  `INSERT INTO bills (department, amount, status, patient_id, created_by, created_at)
   VALUES ($1, $2, $3, $4, $5, $6)`,
  [
    randomFrom(departments),
    randomAmount(500, 5000),
    billStatus,
    patientId, 
    adminUser.id,
    createdAt,
  ]
);
    }
    // 3. Seed ~25 expense requests (mixed statuses)
    console.log('Seeding expense requests...');
    for (let i = 0; i < 25; i++) {
      const requester = deptHeads.length > 0 ? randomFrom(deptHeads) : adminUser;
      const department = requester.department || randomFrom(departments);
      const status = randomFrom(['Pending', 'Approved', 'Approved', 'Rejected']); // weighted toward Approved
      const createdAt = randomDate();

      await pool.query(
        `INSERT INTO expenses (department, amount, reason, status, requested_by, reviewed_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          department,
          randomAmount(2000, 50000),
          randomFrom(reasons),
          status,
          requester.id,
          status !== 'Pending' ? adminUser.id : null,
          createdAt,
        ]
      );
    }

    console.log('Demo data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();