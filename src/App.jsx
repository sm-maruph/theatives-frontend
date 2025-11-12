// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import ProtectedRoute from "./component/ProtectedRoute ";
import Layout from "./component/Layout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css"; // Import global styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared Layout with Loader for Home and related routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/service" element={<Home />} />
          <Route path="/works" element={<Home />} />
          <Route path="/contact" element={<Home />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;