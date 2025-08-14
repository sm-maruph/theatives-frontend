import React, { useState, useEffect } from "react";
import "./css/AdminWorks.css";
import {
  getAllWorks,
  createWork,
  updateWork,
  deleteWork,
} from "../../adminServices/workServices";
import { getFullUrl } from '../../utils/apiUrl';


const AdminWorks = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingWork, setEditingWork] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: null,
    previewUrl: null,
    mediaType: null,
  });

  // Fetch services on mount
  useEffect(() => {
    fetchWorks();
  }, []);
  // Clean up preview URLs
  useEffect(() => {
    return () => {
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
    };
  }, [formData.previewUrl]);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const works = await getAllWorks();
      setWorks(works);
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
        media: file,
        mediaType: file.type, // Store the file type
        previewUrl,
      }));
    }
  };

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
      if (editingWork) {
        // Update existing work
        await updateWork(editingWork.id, form);
      } else {
        // Add new work
        await createWork(form);
      }
      fetchWorks();
      resetForm();
      setFileInput(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (work) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || "",
      media: null,
      previewUrl: work.image_path || "",
    });
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${service.title}"? This action cannot be undone.`
      )
    ) {
      setLoading(true);
      try {
        await deleteWork(id);
        setWorks(works.filter((work) => work.id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingWork(null);
    resetForm();
  };
  // Reset form
  const resetForm = () => {
    setEditingWork(null);
    setFormData({ title: "", description: "", media: "" });
    setFileInput(null); // Reset file input
    setPreviewImage(null);
  };

  if (loading && works.length === 0) {
    return <div className="admin-work-wrapper">Loading...</div>;
  }

  if (error) {
    return <div className="admin-work-wrapper">Error: {error}</div>;
  }

  return (
    <div className="admin-work-wrapper">
      <div className="work-container">
        <div className="work-row">
          {/* Form Card */}
          <div className="work-card">
            <div className="card-header">
              <h3>{editingWork ? "Edit Work" : "Add New Work"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Enter Your Work Thumbnail : </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter work Thumbnails"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Enter Youtube Video Id : </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter your Youtube Video link. Ex: NNApmyq9y0g"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Work Media</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      id="work-icon-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="work-icon-upload" className="upload-prompt">
                      {formData.previewUrl ? (
                        <div className="image-preview">
                          {formData.mediaType?.startsWith("image/") ? (
                            <img
                              src={formData.previewUrl}
                              alt="Preview"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/assets/images/theatives_logo.jpeg";
                              }}
                            />
                          ) : (
                            <video
                              src={formData.previewUrl}
                              controls
                              style={{ maxHeight: "150px" }}
                            />
                          )}
                          <span className="change-image-text">
                            Click to change media
                          </span>
                        </div>
                      ) : editingWork?.media ? (
                        <div className="image-preview">
                          {editingWork.media.endsWith(".mp4") ? (
                            <video
                              src={getFullUrl(editingWork.media)}
                              controls
                              style={{ maxHeight: "150px" }}
                            />
                          ) : (
                            <img
                              src={getFullUrl(editingWork.media)}
                              alt="Current"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/assets/images/theatives_logo.jpeg";
                              }}
                            />
                          )}
                          <span className="change-image-text">
                            Click to change media
                          </span>
                        </div>
                      ) : (
                        <>
                          <span>Drag & drop media here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG, MP4</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingWork ? "Update Work" : "Create Work"}
                  </button>
                  {editingWork && (
                    <button
                      type="button"
                      className="work-btn cancel"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Card */}
          <div className="work-card">
            <div className="card-header">
              <h3>Existing Works({works.length})</h3>
            </div>
            <div className="card-scroll-content">
              {works.length === 0 ? (
                <div className="no-works">No works found</div>
              ) : (
                <div className="work-list">
                  {works.map((work) => (
                    <div key={work.id} className="work-item">
                      <div className="work-info">
                        {work.media && (
                          <div className="work-icon">
                            {work.media.endsWith(".mp4") ? (
                              <video
                                src={getFullUrl(work.media)}
                                alt={work.title}
                                controls
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "/assets/images/theatives_logo.jpeg";
                                }}
                              />
                            ) : (
                              <img
                                src={getFullUrl(work.media)}
                                alt={work.title}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "/assets/images/theatives_logo.jpeg";
                                }}
                              />
                            )}
                          </div>
                        )}
                        <div className="work-details">
                          <div className="work-name">{work.title}</div>
                          <div className="work-description">
                            {work.description
                              ? `${work.description.substring(0, 60)}...`
                              : "No description"}
                          </div>
                        </div>
                      </div>
                      <div className="work-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(work)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(work.id)}
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

export default AdminWorks;
