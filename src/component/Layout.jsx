// component/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Loader from "./Loader";

const Layout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 5s loading
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader text="theatives" /> : <Outlet />;
};

export default Layout;