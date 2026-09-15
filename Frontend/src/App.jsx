import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import RegisterPatient from './components/RegisterPatient';
import Receipt from './components/Receipt';
import AdminDashboard from './components/AdminDashboard';
import DeptHeadDashboard from './components/DeptHeadDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AuditLogs from './components/AuditLogs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin-dashboard" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/audit-logs" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <AuditLogs />
            </PrivateRoute>
          } />

          <Route path="/dept-dashboard" element={
            <PrivateRoute allowedRoles={['Department Head']}>
              <DeptHeadDashboard />
            </PrivateRoute>
          } />

          <Route path="/register-patient" element={
            <PrivateRoute allowedRoles={['Admin', 'Billing Staff']}>
              <RegisterPatient />
            </PrivateRoute>
          } />

          <Route path="/receipt/:patientId" element={
            <PrivateRoute allowedRoles={['Admin', 'Billing Staff']}>
              <Receipt />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;