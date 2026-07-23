import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getFullUrl } from "../utils/apiUrl";
const BASE_PATH = "/api/auth/login";
import './css/AdminPanel.css';

// ⚠️ DEV LOGIN — set to false when your real backend is ready.
const DEV_LOGIN = true;
const DEV_USER = "admin";
const DEV_PASS = "admin123";
// Same structurally-valid dummy JWT used in ProtectedRoute.
const DUMMY_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.dev-dummy-signature";

function AdminPanel() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ---- DEV LOGIN (delete this block when backend is ready) ----
    if (DEV_LOGIN) {
      await new Promise((r) => setTimeout(r, 400)); // mimic a network call
      if (formData.username === DEV_USER && formData.password === DEV_PASS) {
        localStorage.setItem('token', DUMMY_TOKEN);
        setIsLoading(false);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
      return;
    }

    // ---- REAL BACKEND (uncomment when ready) ----
    try {
      const res = await axios.post(getFullUrl(BASE_PATH), formData);
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      // backend sends { error: '...' } so read err.response.data.error
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;