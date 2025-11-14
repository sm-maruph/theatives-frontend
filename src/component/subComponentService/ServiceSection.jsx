import React, { useState, useEffect } from "react";
import '../css/Services.css'; // Link to external CSS
import { fetchServices } from "../../adminServices/AdminServices";
import { getFullUrl } from "../../utils/apiUrl"; // Adjust the path as necessary
const ServicesSection = () => {
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
    <div className="servicesPage-section">
      <h3 className="sectionTitle">Our Services</h3>
      <div className="cards-container">
        {services.map((service, index) => (
          <div className="servicePage-card" key={index}>
            <div className="icon"><img
                src={service.image_path}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/images/theatives_logo.jpeg";
                }}
              /></div>
            <h3 className="card-title">{service.title}</h3>
            <p className="card-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;