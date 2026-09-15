import {
  createExpenseRequest,
  getAllExpenses,
  getExpenseById,
  getExpensesByDepartment,
  updateExpenseStatus,
} from '../models/expenseModel.js';

import { logAction } from '../utils/logAction.js';   

// Department Head creates a new expense request
export const addExpenseRequest = async (req, res) => {
  try {
    const { department, amount, reason } = req.body;

    if (!department || !amount || !reason) {
      return res.status(400).json({ message: 'Department, amount and reason are required' });
    }

    const newExpense = await createExpenseRequest({
      department,
      amount,
      reason,
      requested_by: req.user.id ,
    });

    // Audit Log
    await logAction({
      user_id: req.user.id,
      action: 'CREATE_EXPENSE_REQUEST',
      entity_type: 'expense',
      entity_id: newExpense.id,
      details: { department: newExpense.department, amount: newExpense.amount, reason: newExpense.reason },
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating expense request' });
  }
};

//No Audit Log on Fetch
export const fetchExpenses = async (req, res) => {
  try {
    const { role, department } = req.user ||{};
    let expenses;
    if (role === 'Admin') {
      expenses = await getAllExpenses();
    } else if (role === 'Department Head') {
      expenses = await getExpensesByDepartment(department);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
};

export const fetchExpenseById = async (req, res) => {
  try {
    const expense = await getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const { role, department } = req.user||{} ;
    if (role === 'Department Head' && expense.department !== department) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching expense' });
  }
};

// Admin approves/rejects Audit Log
export const reviewExpense = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedExpense = await updateExpenseStatus(req.params.id, status, req.user.id);
    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });

    // Audit LOG
    await logAction({
      user_id: req.user.id,
      action: status === 'Approved' ? 'APPROVE_EXPENSE' : 'REJECT_EXPENSE',
      entity_type: 'expense',
      entity_id: updatedExpense.id,
      details: { department: updatedExpense.department, amount: updatedExpense.amount },
    });

    res.status(200).json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating expense status' });
  }
};