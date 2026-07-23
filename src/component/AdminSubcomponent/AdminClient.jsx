import React, { useState, useEffect } from "react";
import "./css/AdminClient.css"; // Optional: Rename if not about reviews
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../adminServices/AdminClientsApi";
import { getFullUrl } from '../../utils/apiUrl';


const AdminClient = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_logo: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInput(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setFormData((prev) => ({
        ...prev,
        client_logo: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("client_name", formData.client_name);
    if (fileInput) {
      form.append("client_logo", fileInput);
    }

    try {
      if (editingClient) {
        await updateClient(editingClient.id, form);
      } else {
        await createClient(form);
      }
      loadClients();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      client_logo: client.client_logo || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id);
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      client_name: "",
      client_logo: "",
    });
    setFileInput(null);
    setPreviewImage(null);
  };

  if (loading) return <div className="loading">Loading clients...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-service-wrapper">
      <div className="service-container">
        <div className="service-row">
          {/* Client Form */}
          <div className="service-card">
            <div className="card-header">
              <h3>{editingClient ? "Edit Client" : "Add New Client"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    placeholder="Client name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Client Logo</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="client-logo-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="client-logo-upload" className="upload-prompt">
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" />
                          <span className="change-image-text">Click to change image</span>
                        </div>
                      ) : formData.client_logo && editingClient ? (
                        <div className="image-preview">
                          <img
                            src={getFullUrl(formData.client_logo)}
                            alt="Current"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/theatives_logo.jpeg";
                            }}
                          />
                          <span className="change-image-text">Click to change image</span>
                        </div>
                      ) : (
                        <>
                          <span>Drag & drop logo here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingClient ? "Update Client" : "Create Client"}
                  </button>
                  {editingClient && (
                    <button
                      type="button"
                      className="service-btn cancel"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Existing Clients */}
          <div className="service-card">
            <div className="card-header">
              <h3>Clients ({clients.length})</h3>
            </div>
            <div className="card-scroll-content">
              {clients.length === 0 ? (
                <div className="no-services">No clients found</div>
              ) : (
                <div className="service-list">
                  {clients.map((client) => (
                    <div key={client.id} className="service-item">
                      <div className="service-info">
                        {client.client_logo && (
                          <div className="service-icon">
                            <img
                             src={getFullUrl(client.client_logo)}
                              alt={client.client_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/images/theatives_logo.jpeg";
                              }}
                            />
                          </div>
                        )}
                        <div className="service-details">
                          <div className="service-name">{client.client_name}</div>
                        </div>
                      </div>
                      <div className="service-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(client)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${client.client_name}"?`
                              )
                            ) {
                              handleDelete(client.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClient;
