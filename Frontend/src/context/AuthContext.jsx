import { createContext, useState, useEffect } from "react";
import axios from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = function (props) {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;   // token hi nahi hai toh API call mat karo
      }

      try {
        const res = await axios.get('/api/auth/me');
        setAuth(res.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setAuth({});
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;