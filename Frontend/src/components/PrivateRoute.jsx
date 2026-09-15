import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth || !auth.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;