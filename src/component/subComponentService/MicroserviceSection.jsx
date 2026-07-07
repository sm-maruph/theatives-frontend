import React, { useState, useEffect } from "react";
import "./css/MicroService.css"; // Link to external CSS
// import { fetchServices } from "../../adminServices/AdminMicroservices";
// import { getFullUrl } from "../../utils/apiUrl";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_MICROSERVICES = [
  { id: 1, title: "Logo Refresh",       description: "Quick, polished updates to your existing logo.",          image_path: "https://placehold.co/120x120/2b2d42/ffffff?text=Logo" },
  { id: 2, title: "Social Templates",   description: "Ready-to-use post templates for your social channels.",  image_path: "https://placehold.co/120x120/ef233c/ffffff?text=Social" },
  { id: 3, title: "Business Cards",     description: "Print-ready card designs delivered in 48 hours.",         image_path: "https://placehold.co/120x120/8d99ae/ffffff?text=Cards" },
  { id: 4, title: "Banner Design",      description: "Web and print banners tailored to your campaign.",        image_path: "https://placehold.co/120x120/edf2f4/2b2d42?text=Banner" },
  { id: 5, title: "Icon Set",           description: "Custom icon packs matched to your brand style.",          image_path: "https://placehold.co/120x120/2b2d42/ffffff?text=Icons" },
  { id: 6, title: "Presentation Deck",  description: "Clean, on-brand slide templates for pitches.",            image_path: "https://placehold.co/120x120/ef233c/ffffff?text=Deck" },
];
// ---------------------------------------------------

const MicroserviceSection = () => {
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
      setServices(DUMMY_MICROSERVICES);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="microService-section">
      <h3 className="sectionTitle">Our Micro-services</h3>
      <div className="microCards-container">
        {services.map((service, index) => (
          <div className="microService-card" key={index}>
            <div className="microIcon">
              <img
                src={service.image_path}
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/theatives_logo.jpeg";
                }}
              />
            </div>
            <h3 className="microCard-title">{service.title}</h3>
            <p className="microCard-description">{service.description}</p>
            <button>Get Service</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicroserviceSection;
