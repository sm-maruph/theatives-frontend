import React, { useState, useEffect } from "react";
import "./css/AdminCareer.css";
import {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
} from '../../adminServices/AdminCareerApi';

const AdminCareer = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  // const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    position: "",
    type: "Full-time",
    status: "Active",
    description: "",
    requirements: "",
    // image_path: "",
  });

  useEffect(() => {
    loadJobs();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (previewImage){ URL.revokeObjectURL(previewImage);}
  //   };
  // }, [previewImage]);

  const loadJobs = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getCareers();
    setJobs(data);
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

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileInput(file);
  //     const previewUrl = URL.createObjectURL(file);
  //     setPreviewImage(previewUrl);
  //     setFormData((prev) => ({
  //       ...prev,
  //       image_path: file.name,
  //     }));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("position", formData.position);
      form.append("type", formData.type);
      form.append("status", formData.status);
      form.append("description", formData.description);
      form.append("requirements", formData.requirements);
      // if (fileInput) {
      //   form.append("image", fileInput);
      // }
      if (editingJob) {
        await updateCareer(editingJob.id, form);
      } else {
        await createCareer(form);
      }
      await loadJobs();
      resetForm();
      setFileInput(null); 
    } catch (err) {
      setError("Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setFormData({
      position: job.position,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements,
      // image_path: job.image_path || "",
    });
    // setPreviewImage(null);
    setFileInput(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      position: "",
      type: "Full-time",
      status: "Active",
      description: "",
      requirements: "",
      // image_path: "",
    });
    setFileInput(null);
    // setPreviewImage(null);
  };



  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setLoading(true);
    setError(null);

    try {
      await deleteCareer(id);
      setJobs(jobs.filter((job) => job.id !== id));
      if (editingJob && editingJob.id === id) {
        resetForm();
      }
    } catch (err) {
      setError("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
   <div className="admin-career-wrapper">
      <div className="career-container">
        <div className="career-row">
          {/* Form Card */}
          <div className="career-card form-card">
            <div className="card-header">
              <h3>{editingJob ? "Edit Job Posting" : "Post New Job"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Position Title</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Enter position title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a type </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Job Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Job Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the position..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Requirements</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="List the requirements..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                {/* <div className="form-group">
                  <label>Job Image</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="job-image-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="job-image-upload" className="upload-prompt">
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" />
                          <span className="change-image-text">
                            Click to change image
                          </span>
                        </div>
                      ) : formData.image_path && editingJob ? (
                        <div className="image-preview">
                          <img
                            src={`http://localhost:5000${formData.image_path}`}
                            alt="Current"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/default_job.png";
                            }}
                          />
                          <span className="change-image-text">
                            Click to change image
                          </span>
                        </div>
                      ) : (
                        <>
                          <span>Drag & drop image here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG</small>
                        </>
                      )}
                    </label>
                  </div>
                </div> */}

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingJob ? "Update Job" : "Create Job"}
                  </button>
                  {editingJob && (
                    <button
                      type="button"
                      className="career-btn cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Jobs List Card */}
          <div className="career-card listings-card">
            <div className="card-header">
              <h3>Current Openings ({jobs.length})</h3>
            </div>
            <div className="card-scroll-content">
              {jobs.length === 0 ? (
                <div className="no-jobs">No jobs found</div>
              ) : (
                <div className="career-list">
                  {jobs.map((job) => (
                    <div key={job.id} className="career-list-item">
                      <div className="career-info">
                        {/* {job.image_path && (
                          <div className="career-icon">
                            <img
                              src={`http://localhost:5000${job.image_path}`}
                              alt={job.position}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/images/default_job.png";
                              }}
                            />
                          </div>
                        )} */}
                        <div className="career-details">
                          <div className="career-position">{job.position}</div>
                          <div className="career-type-status">
                            <span>{job.type}</span>
                            <span
                              className={`career-status ${job.status.toLowerCase()}`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <div className="career-description">
                            {job.description
                              ? `${job.description.substring(0, 60)}...`
                              : "No description"}
                          </div>
                        </div>
                      </div>
                      <div className="career-actions">
                        <button
                          className="career-edit"
                          onClick={() => handleEditClick(job)}
                        >
                          Edit
                        </button>
                        <button
                          className="career-delete"
                          onClick={() => handleDeleteJob(job.id)}
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

export default AdminCareer;
