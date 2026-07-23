import BlogEditor from "../subcomponentBlog/BlogEditor";
import React, { useState, useEffect } from "react";
import { getFullUrl } from '../../utils/apiUrl';

import "./css/AdminBlog.css";
import {
  getBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
} from "../../adminServices/AdminBlog";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [sections, setSections] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const addSection = (type) => {
    const newSection = {
      type,
      content:
        type === "list"
          ? [""]
          : type === "image" || type === "video"
          ? { file: null, preview: "" }
          : "",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index, value, itemIndex = null) => {
    const updated = [...sections];
    if (updated[index].type === "list" && itemIndex !== null) {
      updated[index].content[itemIndex] = value;
    } else {
      updated[index].content = value;
    }
    setSections(updated);
  };

  const addListItem = (index) => {
    const updated = [...sections];
    updated[index].content.push("");
    setSections(updated);
  };

  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...sections];
    const preview = URL.createObjectURL(file);
    updated[index].content = { file, preview };
    setSections(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category.trim() || sections.length === 0) {
      alert("Please fill all required fields and add at least one section.");
      return;
    }

    const formData = new FormData();
    const formattedSections = [];

    sections.forEach((section) => {
      const { type, content } = section;

      if (type === "image" && content.file) {
        formData.append("images", content.file);
        formattedSections.push({ type, content: null });
      } else if (type === "video" && content.file) {
        formData.append("videos", content.file);
        formattedSections.push({ type, content: null });
      } else {
        formattedSections.push(section);
      }
    });

    formData.append(
      "data",
      JSON.stringify({ title, category, sections: formattedSections })
    );

    try {
      setSubmitting(true);
      if (editingBlog) {
        await updateBlog(editingBlog.id, formData);
        alert("Blog updated!");
      } else {
        await createBlog(formData);
        alert("Blog submitted!");
      }

      setTitle("");
      setCategory("");
      setSections([]);
      setEditingBlog(null);

      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error(error);
      alert("Error submitting blog");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load blogs.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        const updated = await getBlogs();
        setBlogs(updated);
        alert("Blog deleted.");
      } catch (err) {
        alert("Error deleting blog.");
        console.error(err);
      }
    }
  };

  const editBlog = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setSections(
      blog.sections.map((section) => {
        if (section.type === "image" || section.type === "video") {
          return {
            ...section,
            content: {
              file: null,
              preview: getFullUrl(section.content),
            },
          };
        }
        return section;
      })
    );
  };

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-blog-wrapper">
      <div className="blog-container">
        <div className="blog-row">
          {/* Blog Form Card */}
          <div className="blog-card">
            <div className="card-scroll-content">
              <div className="container" style={{ maxWidth: "700px", margin: "auto" }}>
                <h2>{editingBlog ? "Edit Blog" : "Create Blog"}</h2>

                <input
                  type="text"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    background: "black",
                    color: "white",
                  }}
                >
                  <option value="">Select a category...</option>
                  <option value="all">All</option>
                  <option value="general">General</option>
                  <option value="job-listing">Job Listing</option>
                  <option value="outreach">Outreach</option>
                  <option value="review">Review</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="blog">Blog</option>
                  <option value="digital-marketing">Digital Marketing</option>
                </select>

                <div style={{ marginBottom: "15px" }}>
                  {["heading", "paragraph", "list", "image", "video"].map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    >
                      + {type}
                    </button>
                  ))}
                </div>

                {sections.map((section, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <label>
                      <strong>{section.type.toUpperCase()}</strong>
                    </label>

                    {section.type === "heading" && (
                      <input
                        type="text"
                        value={section.content}
                        onChange={(e) => updateSection(index, e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    )}

                    {section.type === "paragraph" && (
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    )}

                    {section.type === "list" && (
                      <div>
                        {section.content.map((item, i) => (
                          <input
                            key={i}
                            type="text"
                            value={item}
                            placeholder={`Item ${i + 1}`}
                            onChange={(e) =>
                              updateSection(index, e.target.value, i)
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginBottom: "5px",
                            }}
                          />
                        ))}
                        <button onClick={() => addListItem(index)}>
                          + Add List Item
                        </button>
                      </div>
                    )}

                    {section.type === "image" && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />
                        {section.content.preview && (
                          <img
                            src={section.content.preview}
                            alt="preview"
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              maxHeight: "300px",
                            }}
                          />
                        )}
                      </div>
                    )}

                    {section.type === "video" && (
                      <div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />
                        {section.content.preview && (
                          <video
                            src={section.content.preview}
                            controls
                            style={{
                              width: "100%",
                              marginTop: "10px",
                              maxHeight: "300px",
                            }}
                          />
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => removeSection(index)}
                      style={{ color: "red", marginTop: "10px" }}
                    >
                      Remove Section
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ marginTop: "20px", padding: "10px 20px" }}
                >
                  {editingBlog ? "Update Blog" : "Submit Blog"}
                </button>
              </div>
            </div>
          </div>

          {/* Blog Preview Card */}
          <div className="blog-card">
            <div className="card-header">
              <h3>Existing Blogs</h3>
            </div>
            <div className="card-scroll-content">
              <div style={{ maxWidth: "800px", margin: "auto" }}>
                <h1>Blogs</h1>
                {blogs.length === 0 && <p>No blogs found.</p>}
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    style={{
                      marginBottom: "40px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "20px",
                    }}
                  >
                    <h2>{blog.title}</h2>
                    <h3>{blog.category}</h3>
                    {blog.sections.map((section, idx) => {
                      switch (section.type) {
                        case "heading":
                          return <h3 key={idx}>{section.content}</h3>;
                        case "paragraph":
                          return <p key={idx}>{section.content}</p>;
                        case "list":
                          return (
                            <ul key={idx}>
                              {section.content.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          );
                        case "image":
                          return (
                            <img
                              key={idx}
                              src={getFullUrl(section.content)}
                              alt="Blog section"
                              style={{ maxWidth: "100%", margin: "15px 0" }}
                            />
                          );
                        case "video":
                          return (
                            <video
                              key={idx}
                              src={getFullUrl(section.content)}
                              controls
                              style={{ maxWidth: "100%", margin: "15px 0" }}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                    <button
                      onClick={() => editBlog(blog)}
                      style={{ marginRight: "10px", padding: "5px 10px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
