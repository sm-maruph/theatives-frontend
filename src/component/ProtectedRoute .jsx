// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
