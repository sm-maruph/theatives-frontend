import React, { useState, useEffect } from "react";
// import { fetchClients } from "../../adminServices/AdminClientsApi";
import "../css/About.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_CLIENTS = [
  { id: 1, client_name: "Nimbus Studio", client_logo: "https://placehold.co/200x120/2b2d42/ffffff?text=Nimbus", service_type: "Brand Identity", service_description: "Full brand identity design including logo, guidelines, and collateral.", company_url: "https://example.com" },
  { id: 2, client_name: "BrightPixel",   client_logo: "https://placehold.co/200x120/ef233c/ffffff?text=BrightPixel", service_type: "Web Design", service_description: "End-to-end website design and development for their product launch.", company_url: "https://example.com" },
  { id: 3, client_name: "Cloudline",     client_logo: "https://placehold.co/200x120/8d99ae/ffffff?text=Cloudline", service_type: "Motion Graphics", service_description: "Animated explainer videos and social media motion assets.", company_url: "" },
  { id: 4, client_name: "Verdant Co.",   client_logo: "https://placehold.co/200x120/edf2f4/2b2d42?text=Verdant", service_type: "UI/UX", service_description: "Mobile app UX research and interface design.", company_url: "https://example.com" },
];
// ---------------------------------------------------

function ClientsSection() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await fetchClients();
      // setClients(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setClients(DUMMY_CLIENTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sectionFour">
      <h4 className="sectionTitle">Our Clients</h4>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="clients-grid">
        {clients.map((client) => (
          <div
            key={client.id}
            className="client-logo"
            onClick={() => setSelectedClient(client)}
          >
            <img src={client.client_logo} alt={client.client_name} />
            <p className="client-name">{client.client_name}</p>
          </div>
        ))}
      </div>

      {/* Modal — namespaced ab-* so Gallery.css can't override it */}
      {selectedClient && (
        <div className="ab-modal-overlay" onClick={() => setSelectedClient(null)}>
          <ParticlesComponent theme="light" />
          <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="ab-modal-back"
              onClick={() => setSelectedClient(null)}
            >
              Back
            </button>

            <img
              src={selectedClient.client_logo}
              alt={selectedClient.client_name}
              className="ab-modal-logo"
            />

            <h2 className="ab-modal-name">{selectedClient.client_name}</h2>
            <h4 className="ab-modal-service">
              <strong>Service Type:</strong> {selectedClient.service_type}
            </h4>
            <p className="ab-modal-desc">{selectedClient.service_description}</p>

            {selectedClient.company_url && (
              <a
                href={selectedClient.company_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ab-modal-visit"
              >
                Visit {selectedClient.client_name}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsSection;
