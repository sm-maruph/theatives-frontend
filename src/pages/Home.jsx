import React, { useState } from "react";
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
import logoHover from '../assets/images/logo_hover.png'; // or any hover logo


function Home() {
  const [activeSection, setActiveSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);


  const handleSectionClick = (section) => {
    if (isAnimating || activeSection) return;
    setIsAnimating(true);
    setActiveSection(section);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSection(null);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const getPushDirection = (section) => {
    if (!activeSection) return "";

    const pushMap = {
      about: {
        service: "push-top-right",
        works: "push-bottom-left",
        contact: "push-bottom-right",
        diamond: "push-bottom-right",
      },
      service: {
        about: "push-top-left",
        works: "push-bottom-left",
        contact: "push-bottom-right",
        diamond: "push-bottom-left",
      },
      works: {
        about: "push-top-left",
        service: "push-top-right",
        contact: "push-bottom-right",
        diamond: "push-top-right",
      },
      contact: {
        about: "push-top-left",
        service: "push-top-right",
        works: "push-bottom-left",
        diamond: "push-top-left",
      },
    };

    return pushMap[activeSection][section] || "";
  };

  return (
    <div className="app-container">
      {/* Background Sections */}
      <div
        className={`section about ${
          activeSection === "about" ? "active" : ""
        } ${getPushDirection("about")}`}
        onClick={() => handleSectionClick("about")}
      >
        <div
          className="image-container"
          style={{ backgroundImage: `url(${aboutBg})` }}
        ></div>
      </div>

      <div
        className={`section service ${
          activeSection === "service" ? "active" : ""
        } ${getPushDirection("service")}`}
        onClick={() => handleSectionClick("service")}
      >
        <div
          className="image-container"
          style={{ backgroundImage: `url(${serviceBg})` }}
        ></div>
      </div>

      <div
        className={`section works ${
          activeSection === "works" ? "active" : ""
        } ${getPushDirection("works")}`}
        onClick={() => handleSectionClick("works")}
      >
        <div
          className="image-container"
          style={{ backgroundImage: `url(${worksBg})` }}
        ></div>
      </div>

      <div
        className={`section contact ${
          activeSection === "contact" ? "active" : ""
        } ${getPushDirection("contact")}`}
        onClick={() => handleSectionClick("contact")}
      >
        <div
          className="image-container"
          style={{ backgroundImage: `url(${contactBg})` }}
        ></div>
      </div>

      {/* Diamond Logo */}
      <div className={`center-diamond ${getPushDirection("diamond")}`}>
        <div className="diamond-shape">
          <div
            className="center-logo"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img src={isLogoHovered ? logoHover : logo} alt="Logo" />
          </div>
        </div>
      </div>

      {/* Active Content Overlay */}
      {activeSection && (
        <div className="content-overlay">
          <button className="close-btn" onClick={handleClose}>
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

      {/* Bottom Contact Button - Only shown when no section is active */}
      {<BottomContact />}
    </div>
  );
}

export default Home;
