import React, { useState, useEffect } from "react";
import "../App.css";
import { FaTimes } from "react-icons/fa";
import About from "../component/About";
import Services from "../component/Services";
import Works from "../component/Works";
import BlogHome from "../component/BlogHome";
import BottomContact from "../component/BottomContact";
import logo from "../assets/images/theatives_logo.png";
import logoHover from "../assets/images/logo_hover.png";
import { useNavigate, useLocation } from "react-router-dom";

/* ================= Panel hero icons ================= */

const AboutIcon = () => (
  <svg viewBox="0 0 200 200" fill="none">
    <polygon points="100,20 165,58 165,142 100,180 35,142 35,58"
      stroke="#FF3355" strokeWidth="5" fill="rgba(255,51,85,0.12)" />
    <circle cx="100" cy="88" r="24" stroke="#F5E9EA" strokeWidth="5" fill="none" />
    <path d="M60 150 q40 -34 80 0" stroke="#F5E9EA" strokeWidth="5" fill="none" />
    <line x1="35" y1="100" x2="165" y2="100" stroke="#FF3355" strokeWidth="3.5" opacity="0.9">
      <animate attributeName="y1" values="58;142;58" dur="3s" repeatCount="indefinite" />
      <animate attributeName="y2" values="58;142;58" dur="3s" repeatCount="indefinite" />
    </line>
  </svg>
);

const ServiceIcon = () => (
  <svg viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="14" fill="#C81E3A" />
    <g>
      <ellipse cx="100" cy="100" rx="70" ry="26" stroke="#C81E3A" strokeWidth="4" fill="none" />
      <circle cx="170" cy="100" r="9" fill="#F5E9EA" />
      <animateTransform attributeName="transform" type="rotate"
        from="0 100 100" to="360 100 100" dur="6s" repeatCount="indefinite" />
    </g>
    <g transform="rotate(60 100 100)">
      <ellipse cx="100" cy="100" rx="70" ry="26" stroke="#FF3355" strokeWidth="4" fill="none" opacity="0.85" />
      <circle cx="30" cy="100" r="8" fill="#FF3355" />
      <animateTransform attributeName="transform" type="rotate"
        from="60 100 100" to="420 100 100" dur="8s" repeatCount="indefinite" />
    </g>
    <g transform="rotate(120 100 100)">
      <ellipse cx="100" cy="100" rx="70" ry="26" stroke="#B81530" strokeWidth="4" fill="none" opacity="0.7" />
      <circle cx="170" cy="100" r="7" fill="#B81530" />
      <animateTransform attributeName="transform" type="rotate"
        from="120 100 100" to="480 100 100" dur="10s" repeatCount="indefinite" />
    </g>
  </svg>
);

const WorksIcon = () => (
  <svg viewBox="0 0 200 200" fill="none">
    <rect x="30" y="45" width="140" height="110" rx="8" stroke="#FF5C46" strokeWidth="5" fill="rgba(255,92,70,0.1)" />
    <rect x="30" y="45" width="140" height="22" rx="8" fill="#FF5C46" opacity="0.25" />
    <circle cx="44" cy="56" r="4" fill="#FF5C46" />
    <circle cx="56" cy="56" r="4" fill="#FF5C46" />
    <circle cx="68" cy="56" r="4" fill="#FF5C46" />
    <rect x="46" y="80" width="42" height="32" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" />
    <rect x="98" y="80" width="42" height="32" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" opacity="0.8" />
    <rect x="46" y="120" width="42" height="20" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" opacity="0.8" />
    <rect x="98" y="120" width="42" height="20" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" />
    <circle cx="152" cy="132" r="20" stroke="#FF5C46" strokeWidth="6" fill="none"
      strokeDasharray="70 126" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate"
        from="0 152 132" to="360 152 132" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const NewsIcon = () => (
  <svg viewBox="0 0 200 200" fill="none">
    <line x1="100" y1="120" x2="100" y2="80" stroke="#B81530" strokeWidth="6" strokeLinecap="round" />
    <circle cx="100" cy="120" r="10" fill="#B81530" />
    <circle cx="100" cy="70" r="20" stroke="#B81530" strokeWidth="4" fill="none" opacity="0.8">
      <animate attributeName="r" values="14;28;14" dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="100" cy="70" r="20" stroke="#F5E9EA" strokeWidth="3" fill="none" opacity="0.6">
      <animate attributeName="r" values="10;22;10" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" begin="0.6s" repeatCount="indefinite" />
    </circle>
    <rect x="55" y="130" width="90" height="16" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" />
    <rect x="55" y="152" width="60" height="16" rx="4" stroke="#F5E9EA" strokeWidth="3.5" fill="none" opacity="0.8" />
  </svg>
);

/* ============ Ambient floating icons ============
   game console · play · app · web  */

const GamepadFloat = ({ c }) => (
  <svg viewBox="0 0 60 40" fill="none">
    <path d="M14 10 h32 a9 9 0 0 1 9 11 l-2 9 a5.5 5.5 0 0 1 -10 2.5 l-2.5 -3.5 h-21 l-2.5 3.5 a5.5 5.5 0 0 1 -10 -2.5 l-2 -9 a9 9 0 0 1 9 -11 Z"
      stroke={c} strokeWidth="2.5" />
    <line x1="21" y1="20" x2="21" y2="27" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="17.5" y1="23.5" x2="24.5" y2="23.5" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="39" cy="19" r="2.4" fill="#F5E9EA" />
    <circle cx="45" cy="25" r="2.4" fill="#F5E9EA" />
  </svg>
);

const PlayFloat = ({ c }) => (
  <svg viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="21" stroke={c} strokeWidth="2.5" />
    <path d="M25 20 L42 30 L25 40 Z" fill={c} />
  </svg>
);

const AppFloat = ({ c }) => (
  <svg viewBox="0 0 60 60" fill="none">
    <rect x="18" y="8" width="24" height="44" rx="5" stroke={c} strokeWidth="2.5" />
    <line x1="26" y1="14" x2="34" y2="14" stroke={c} strokeWidth="2" strokeLinecap="round" />
    <rect x="23" y="21" width="6" height="6" rx="1.5" fill={c} opacity="0.9" />
    <rect x="31" y="21" width="6" height="6" rx="1.5" fill="#F5E9EA" opacity="0.8" />
    <rect x="23" y="29" width="6" height="6" rx="1.5" fill="#F5E9EA" opacity="0.8" />
    <rect x="31" y="29" width="6" height="6" rx="1.5" fill={c} opacity="0.9" />
    <circle cx="30" cy="45" r="2.4" stroke={c} strokeWidth="2" />
  </svg>
);

const WebFloat = ({ c }) => (
  <svg viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="20" stroke={c} strokeWidth="2.5" />
    <ellipse cx="30" cy="30" rx="8.5" ry="20" stroke={c} strokeWidth="2" opacity="0.85" />
    <line x1="10" y1="30" x2="50" y2="30" stroke={c} strokeWidth="2" />
    <line x1="13" y1="20" x2="47" y2="20" stroke="#F5E9EA" strokeWidth="1.8" opacity="0.7" />
    <line x1="13" y1="40" x2="47" y2="40" stroke="#F5E9EA" strokeWidth="1.8" opacity="0.7" />
  </svg>
);

const CodeFloat = ({ c }) => (
  <svg viewBox="0 0 60 60" fill="none">
    <rect x="8" y="14" width="44" height="32" rx="5" stroke={c} strokeWidth="2.5" />
    <line x1="8" y1="23" x2="52" y2="23" stroke={c} strokeWidth="2" />
    <circle cx="14" cy="18.5" r="1.8" fill={c} />
    <circle cx="20" cy="18.5" r="1.8" fill={c} opacity="0.6" />
    <path d="M22 31 l-5 5 l5 5" stroke="#F5E9EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M38 31 l5 5 l-5 5" stroke="#F5E9EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ================= Panel config ================= */
const PANELS = [
  {
    key: "about", label: "About", eyebrow: "Who we are",
    Icon: AboutIcon, accent: "#FF3355",
    floaters: [
      { C: GamepadFloat, style: { top: "12%", right: "8%",  width: "clamp(26px,5vw,56px)", height: "clamp(18px,3.4vw,38px)", "--dur": "7.5s", "--delay": "0.2s" } },
      { C: WebFloat,     style: { bottom: "14%", left: "7%", width: "clamp(20px,4vw,44px)", height: "clamp(20px,4vw,44px)", "--dur": "9.1s", "--delay": "1.6s" } },
    ],
  },
  {
    key: "service", label: "Service", eyebrow: "What we build",
    Icon: ServiceIcon, accent: "#C81E3A",
    floaters: [
      { C: PlayFloat, style: { bottom: "16%", left: "7%",  width: "clamp(20px,4vw,46px)", height: "clamp(20px,4vw,46px)", "--dur": "8.2s", "--delay": "0.9s" } },
      { C: AppFloat,  style: { top: "13%",    left: "10%", width: "clamp(20px,4vw,44px)", height: "clamp(20px,4vw,44px)", "--dur": "7.1s", "--delay": "2.1s" } },
    ],
  },
  {
    key: "works", label: "Works", eyebrow: "What we made",
    Icon: WorksIcon, accent: "#FF5C46",
    floaters: [
      { C: GamepadFloat, style: { top: "12%", right: "9%",  width: "clamp(26px,5vw,56px)", height: "clamp(18px,3.4vw,38px)", "--dur": "7.8s", "--delay": "0.5s" } },
      { C: CodeFloat,    style: { bottom: "15%", right: "12%", width: "clamp(22px,4.4vw,48px)", height: "clamp(22px,4.4vw,48px)", "--dur": "8.9s", "--delay": "2.4s" } },
    ],
  },
  {
    key: "contact", label: "News", eyebrow: "What's happening",
    Icon: NewsIcon, accent: "#B81530",
    floaters: [
      { C: PlayFloat, style: { bottom: "14%", left: "8%", width: "clamp(20px,4vw,44px)", height: "clamp(20px,4vw,44px)", "--dur": "8.6s", "--delay": "1.3s" } },
      { C: AppFloat,  style: { top: "14%",    right: "9%", width: "clamp(20px,4vw,44px)", height: "clamp(20px,4vw,44px)", "--dur": "7.6s", "--delay": "2.8s" } },
    ],
  },
];

function Home() {
  const [activeSection, setActiveSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    const valid = ["about", "service", "works", "contact"];
    if (valid.includes(path)) setActiveSection(path);
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
      about:   { service: "push-top-right", works: "push-bottom-left", contact: "push-bottom-right", hub: "push-bottom-right" },
      service: { about: "push-top-left", works: "push-bottom-left", contact: "push-bottom-right", hub: "push-bottom-left" },
      works:   { about: "push-top-left", service: "push-top-right", contact: "push-bottom-right", hub: "push-top-right" },
      contact: { about: "push-top-left", service: "push-top-right", works: "push-bottom-left", hub: "push-top-left" },
    };
    return pushMap[activeSection][section] || "";
  };

  return (
    <>
      <div className="bg-grid" aria-hidden="true"></div>
      <div className="bg-vignette" aria-hidden="true"></div>

      <div className="stage">
        {PANELS.map(({ key, label, eyebrow, Icon, accent, floaters }) => (
          <div
            key={key}
            className={`panel ${key} ${activeSection === key ? "active" : ""} ${getPushDirection(key)}`}
            style={{ "--accent": accent }}
            onClick={() => handleSectionClick(key)}
          >
            <span className="bracket tl"></span>
            <span className="bracket tr"></span>
            <span className="bracket bl"></span>
            <span className="bracket br"></span>
            <span className="tendril"></span>

            {floaters.map(({ C, style }, i) => (
              <div className="bg-floater" style={style} key={i} aria-hidden="true">
                <C c={accent} />
              </div>
            ))}

            <div className="content">
              <div className="icon-wrap">
                <div className="icon-glow"></div>
                <Icon />
              </div>
              <div className="text-block">
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="title">{label}</h2>
                <span className="pill">ENTER</span>
              </div>
            </div>
          </div>
        ))}

        {/* center hub — logo stays upright inside the spinning hex */}
        <div className={`hub ${getPushDirection("hub")}`}>
          <div className="hub-ring"></div>
          <div className="hub-hex"></div>
          <div
            className="hub-mark"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img src={isLogoHovered ? logoHover : logo} alt="Theatives" />
          </div>
        </div>
      </div>

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
    </>
  );
}

export default Home;
