// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

// ⚠️ DEV BYPASS — set to false when your real login/backend is ready.
const DEV_BYPASS = true;

// Structurally valid JWT: { id:1, username:"admin", role:"admin", exp:9999999999 }
// exp is year 2286, so jwtDecode() + the exp check in AdminDashboard both pass.
const DUMMY_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.dev-dummy-signature";

const ProtectedRoute = ({ children }) => {
  let token = localStorage.getItem('token');

  if (DEV_BYPASS && !token) {
    localStorage.setItem('token', DUMMY_TOKEN); // seed it so the rest of the app has a token to read
    token = DUMMY_TOKEN;
  }

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;