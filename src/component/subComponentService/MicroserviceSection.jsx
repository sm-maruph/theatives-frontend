import React, { useState, useEffect } from "react";
import "./css/MicroService.css"; // Link to external CSS
import { fetchServices } from "../../adminServices/AdminMicroservices";
import { getFullUrl } from "../../utils/apiUrl";

const MicroserviceSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
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
                alt="Current"
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
