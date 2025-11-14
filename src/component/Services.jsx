// src/components/Services.js
import "./css/Services.css";
import ServiceContainer from "./subComponentService/ServiceContainer";
import ServicesSection from "./subComponentService/ServiceSection";
import MicroserviceSection from "./subComponentService/MicroserviceSection";
const Services = () => (
  <div className="content-wrapper">
    <div >
      <ServiceContainer />
    </div>
    <div >
      <ServicesSection />
    </div>
    <div >
      <MicroserviceSection />
    </div>
  </div>
);

export default Services;
