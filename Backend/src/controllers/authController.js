import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/userModel.js';

import { findUserById } from '../models/userModel.js';

export const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id); // req.user.id JWT se aaya
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   return res.status(400).json({ message: 'Email and password are required' });
    // }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    }); 
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');

  res.status(200).json({ message: 'Logged out successfully' });
};