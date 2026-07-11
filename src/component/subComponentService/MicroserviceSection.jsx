import React, { useState, useEffect } from "react";
import "../css/Services.css";
import ServiceInquiryModal from "./ServiceInquiryModal";
// import { fetchServices } from "../../adminServices/AdminMicroservices";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_MICROSERVICES = [
  { id: 1, title: "Video Editing",      description: "Cuts, colour, and sound polished for every platform.", image_path: "https://placehold.co/120x120/5c141a/ffc46b?text=Video" },
  { id: 2, title: "Environment Design", description: "Believable 3D worlds and set dressing for games and film.", image_path: "https://placehold.co/120x120/5c141a/ff5c72?text=Env" },
  { id: 3, title: "Logo Design",        description: "Distinctive marks that carry a brand at any size.", image_path: "https://placehold.co/120x120/5c141a/ffc46b?text=Logo" },
  { id: 4, title: "Social Templates",   description: "Ready-to-use post kits matched to your brand system.", image_path: "https://placehold.co/120x120/5c141a/ff5c72?text=Social" },
  { id: 5, title: "Motion Graphics",    description: "Animated explainers and title sequences that hold attention.", image_path: "https://placehold.co/120x120/5c141a/ffc46b?text=Motion" },
  { id: 6, title: "Presentation Deck",  description: "Clean, on-brand slide systems built for pitching.", image_path: "https://placehold.co/120x120/5c141a/ff5c72?text=Deck" },
];
// ---------------------------------------------------

const MicroserviceSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inquiry, setInquiry] = useState(null);

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
      setServices(DUMMY_MICROSERVICES);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sv-section">
      <h3 className="sv-title">Our Micro-services</h3>

      <div className="sv-cards sv-cards--micro">
        {services.map((service, index) => (
          <article className="sv-card sv-card--micro" key={service.id || index}>
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
          kind="micro"
          onClose={() => setInquiry(null)}
        />
      )}
    </section>
  );
};

export default MicroserviceSection;
