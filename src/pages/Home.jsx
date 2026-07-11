import React, { useState, useEffect } from "react";
import "../../src/app.css";
import { FaTimes } from "react-icons/fa";
import About from "../component/About";
import Services from "../component/Services";
import Works from "../component/Works";
import BlogHome from "../component/BlogHome";
import BottomContact from "../component/BottomContact";

// Import images
import aboutBg from "../assets/images/about.png";
import serviceBg from "../assets/images/service.png";
import worksBg from "../assets/images/work.png";
import contactBg from "../assets/images/blog.png";
import logo from "../assets/images/theatives_logo.png";
import logoHover from "../assets/images/logo_hover.png";
import { useNavigate, useLocation } from "react-router-dom";

function Home() {
  const [activeSection, setActiveSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    const validSections = ["about", "service", "works", "contact"];
    if (validSections.includes(path)) {
      setActiveSection(path);
    }
  }, [location.pathname]);

  const handleSectionClick = (section) => {
    if (isAnimating || activeSection) return;
    setIsAnimating(true);
    setActiveSection(section);
    navigate(`/${section}`);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSection(null);
    navigate("/");
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const getPushDirection = (section) => {
    if (!activeSection) return "";
    const pushMap = {
      about:   { service: "push-top-right", works: "push-bottom-left", contact: "push-bottom-right", diamond: "push-bottom-right" },
      service: { about: "push-top-left", works: "push-bottom-left", contact: "push-bottom-right", diamond: "push-bottom-left" },
      works:   { about: "push-top-left", service: "push-top-right", contact: "push-bottom-right", diamond: "push-top-right" },
      contact: { about: "push-top-left", service: "push-top-right", works: "push-bottom-left", diamond: "push-top-left" },
    };
    return pushMap[activeSection][section] || "";
  };

  const tiles = [
    { key: "about",   bg: aboutBg,   label: "About" },
    { key: "service", bg: serviceBg, label: "Services" },
    { key: "works",   bg: worksBg,   label: "Works" },
    { key: "contact", bg: contactBg, label: "Blog" },
  ];

  return (
    <div className="app-container">
      {/* Background Sections */}
      {tiles.map((t) => (
        <div
          key={t.key}
          className={`section ${t.key} ${activeSection === t.key ? "active" : ""} ${getPushDirection(t.key)}`}
          onClick={() => handleSectionClick(t.key)}
        >
          <div
            className="image-container"
            data-label={t.label}
            style={{ backgroundImage: `url(${t.bg})` }}
          ></div>
        </div>
      ))}

      {/* Diamond Logo */}
      <div className={`center-diamond ${getPushDirection("diamond")}`}>
        <div className="diamond-shape">
          <div
            className="center-logo"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img src={isLogoHovered ? logoHover : logo} alt="Theatives" />
          </div>
        </div>
      </div>

      {/* Active Content Overlay */}
      {activeSection && (
        <div className="content-overlay">
          <button className="close-btn" onClick={handleClose} aria-label="Close">
            <FaTimes />
          </button>
          <div className="content-container">
            {activeSection === "about" && <About />}
            {activeSection === "service" && <Services />}
            {activeSection === "works" && <Works />}
            {activeSection === "contact" && <BlogHome />}
          </div>
        </div>
      )}

      <BottomContact />
    </div>
  );
}

export default Home;