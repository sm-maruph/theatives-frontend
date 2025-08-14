import React, { useState, useEffect } from "react";
import { fetchClients } from "../../adminServices/AdminClientsApi";
import { getFullUrl } from '../../utils/apiUrl';
import '../css/About.css'

function ClientsSection() {
  const [clients, setClients] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
    
      // Fetch services on mount
      useEffect(() => {
        loadClients();
      }, []);
    
      const loadClients = async () => {
        setLoading(true);
        try {
          const data = await fetchClients();
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
      <div className="clients-grid">
        {clients.map((client) => (
          <div key={client.id} className="client-logo">
            <img src={getFullUrl(client.client_logo) } alt={client.client_name } />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientsSection;
