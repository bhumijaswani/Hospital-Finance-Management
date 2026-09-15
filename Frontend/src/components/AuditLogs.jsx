import { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../styles/AuditLogs.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/audit-logs');
        setLogs(res.data);
      } catch (err) {
        setError('Failed to load audit logs');
      }
    };
    fetchLogs();
  }, []);

  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="audit-logs-page">
      <h2>Audit Logs</h2>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>User</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString('en-IN')}</td>
              <td>{log.user_name || 'Unknown'}</td>
              <td>{log.action}</td>
              <td>{log.entity_type} #{log.entity_id}</td>
              <td>{log.details ? JSON.stringify(log.details) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;