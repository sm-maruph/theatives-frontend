// src/components/Services.jsx
import "./css/Services.css";
import ServiceContainer from "./subComponentService/ServiceContainer";
import ServicesSection from "./subComponentService/ServiceSection";
import MicroserviceSection from "./subComponentService/MicroserviceSection";

/* All Services classes are namespaced `sv-*` under `.services-page`.
   This page no longer imports About.css — no cross-page collisions. */

const Services = () => (
  <div className="services-page">
    {/* fixed 3D scene: rotating wireframe cubes + monolith pillars */}
    <div className="sv-scene" aria-hidden="true">
      <div className="sv-scene__glow" />

      <div className="sv-scene__pillars">
        <span className="sv-pillar" />
        <span className="sv-pillar" />
        <span className="sv-pillar" />
        <span className="sv-pillar" />
      </div>

      <div className="sv-scene__solids">
        <div className="sv-cube">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="sv-cube">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="sv-cube">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>

      <div className="sv-scene__vignette" />
    </div>

    <div className="sv-hero">
      <ServiceContainer />
    </div>

    <ServicesSection />
    <MicroserviceSection />
  </div>
);

export default Services;
