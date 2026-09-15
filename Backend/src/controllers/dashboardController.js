import { getDashboardSummary, getMonthlyRevenueVsExpense } from '../models/dashboardModel.js';

export const fetchDashboardSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummary();
    res.status(200).json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching dashboard summary' });
  }
};

export const fetchMonthlyChart = async (req, res) => {
  try {
    const data = await getMonthlyRevenueVsExpense();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching chart data' });
  }
};