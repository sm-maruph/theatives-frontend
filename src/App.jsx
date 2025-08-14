// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home"; // Import your Home component
import ProtectedRoute from "./component/ProtectedRoute ";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        {/* Home component at root path */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />{" "}
      </Routes>
    </Router>
  );
}

export default App;
