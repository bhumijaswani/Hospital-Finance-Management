import { createPatient, getPatientWithDoctor } from '../models/patientModel.js';
import { logAction } from '../utils/logAction.js';

export const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, doctor_id } = req.body;

    if (!name || !doctor_id) {
      return res.status(400).json({ message: 'Name and doctor selection are required' });
    }

    const newPatient = await createPatient({
      name, age, gender, contact, address, doctor_id,
      registration_fee: 100, // fixed, ya frontend se bhi le sakti ho
      registered_by: req.user?.id || null,
    });

    await logAction({
      user_id: req.user?.id || null,
      action: 'REGISTER_PATIENT',
      entity_type: 'patient',
      entity_id: newPatient.id,
      details: { name: newPatient.name, doctor_id: newPatient.doctor_id },
    });

    const patientWithDoctor = await getPatientWithDoctor(newPatient.id);
    res.status(201).json(patientWithDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while registering patient' });
  }
};

export const fetchPatientById = async (req, res) => {
  try {
    const patient = await getPatientWithDoctor(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching patient' });
  }
};