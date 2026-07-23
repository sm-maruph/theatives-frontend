import React, { useState, useEffect } from "react";
import "./css/AdminService.css";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "../../adminServices/AdminServices";
import { getFullUrl } from '../../utils/apiUrl';


const AdminService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_path: "",
  });

  // Fetch services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Add the new useEffect cleanup here
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInput(file); // Save file object
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setFormData((prev) => ({
        ...prev,
        image_path: file.name, // Show selected filename in UI
      }));
    }
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    if (fileInput) {
      form.append("image", fileInput); // Append the file object
    }

    try {
      if (editingService) {
        await updateService(editingService.id, form);
      } else {
        await createService(form);
      }
      loadServices();
      resetForm();
      setFileInput(null); // Clear file input after submit
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle edit click
  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image_path: service.image_path || "",
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServices(services.filter((service) => service.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setEditingService(null);
    setFormData({ title: "", description: "", image_path: "" });
    setFileInput(null); // Reset file input
    setPreviewImage(null);
  };

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-service-wrapper">
      <div className="service-container">
        <div className="service-row">
          {/* Service Form Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>{editingService ? "Edit Service" : "Add New Service"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Service Name</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your service..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Service Icon</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="service-icon-upload"
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="service-icon-upload"
                      className="upload-prompt"
                    >
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" />
                          <span className="change-image-text">
                            Click to change image
                          </span>
                        </div>
                      ) : formData.image_path && editingService ? (
                        <div className="image-preview">
                          <img
                            src={getFullUrl(formData.image_path)}
                            alt="Current"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/assets/images/theatives_logo.jpeg";
                            }}
                          />
                          <span className="change-image-text">
                            Click to change image
                          </span>
                        </div>
                      ) : (
                        <>
                          <span>Drag & drop icon here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingService ? "Update Service" : "Create Service"}
                  </button>
                  {editingService && (
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

          {/* Existing Services Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>Existing Services ({services.length})</h3>
            </div>
            <div className="card-scroll-content">
              {services.length === 0 ? (
                <div className="no-services">No services found</div>
              ) : (
                <div className="service-list">
                  {services.map((service) => (
                    <div key={service.id} className="service-item">
                      <div className="service-info">
                        {service.image_path && (
                          <div className="service-icon">
                            <img
                              src={getFullUrl(service.image_path)}
                              alt={service.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/assets/images/theatives_logo.jpeg"; // fallback image
                              }}
                            />
                          </div>
                        )}
                        <div className="service-details">
                          <div className="service-name">{service.title}</div>
                          <div className="service-description">
                            {service.description
                          ? `${service.description.substring(0, 60)}...`
                          : "No description"}
                          </div>
                        </div>
                      </div>
                      <div className="service-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(service)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${service.title}"? This action cannot be undone.`
                              )
                            ) {
                              handleDelete(service.id);
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

export default AdminService;
