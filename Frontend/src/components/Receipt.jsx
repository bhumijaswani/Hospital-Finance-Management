import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/Receipt.css';

const Receipt = () => {
  const { patientId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`/api/patients/${patientId}`);
        setData(res.data);
      } catch (err) {
        setError('Could not load receipt');
      }
    };
    fetchPatient();
  }, [patientId]);

  const handlePrint = () => window.print();

  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (!data) return <p className="text-center mt-4">Loading receipt...</p>;

  const total = parseFloat(data.registration_fee) + parseFloat(data.consultation_fee);
  const receiptDate = new Date(data.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const receiptTime = new Date(data.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
  <div>
    <div className="receipt-box" id="receipt-print-area">
      <div className="receipt-header">

      </div>

      <div className="receipt-body">
        <h3 className="receipt-title">Registration Receipt</h3>

        <div className="receipt-meta">
          <div>
            <p><strong>Receipt No.</strong> : REG-{data.id}</p>
            <p><strong>Date</strong> : {receiptDate}</p>
            <p><strong>Time</strong> : {receiptTime}</p>
          </div>
          <div>
            <p><strong>Patient ID</strong> : PAT-{data.id}</p>
          </div>
        </div>

        <h4 className="section-title">Patient Details</h4>
        <div className="section-content">
          <p><strong>Name</strong> : {data.name}</p>
          <p><strong>Age / Gender</strong> : {data.age} Yrs / {data.gender}</p>
          <p><strong>Contact No.</strong> : {data.contact}</p>
          <p><strong>Address</strong> : {data.address}</p>
          {data.blood_group && <p><strong>Blood Group</strong> : {data.blood_group}</p>}
        </div>

        <h4 className="section-title">Doctor Details</h4>
        <div className="section-content">
          <p><strong>Doctor Name</strong> : {data.doctor_name}</p>
          <p><strong>Specialization</strong> : {data.specialization}</p>
        </div>

        <h4 className="section-title">Payment Details</h4>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Registration Fee</td>
              <td>{parseFloat(data.registration_fee).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Consultation Fee ({data.doctor_name})</td>
              <td>{parseFloat(data.consultation_fee).toFixed(2)}</td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Amount</strong></td>
              <td><strong>₹ {total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <p className="paid-status">✓ PAID</p>
        <div className="receipt-footer">
          <p className="thank-you">Thank you for choosing ABC Hospital. We wish you good health!</p>
        </div>
      </div>
    </div>

    <div className="text-center">
      <button className="btn btn-primary mt-3 no-print" onClick={handlePrint}>
        Download / Print Receipt
      </button>
    </div>
  </div>
);
};

export default Receipt;