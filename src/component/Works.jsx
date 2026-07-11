// src/components/Works.jsx
import React from "react";
import "./css/Works.css";
import WorkContainer from "./subcomponentWork/WorkContainer";
import WorksSection from "./subcomponentWork/WorksSection";
import ShowcaseWork from "./subcomponentWork/ShowcaseWork";

/* All Works classes are namespaced `wk-*` under `.works-page`.
   This page no longer imports About.css — no cross-page collisions. */

const Works = () => (
  <div className="works-page">
    {/* fixed 3D scene: orbital gyroscope rings + floating frames */}
    <div className="wk-scene" aria-hidden="true">
      <div className="wk-scene__glow" />

      <div className="wk-scene__gyros">
        <div className="wk-gyro">
          <span className="wk-ring" /><span className="wk-ring" /><span className="wk-ring" />
        </div>
        <div className="wk-gyro">
          <span className="wk-ring" /><span className="wk-ring" /><span className="wk-ring" />
        </div>
        <div className="wk-gyro">
          <span className="wk-ring" /><span className="wk-ring" /><span className="wk-ring" />
        </div>
      </div>

      <div className="wk-scene__frames">
        <span className="wk-frame" />
        <span className="wk-frame" />
        <span className="wk-frame" />
      </div>

      <div className="wk-scene__vignette" />
    </div>

    <div className="wk-hero">
      <WorkContainer />
    </div>

    <div className="wk-section">
      <h3 className="wk-title">Our Works</h3>
      <WorksSection />
    </div>

    <ShowcaseWork />
  </div>
);

export default Works;
