import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getFullUrl } from "../utils/apiUrl";
const BASE_PATH = "/api/auth/logout";
import {
  FiLogOut,
  FiGrid,
  FiSettings,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";
import "./css/AdminDashboard.css";
import AdminService from "../component/AdminSubcomponent/AdminService";
import AdminWorks from "../component/AdminSubcomponent/AdminWorks";
import AdminCareer from "../component/AdminSubcomponent/AdminCareer";
import AdminReviews from "../component/AdminSubcomponent/AdminReviews";
import AdminClient from "../component/AdminSubcomponent/AdminClient";
import AdminGallery from "../component/AdminSubcomponent/AdminGallery";
import AdminBlog from "../component/AdminSubcomponent/AdminBlog";
import AdminNews from "../component/AdminSubcomponent/AdminNews";
import AdminMicroService from "../component/AdminSubcomponent/AdminMicroService";
import AdminShowcase from "../component/AdminSubcomponent/AdminShowcase";
import AdminMember from "../component/AdminSubcomponent/AdminMember";
function AdminDashboard() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        console.warn("Token expired");
        localStorage.removeItem("token");
        navigate("/admin");
      }
    } catch (err) {
      console.error("Token decoding failed", err);
      localStorage.removeItem("token");
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      await axios.post(
        getFullUrl(BASE_PATH),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout failed on server:", err.message);
    } finally {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "service":
        return <AdminService />;
      case "microservice":
        return <AdminMicroService />;
      case "works":
        return <AdminWorks />;
      case "career":
        return <AdminCareer />;
      case "reviews":
        return <AdminReviews />;
      case "client":
        return <AdminClient />;
      case "gallery":
        return <AdminGallery />;
      case "blog":
        return <AdminBlog />;
      case "news":
        return <AdminNews />;
      case "showcase":
        return <AdminShowcase />;
        case "member":
        return <AdminMember />;

      default:
        return (
          <div className="dashboard-content">
            <h1 className="welcome-title">Welcome Back, Admin!</h1>
            <p className="welcome-subtitle">
              What would you like to manage today?
            </p>

            <div className="card-grid">
              <DashboardCard
                icon={<FiSettings size={24} color="white" />}
                title="Services"
                description="Manage your service offerings"
                onClick={() => setActiveComponent("service")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiSettings size={24} color="white" />}
                title="Micro-services"
                description="Manage your micro-service offerings"
                onClick={() => setActiveComponent("microservice")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiBriefcase size={24} color="white" />}
                title="Works"
                description="Manage portfolio projects"
                onClick={() => setActiveComponent("works")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Careers"
                description="Manage job postings"
                onClick={() => setActiveComponent("career")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Reviews"
                description="Manage your client reviews"
                onClick={() => setActiveComponent("reviews")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Clients"
                description="Manage your clients"
                onClick={() => setActiveComponent("client")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Gallery"
                description="Manage your gallery"
                onClick={() => setActiveComponent("gallery")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Blog"
                description="Manage blog postings"
                onClick={() => setActiveComponent("blog")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Showcase"
                description="Manage Showcase postings"
                onClick={() => setActiveComponent("showcase")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Blog"
                description="Manage blog postings"
                onClick={() => setActiveComponent("blog")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="Member"
                description="Manage your members"
                onClick={() => setActiveComponent("member")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              />
              {/* <DashboardCard
                icon={<FiUsers size={24} color="white" />}
                title="News"
                description="Manage News postings"
                onClick={() => setActiveComponent("news")}
                color="#6366f1" // Background and default text color
                titleColor="#ffffff" // White title
                descriptionColor="#e0e0e0" // Light gray description
              /> */}
            </div>
          </div>
        );
    }
  };
  const DashboardCard = ({
    icon,
    title,
    description,
    onClick,
    color = "#6366f1", // Default color if none provided
    titleColor, // Optional specific title color
    descriptionColor, // Optional specific description color
  }) => (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{
        "--card-color": color,
        "--title-color": titleColor || "inherit",
        "--description-color": descriptionColor || "inherit",
      }}
    >
      <div className="card-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <div className="card-hover-effect"></div>
    </div>
  );

  return (
    <div className={`admin-app ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">
            Admin<span>Panel</span>
          </h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◄" : "►"}
          </button>
        </div>

        <div className="sidebar-container">
          <nav className="sidebar-nav">
            <nav className="sidebar-nav">
              <NavItem
                icon={<FiGrid />}
                label="Dashboard"
                active={activeComponent === "dashboard"}
                onClick={() => setActiveComponent("dashboard")}
              />
              <NavItem
                icon={<FiSettings />}
                label="Services"
                active={activeComponent === "service"}
                onClick={() => setActiveComponent("service")}
              />
              <NavItem
                icon={<FiSettings />}
                label="Micro-Services"
                active={activeComponent === "microservice"}
                onClick={() => setActiveComponent("microservice")}
              />
              <NavItem
                icon={<FiBriefcase />}
                label="Works"
                active={activeComponent === "works"}
                onClick={() => setActiveComponent("works")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Careers"
                active={activeComponent === "career"}
                onClick={() => setActiveComponent("career")}
              />
              <NavItem
                icon={<FiUsers />} // You can replace icons with something more suitable
                label="Reviews"
                active={activeComponent === "reviews"}
                onClick={() => setActiveComponent("reviews")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Clients"
                active={activeComponent === "client"}
                onClick={() => setActiveComponent("client")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Gallery"
                active={activeComponent === "gallery"}
                onClick={() => setActiveComponent("gallery")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Blog"
                active={activeComponent === "blog"}
                onClick={() => setActiveComponent("blog")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Showcase"
                active={activeComponent === "showcase"}
                onClick={() => setActiveComponent("showcase")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Blog"
                active={activeComponent === "blog"}
                onClick={() => setActiveComponent("blog")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Member"
                active={activeComponent === "member"}
                onClick={() => setActiveComponent("member")}
              />
              {/* <NavItem
            icon={<FiUsers />}
            label="News"
            active={activeComponent === "news"}
            onClick={() => setActiveComponent("news")}
          /> */}
            </nav>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-bar">
          <h1 className="page-title">
            {activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}
          </h1>
          <div className="user-info">
            <div className="avatar">A</div>
            <span>Administrator</span>
          </div>
        </header>

        <div className="content-area">{renderComponent()}</div>
      </div>
    </div>
  );
}

// Reusable Components
const DashboardCard = ({ icon, title, description, onClick, color }) => (
  <div
    className="dashboard-card"
    onClick={onClick}
    style={{ "--card-color": color }}
  >
    <div className="card-icon" style={{ baczkgroundColor: `${color}20` }}>
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="card-hover-effect"></div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </button>
);

export default AdminDashboard;
