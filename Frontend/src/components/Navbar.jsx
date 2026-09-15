import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setAuth({});
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!auth?.role) return null; // login page pe navbar nahi dikhega

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2" style={{ background: '#1e3a5f' }}>
      <span className="text-white">Welcome, {auth.name} ({auth.role})</span>
      <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;