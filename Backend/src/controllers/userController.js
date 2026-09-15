import bcrypt from 'bcrypt';
import { createUser, getAllUsers, findUserById } from '../models/userModel.js';
import { logAction } from '../utils/logAction.js';

// Admin creates a new user (Billing Staff / Department Head)
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    if (!['Admin', 'Billing Staff', 'Department Head'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ name, email, password: hashedPassword, role, department });

    await logAction({
      user_id: req.user?.id || null,
      action: 'CREATE_USER',
      entity_type: 'user',
      entity_id: newUser.id,
      details: { role: newUser.role, department: newUser.department },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Postgres unique violation (duplicate email)
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

export const fetchUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};