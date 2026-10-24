// App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./component/ProtectedRoute ";
import Layout from "./component/Layout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css"; // Import global styles

/* Admin screens are code-split: they pull in xlsx / jspdf /
   html2canvas (~1 MB) that public visitors never need. */
const AdminPanel     = lazy(() => import("./pages/AdminPanel"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const ChunkFallback = () => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center",
    background: "#070404", color: "#F5E9EA", fontFamily: "monospace",
    letterSpacing: "0.18em", fontSize: "0.8rem" }}>LOADING…</div>
);

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
        <Route path="/admin" element={<Suspense fallback={<ChunkFallback />}><AdminPanel /></Suspense>} />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<ChunkFallback />}>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;