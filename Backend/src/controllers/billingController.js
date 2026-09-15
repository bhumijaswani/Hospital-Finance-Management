import { createBill, getAllBills, getBillById, updateBillStatus } from '../models/billingModel.js';

import { logAction } from '../utils/logAction.js';   

export const addBill = async (req, res) => {
  try {
    const { patient_name, patient_contact, department, amount, description } = req.body;
    if (!patient_name || !amount) {
      return res.status(400).json({ message: 'Patient name and amount are required' });
    }
    const newBill = await createBill({
      patient_name,
      patient_contact,
      department,
      amount,
      description,
      created_by: req.user?.id || null,
    });

    // Audit Log
    await logAction({
      user_id: req.user?.id || null,
      action: 'CREATE_BILL',
      entity_type: 'bill',
      entity_id: newBill.id,
      details: { patient_name: newBill.patient_name, amount: newBill.amount },
    });
    res.status(201).json(newBill);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating bill' });
  }
};
// baaki fnctions (fetchAllBills, fetchBillById) same rahenge — no log needed (GET requests)
//FetchAllBills--> FUNCTION
export const fetchAllBills = async (req, res) => {
  try {
    const bills = await getAllBills();
    res.status(200).json(bills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching bills' });
  }
};
//FetchBill By id is a function
export const fetchBillById = async (req, res) => {
  try {
    const bill = await getBillById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching bill' });
  }
};
//Changine bill status from pending to completed or vice versa
export const changeBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedBill = await updateBillStatus(req.params.id, status);
    if (!updatedBill) return res.status(404).json({ message: 'Bill not found' });
    res.status(200).json(updatedBill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};