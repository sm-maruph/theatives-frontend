// src/components/Services.js
import "./css/Services.css";
import ServiceContainer from "./subComponentService/ServiceContainer";
import ServicesSection from "./subComponentService/ServiceSection";
import MicroserviceSection from "./subComponentService/MicroserviceSection";
const Services = () => (
  <div className="content-wrapper">
    <div className="firstsection">
      <ServiceContainer />
    </div>
    <div className="secondsection">
      <ServicesSection />
    </div>
    <div className="thirdsection">
      <MicroserviceSection />
    </div>
  </div>
);

export default Services;
