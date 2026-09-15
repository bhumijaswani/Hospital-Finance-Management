import { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const summaryRes = await axios.get('/api/dashboard/summary');
      setSummary(summaryRes.data);

      const expensesRes = await axios.get('/api/expenses');
      const pending = expensesRes.data.filter(e => e.status === 'Pending');
      setPendingExpenses(pending);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (id, status) => {
    try {
      await axios.patch(`/api/expenses/${id}/status`, { status });
      fetchData(); // refresh after action
    } catch (err) {
      alert('Failed to update expense status');
    }
  };

  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (!summary) return <p className="text-center mt-4">Loading dashboard...</p>;

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="summary-cards">
        <div className="summary-card revenue">
          <p className="card-label">Total Revenue</p>
          <p className="card-value">₹{summary.total_revenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card expense">
          <p className="card-label">Total Expense</p>
          <p className="card-value">₹{summary.total_expense.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card balance">
          <p className="card-label">Net Balance</p>
          <p className="card-value">₹{summary.net_balance.toLocaleString('en-IN')}</p>
        </div>
        <div className="summary-card pending">
          <p className="card-label">Pending Requests</p>
          <p className="card-value">{summary.pending_expense_requests.count}</p>
        </div>
      </div>

      <h3 className="section-heading">Pending Expense Requests</h3>
      {pendingExpenses.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingExpenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.department}</td>
                <td>₹{parseFloat(exp.amount).toLocaleString('en-IN')}</td>
                <td>{exp.reason}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleReview(exp.id, 'Approved')}>
                    Approve
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReview(exp.id, 'Rejected')}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="section-heading">Department-wise Expense Breakdown</h3>
      <table className="expense-table">
        <thead>
          <tr><th>Department</th><th>Total Spent</th></tr>
        </thead>
        <tbody>
          {summary.department_breakdown.map((row, idx) => (
            <tr key={idx}>
              <td>{row.department}</td>
              <td>₹{parseFloat(row.total_spent).toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;