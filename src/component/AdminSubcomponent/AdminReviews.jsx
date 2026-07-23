import React, { useState, useEffect } from "react";
import "./css/AdminReviews.css";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../../adminServices/AdminReviewsApi";
import { getFullUrl } from '../../utils/apiUrl';


const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    review_text: "",
    reviewer_name: "",
    reviewer_position: "",
    reviewer_company: "",
    reviewer_image: "",
  });

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews();
      setReviews(data);
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
        reviewer_image: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("review_text", formData.review_text);
    form.append("reviewer_name", formData.reviewer_name);
    form.append("reviewer_position", formData.reviewer_position);
    form.append("reviewer_company", formData.reviewer_company);
    if (fileInput) {
      form.append("reviewer_image", fileInput);
    }

    try {
      if (editingReview) {
        await updateReview(editingReview.id, form);
      } else {
        await createReview(form);
      }
      loadReviews();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setFormData({
      review_text: review.review_text,
      reviewer_name: review.reviewer_name,
      reviewer_position: review.reviewer_position,
      reviewer_company: review.reviewer_company,
      reviewer_image: review.reviewer_image || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({
      review_text: "",
      reviewer_name: "",
      reviewer_position: "",
      reviewer_company: "",
      reviewer_image: "",
    });
    setFileInput(null);
    setPreviewImage(null);
  };

  if (loading) return <div className="loading">Loading reviews...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-service-wrapper">
      <div className="service-container">
        <div className="service-row">
          {/* Review Form Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>{editingReview ? "Edit Review" : "Add New Review"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Review Text</label>
                  <textarea
                    name="review_text"
                    value={formData.review_text}
                    onChange={handleInputChange}
                    placeholder="Enter review text..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Reviewer Name</label>
                  <input
                    type="text"
                    name="reviewer_name"
                    value={formData.reviewer_name}
                    onChange={handleInputChange}
                    placeholder="Reviewer full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reviewer Position</label>
                  <input
                    type="text"
                    name="reviewer_position"
                    value={formData.reviewer_position}
                    onChange={handleInputChange}
                    placeholder="e.g., CEO"
                  />
                </div>

                <div className="form-group">
                  <label>Reviewer Company</label>
                  <input
                    type="text"
                    name="reviewer_company"
                    value={formData.reviewer_company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google"
                  />
                </div>

                <div className="form-group">
                  <label>Reviewer Image</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="reviewer-image-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="reviewer-image-upload" className="upload-prompt">
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" />
                          <span className="change-image-text">Click to change image</span>
                        </div>
                      ) : formData.reviewer_image && editingReview ? (
                        <div className="image-preview">
                          <img
                            src={getFullUrl(formData.reviewer_image)}
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
                          <span>Drag & drop image here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingReview ? "Update Review" : "Create Review"}
                  </button>
                  {editingReview && (
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

          {/* Existing Reviews Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>Existing Reviews ({reviews.length})</h3>
            </div>
            <div className="card-scroll-content">
              {reviews.length === 0 ? (
                <div className="no-services">No reviews found</div>
              ) : (
                <div className="service-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="service-item">
                      <div className="service-info">
                        {review.reviewer_image && (
                          <div className="service-icon">
                            <img
                              src={getFullUrl(review.reviewer_image)}
                              alt={review.reviewer_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/images/theatives_logo.jpeg";
                              }}
                            />
                          </div>
                        )}
                        <div className="service-details">
                          <div className="service-name">
                            {review.reviewer_name} - {review.reviewer_position}
                          </div>
                          <div className="service-description">
                            {review.review_text
                              ? `${review.review_text.substring(0, 60)}...`
                              : "No review text"}
                          </div>
                          <div className="service-meta">
                            {review.reviewer_company && (
                              <small>{review.reviewer_company}</small>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="service-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete the review by "${review.reviewer_name}"?`
                              )
                            ) {
                              handleDelete(review.id);
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

export default AdminReviews;
