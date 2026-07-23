import React, { useState } from "react";
import axios from "axios";
import "./css/BlogEditor.css";
import { getFullUrl } from "../../utils/apiUrl";
const BASE_PATH = "/api/admin/dashboardservices/blogs";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

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

  const handleFileChange = (index, file) => {
    const updated = [...sections];
    const preview = URL.createObjectURL(file);
    updated[index].content = { file, preview };
    setSections(updated);
  };

  const handleSubmit = async () => {
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

    formData.append("data", JSON.stringify({ title, sections: formattedSections }));

    try {
      await axios.post(getFullUrl(BASE_PATH), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Blog submitted!");
      setTitle("");
      setSections([]);
    } catch (error) {
      console.error(error);
      alert("Error submitting blog");
    }
  };

  return (
    <div className="bl-editor">
      <h2>Create Blog</h2>

      <label>Blog Title</label>
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="bl-editor-toolbar" style={{ marginTop: "1rem" }}>
        {["heading", "paragraph", "list", "image", "video"].map((type) => (
          <button key={type} onClick={() => addSection(type)}>
            + {type}
          </button>
        ))}
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bl-editor-section">
          <label>{section.type.toUpperCase()}</label>

          {section.type === "heading" && (
            <input
              type="text"
              value={section.content}
              onChange={(e) => updateSection(index, e.target.value)}
            />
          )}

          {section.type === "paragraph" && (
            <textarea
              value={section.content}
              onChange={(e) => updateSection(index, e.target.value)}
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
                  onChange={(e) => updateSection(index, e.target.value, i)}
                  style={{ marginBottom: "5px" }}
                />
              ))}
              <button onClick={() => addListItem(index)} style={{ marginTop: "5px" }}>
                + Add List Item
              </button>
            </div>
          )}

          {section.type === "image" && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
              />
              {section.content.preview && (
                <img src={section.content.preview} alt="preview" style={{ width: "100%", maxHeight: "300px" }} />
              )}
            </div>
          )}

          {section.type === "video" && (
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
              />
              {section.content.preview && (
                <video src={section.content.preview} controls style={{ width: "100%", maxHeight: "300px" }} />
              )}
            </div>
          )}
        </div>
      ))}

      <button className="bl-editor-submit" onClick={handleSubmit}>
        Submit Blog
      </button>
    </div>
  );
};

export default BlogEditor;
