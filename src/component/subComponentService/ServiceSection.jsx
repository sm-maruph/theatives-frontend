import React, { useState, useEffect } from "react";
import "../css/Services.css";
import ServiceInquiryModal from "./ServiceInquiryModal";
// import { fetchServices } from "../../adminServices/AdminServices";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_SERVICES = [
  { id: 1, title: "Web Development",  description: "Responsive, high-converting websites designed and built end to end.", image_path: "https://placehold.co/120x120/871f27/ffc46b?text=Web" },
  { id: 2, title: "Graphics Design",  description: "Logos, guidelines, and complete visual systems that make brands unforgettable.", image_path: "https://placehold.co/120x120/871f27/ff5c72?text=Design" },
  { id: 3, title: "Game Development", description: "Immersive game worlds, mechanics, and interactive experiences.", image_path: "https://placehold.co/120x120/871f27/ffc46b?text=Game" },
  { id: 4, title: "App Development",  description: "Native and cross-platform apps built for performance and scale.", image_path: "https://placehold.co/120x120/871f27/ff5c72?text=App" },
];
// ---------------------------------------------------

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inquiry, setInquiry] = useState(null); // the service being requested

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
    <section className="sv-section">
      <h3 className="sv-title">Our Services</h3>

      <div className="sv-cards">
        {services.map((service, index) => (
          <article className="sv-card" key={service.id || index}>
            <div className="sv-card-icon">
              <img
                src={service.image_path}
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/theatives_logo.jpeg";
                }}
              />
            </div>
            <h3 className="sv-card-title">{service.title}</h3>
            <p className="sv-card-desc">{service.description}</p>

            {/* passes the whole service object — the modal locks it read-only */}
            <button
              className="sv-card-btn"
              onClick={() => setInquiry(service)}
            >
              Get Service
            </button>
          </article>
        ))}
      </div>

      {inquiry && (
        <ServiceInquiryModal
          service={inquiry}
          kind="service"
          onClose={() => setInquiry(null)}
        />
      )}
    </section>
  );
};

export default ServicesSection;
