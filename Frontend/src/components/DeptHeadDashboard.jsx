import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import '../styles/DeptHeadDashboard.css';

const DeptHeadDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({ amount: '', reason: '' });
  const [myExpenses, setMyExpenses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMyExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setMyExpenses(res.data);
    } catch (err) {
      setError('Failed to load your requests');
    }
  };

  useEffect(() => {
    fetchMyExpenses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/expenses', {
        department: auth.department,
        amount: form.amount,
        reason: form.reason,
      });
      setForm({ amount: '', reason: '' });
      setSuccess('Request submitted successfully');
      fetchMyExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const statusClass = (status) => {
    if (status === 'Approved') return 'status-approved';
    if (status === 'Rejected') return 'status-rejected';
    return 'status-pending';
  };

  return (
    <div className="dept-dashboard">
      <h2 className="mb-1">{auth.department} — Department Dashboard</h2>
      <p className="text-muted mb-4">Logged in as {auth.name}</p>

      <div className="request-box">
        <h4>Raise a New Expense Request</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Reason</label>
            <textarea
              className="form-control"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <button type="submit" className="btn btn-primary w-100">Submit Request</button>
        </form>
      </div>

      <h4 className="mt-4">My Requests</h4>
      {myExpenses.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr><th>Amount</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {myExpenses.map(exp => (
              <tr key={exp.id}>
                <td>₹{parseFloat(exp.amount).toLocaleString('en-IN')}</td>
                <td>{exp.reason}</td>
                <td><span className={statusClass(exp.status)}>{exp.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeptHeadDashboard;