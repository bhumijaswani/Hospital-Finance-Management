import { createContext, useState, useEffect } from "react";
import axios from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = function (props) {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setAuth(res.data.user);
      } catch (err) {
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