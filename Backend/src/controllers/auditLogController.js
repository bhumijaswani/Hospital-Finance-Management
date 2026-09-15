import { getAllAuditLogs } from '../models/auditlogModel.js';

export const fetchAuditLogs = async (req, res) => {
  try {
    const logs = await getAllAuditLogs();
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching audit logs' });
  }
};