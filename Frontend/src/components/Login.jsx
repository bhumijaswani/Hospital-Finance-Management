import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "../api/axios";
import '../styles/Login.css';

import { useNavigate } from 'react-router-dom';
function Login() {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pass]);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrMsg('');
  try {
    const response = await axios.post(
      '/api/auth/login',
      JSON.stringify({ email, password: pass }),
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setAuth(userData);

    // Role based redirecting
    if (userData.role === 'Admin') {
      navigate('/admin-dashboard');
    } else if (userData.role === 'Department Head') {
      navigate('/dept-dashboard');
    } else if (userData.role === 'Billing Staff') {
      navigate('/register-patient');
    }
  } catch (err) {
    if (!err.response) setErrMsg('No server response');
    else if (err.response.status === 401) setErrMsg('Invalid email or password');
    else setErrMsg('Login failed');
    errRef.current.focus();
  }
};
  return (
    <section className="login-page">
      <div className="login-box">
        <p ref={errRef} className={errMsg ? "errMsg" : "d-none"} aria-live="assertive">{errMsg}</p>
        <h1 className="text-center text-white mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="text-white">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="text-white">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success w-100">Sign In</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;