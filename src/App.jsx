// App.jsx
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./component/ProtectedRoute ";
import Layout from "./component/Layout";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css"; // Import global styles

/* Admin screens are code-split. They pull in xlsx / jspdf /
   jspdf-autotable / html2canvas (~1.4 MB) which public visitors
   never need — Vite now emits those as separate chunks that only
   download when someone actually opens an /admin route. */
const AdminPanel     = lazy(() => import("./pages/AdminPanel"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/* lightweight fallback while an admin chunk downloads.
   Swap for your <Loader /> if you'd rather reuse it. */
const ChunkFallback = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#070404",
      color: "#F5E9EA",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.18em",
      fontSize: "0.8rem",
      textTransform: "uppercase",
    }}
  >
    Loading…
  </div>
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

        {/* Admin Routes — lazily loaded */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<ChunkFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
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