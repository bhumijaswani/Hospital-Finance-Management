import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";
import '../styles/RegisterPatient.css';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '', age: '', gender: '', contact: '', address: '', blood_group: '', doctor_id: ''
  });
  const [consultationFee, setConsultationFee] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get('/api/doctors');
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setForm({ ...form, doctor_id: doctorId });
    const selectedDoctor = doctors.find(d => d.id === parseInt(doctorId));
    setConsultationFee(selectedDoctor ? parseFloat(selectedDoctor.consultation_fee) : 0);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isFormValid = form.name.trim() !== '' && form.gender !== '' && form.contact.trim() !== '' && form.doctor_id !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/patients', form);
      navigate(`/receipt/${res.data.id}`);   // ← YAHAN redirect ho raha hai
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  return (
    <div className="register-page">
      <div className="hospital-header">
        <h2>ABC HOSPITAL</h2>
      </div>

      <div className="register-box">
        <h3 className="mb-3">Patient Registration</h3>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label htmlFor="name">Patient Name *</label>
            <input
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter patient name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="age">Age</label>
            <input
              className="form-control"
              id="age"
              name="age"
              type="number"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="gender">Gender *</label>
            <select className="form-control" id="gender" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="contact">Contact Number *</label>
            <input
              className="form-control"
              id="contact"
              name="contact"
              placeholder="Enter contact number"
              value={form.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="address">Address</label>
            <input
              className="form-control"
              id="address"
              name="address"
              placeholder="Enter address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="blood_group">Blood Group</label>
            <select className="form-control" id="blood_group" name="blood_group" value={form.blood_group} onChange={handleChange}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="doctor_id">Select Doctor *</label>
            <select className="form-control" id="doctor_id" name="doctor_id" value={form.doctor_id} onChange={handleDoctorChange} required>
              <option value="">Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialization} (₹{doc.consultation_fee})
                </option>
              ))}
            </select>
          </div>

          {consultationFee > 0 && (
            <p className="fee-preview"><strong>Consultation Fee:</strong> ₹{consultationFee}</p>
          )}

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-success w-100" disabled={!isFormValid}>
            Register & Generate Receipt
          </button>
        </form>
      </div>

    </div>
  );
};
export default RegisterPatient;