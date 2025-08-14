import React, { useEffect, useState } from "react";
import axios from "axios";
import './css/BlogList.css';
import { getFullUrl } from '../../utils/apiUrl';
const BASE_PATH = "/api/admin/dashboardservices/blogs";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(getFullUrl(BASE_PATH));
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load blogs.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h1>Blogs</h1>
      {blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <div key={blog.id} style={{ marginBottom: "40px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
          <h2>{blog.title}</h2>

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
                    src={getFullUrl(section.content)} // Make sure the backend serves this path
                    alt="Blog section"
                    style={{ maxWidth: "100%", margin: "15px 0" }}
                  />
                );

              case "video":
                return (
                  <video
                    key={idx}
                    src={getFullUrl(section.content)} // Make sure the backend serves this path
                    controls
                    style={{ maxWidth: "100%", margin: "15px 0" }}
                  />
                );

              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
