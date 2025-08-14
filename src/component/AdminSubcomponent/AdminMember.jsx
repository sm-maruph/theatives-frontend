import React, { useState, useEffect } from "react";
import "./css/AdminMembers.css";
import {
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../adminServices/AdminMembersApi";
import { getFullUrl } from '../../utils/apiUrl';

const AdminMember = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    position: "",
    member_image: "",
  });

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchMembers();
      setMembers(data);
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
        member_image: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("nickname", formData.nickname);
    form.append("position", formData.position);
    if (fileInput) {
      form.append("member_image", fileInput);
    }

    try {
      if (editingMember) {
        await updateMember(editingMember.id, form);
      } else {
        await createMember(form);
      }
      loadMembers();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      nickname: member.nickname || "",
      position: member.position || "",
      member_image: member.member_image || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember(id);
      setMembers(members.filter((member) => member.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      nickname: "",
      position: "",
      member_image: "",
    });
    setFileInput(null);
    setPreviewImage(null);
  };

  if (loading) return <div className="loading">Loading members...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-service-wrapper">
      <div className="service-container">
        <div className="service-row">
          {/* Member Form Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>{editingMember ? "Edit Member" : "Add New Member"}</h3>
            </div>
            <div className="card-scroll-content">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Member's full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nickname</label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="Member's nickname (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Member's position"
                  />
                </div>

                <div className="form-group">
                  <label>Profile Image</label>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="member-image-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="member-image-upload" className="upload-prompt">
                      {previewImage ? (
                        <div className="image-preview">
                          <img src={previewImage} alt="Preview" />
                          <span className="change-image-text">Click to change image</span>
                        </div>
                      ) : formData.member_image && editingMember ? (
                        <div className="image-preview">
                          <img
                            src={getFullUrl(formData.member_image)}
                            alt="Current"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/images/default-member.png";
                            }}
                          />
                          <span className="change-image-text">Click to change image</span>
                        </div>
                      ) : (
                        <>
                          <span>Drag & drop image here or click to browse</span>
                          <small>Supports: SVG, PNG, JPG (Recommended: 300x300)</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="service-btn_primary">
                    {editingMember ? "Update Member" : "Add Member"}
                  </button>
                  {editingMember && (
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

          {/* Existing Members Card */}
          <div className="service-card">
            <div className="card-header">
              <h3>Team Members ({members.length})</h3>
            </div>
            <div className="card-scroll-content">
              {members.length === 0 ? (
                <div className="no-members">No members found</div>
              ) : (
                <div className="member-list">
                  {members.map((member) => (
                    <div key={member.id} className="member-item">
                      <div className="member-info">
                        {member.member_image && (
                          <div className="member-avatar">
                            <img
                              src={getFullUrl(member.member_image)}
                              alt={member.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/images/default-member.png";
                              }}
                            />
                          </div>
                        )}
                        <div className="member-details">
                          <div className="member-name">
                            {member.name}
                          </div>
                          {member.nickname && (
                              <span className="member-nickname">({member.nickname})</span>
                            )}
                          {member.position && (
                            <div className="member-position">{member.position}</div>
                          )}
                        </div>
                      </div>
                      <div className="member-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditClick(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${member.name}"?`
                              )
                            ) {
                              handleDelete(member.id);
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

export default AdminMember;