import React, { useState, useEffect } from "react";
import "../css/Services.css"; // Link to external CSS
// import { fetchServices } from "../../adminServices/AdminServices";
// import { getFullUrl } from "../../utils/apiUrl";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_SERVICES = [
  { id: 1, title: "Brand Identity",   description: "Logos, guidelines, and complete visual systems that make brands unforgettable.", image_path: "https://placehold.co/120x120/2b2d42/ffffff?text=Brand" },
  { id: 2, title: "Web Design",       description: "Responsive, high-converting websites designed and built end to end.",             image_path: "https://placehold.co/120x120/ef233c/ffffff?text=Web" },
  { id: 3, title: "Motion Graphics",  description: "Animated explainers, ads, and social content that grab attention.",              image_path: "https://placehold.co/120x120/8d99ae/ffffff?text=Motion" },
  { id: 4, title: "UI/UX Design",     description: "Research-driven interface design for web and mobile products.",                    image_path: "https://placehold.co/120x120/edf2f4/2b2d42?text=UIUX" },
];
// ---------------------------------------------------

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await fetchServices();
      // setServices(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setServices(DUMMY_SERVICES);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="servicesPage-section">
      <h3 className="sectionTitle">Our Services</h3>
      <div className="cards-container">
        {services.map((service, index) => (
          <div className="servicePage-card" key={index}>
            <div className="icon">
              <img
                src={service.image_path}
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/theatives_logo.jpeg";
                }}
              />
            </div>
            <h3 className="card-title">{service.title}</h3>
            <p className="card-description">{service.description}</p>
            <button>Get Service</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
