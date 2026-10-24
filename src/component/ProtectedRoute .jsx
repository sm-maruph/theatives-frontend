import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token || token.endsWith('.dev-dummy-signature')) {
    localStorage.removeItem('token');
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
