import React from "react";
import "./css/Loader.css";
import logo from "../assets/images/theatives_logo.png"; // adjust path if needed

const Loader = () => {
  return (
    <div className="tl-loader-wrapper">
      <div className="tl-stage">
        {/* flat HUD scan ring under the core */}
        <div className="tl-hud"></div>

        {/* spinning 3D gyroscope rings + orbiting nodes */}
        <div className="tl-core">
          <div className="tl-ring"></div>
          <div className="tl-ring"></div>
          <div className="tl-ring"></div>
          <div className="tl-node"></div>
          <div className="tl-node"></div>
        </div>

        {/* logo dead-centre, upright (doesn't tumble with the rings) */}
        <div className="tl-logo">
          <img src={logo} alt="Theatives" />
        </div>
      </div>

      <div className="tl-loader-text">Theatives</div>
    </div>
  );
};

export default Loader;
