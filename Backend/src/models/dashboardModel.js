import pool from '../database/db.js';

export const getDashboardSummary = async () => {
  // Total revenue = sum of completed bills
  const revenueResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_revenue FROM bills WHERE status = 'Completed'`
  );

  // Total pending billing (not yet collected)
  const pendingBillingResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS pending_billing FROM bills WHERE status = 'Pending'`
  );

  // Total approved expenses
  const expenseResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_expense FROM expenses WHERE status = 'Approved'`
  );

  // Pending expense requests awaiting Admin review
  const pendingExpenseResult = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS pending_requests, COUNT(*) AS pending_count 
     FROM expenses WHERE status = 'Pending'`
  );

  // Department-wise expense breakdown (Approved only)
  const departmentBreakdownResult = await pool.query(
    `SELECT department, SUM(amount) AS total_spent 
     FROM expenses WHERE status = 'Approved' 
     GROUP BY department ORDER BY total_spent DESC`
  );

  const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue);
  const totalExpense = parseFloat(expenseResult.rows[0].total_expense);

  return {
    total_revenue: totalRevenue,
    pending_billing: parseFloat(pendingBillingResult.rows[0].pending_billing),
    total_expense: totalExpense,
    net_balance: totalRevenue - totalExpense,
    pending_expense_requests: {
      count: parseInt(pendingExpenseResult.rows[0].pending_count),
      amount: parseFloat(pendingExpenseResult.rows[0].pending_requests),
    },
    department_breakdown: departmentBreakdownResult.rows,
  };
};
// Monthly revenue vs expense trend for chart
export const getMonthlyRevenueVsExpense = async () => {
  const revenueByMonth = await pool.query(`
    SELECT TO_CHAR(created_at, 'Mon YYYY') AS month, 
           DATE_TRUNC('month', created_at) AS sort_date,
           SUM(amount) AS revenue
    FROM bills
    WHERE status = 'Completed'
    GROUP BY month, sort_date
    ORDER BY sort_date
  `);

  const expenseByMonth = await pool.query(`
    SELECT TO_CHAR(created_at, 'Mon YYYY') AS month, 
           DATE_TRUNC('month', created_at) AS sort_date,
           SUM(amount) AS expense
    FROM expenses
    WHERE status = 'Approved'
    GROUP BY month, sort_date
    ORDER BY sort_date
  `);

  // Merge both results into a single array, keyed by month
  const merged = {};
  revenueByMonth.rows.forEach(row => {
    merged[row.month] = { month: row.month, revenue: parseFloat(row.revenue), expense: 0 };
  });
  expenseByMonth.rows.forEach(row => {
    if (merged[row.month]) {
      merged[row.month].expense = parseFloat(row.expense);
    } else {
      merged[row.month] = { month: row.month, revenue: 0, expense: parseFloat(row.expense) };
    }
  });
  return Object.values(merged);
};