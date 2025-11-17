import React, { useState, useEffect } from "react";
import { fetchClients } from "../../adminServices/AdminClientsApi";
import "../css/About.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";

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
      const data = await fetchClients();
      console.log("Clients data:", data); // debug
      setClients(data);
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

      {/* Client Modal */}
      {selectedClient && (
  <div className="modal-overlay" onClick={() => setSelectedClient(null)}>
    <ParticlesComponent theme="light" />
    <div
      className="modal-content scrollable-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sticky Back Button */}
      <button
        className="modal-sticky-btn"
        onClick={() => setSelectedClient(null)}
      >
        Back
      </button>

      {/* Logo */}
      <img
        src={selectedClient.client_logo}
        alt={selectedClient.client_name}
        className="modal-logo"
      />

      {/* Client Info */}
      <h2 className="modal-client-name">{selectedClient.client_name}</h2>
      <h4 className="modal-service-type">
        <strong>Service Type:</strong> {selectedClient.service_type}
      </h4>
      <p className="modal-description">{selectedClient.service_description}</p>

      {/* Sticky Visit Button */}
      {selectedClient.company_url && (
        <a
          href={selectedClient.company_url}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-company-btn sticky-btn"
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
