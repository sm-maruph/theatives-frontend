// src/components/BlogHome.js
import React, { useState, useEffect } from "react";
import "./css/BlogList.css";
import { getBlogs, incrementBlogView } from "../../adminServices/AdminBlog";
import { getFullUrl } from "../../utils/apiUrl"; // adjust relative path


export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(blogs.map((blog) => blog.category))),
  ];

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  const handleReadMore = async (blog) => {
    try {
      await incrementBlogView(blog.id); // update view count
    } catch (error) {
      // optional: toast or silently fail
    }
    setSelectedBlog(blog);
  };

  const closeModal = () => {
    setSelectedBlog(null);
  };

  function timeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
  }

  return (
    <>
      <section className="section_blogs">
        <h3 className="sectionTitle">
          <span className="icon">📝</span> Latest Blog Posts
        </h3>

        <div className="blog-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blogs-container">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => {
              const mediaSection = blog.sections.find(
                (section) =>
                  section.type === "image" || section.type === "video"
              );

              const thumbnail = mediaSection
                ? mediaSection.content
                : "";

              return (
                <div
                  key={blog._id || index}
                  className="blog-card-home"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="blog-card-inner">
                    <div
                      className="blog-image"
                      style={{ backgroundImage: `url(${thumbnail})` }}
                    ></div>
                    <div className="blog-content">
                      <div className="blog-header">
                        <h3>{blog.title.split(":"[0])}</h3>
                        {blog.title.split(":")[1] && (
                          <h4>{blog.title.split(":")[1]}</h4>
                        )}
                      </div>
                      <p className="blog-date">
                        <p className="blog-date">
                          ⏱︎ {timeAgo(blog.created_at)}
                        </p>
                        <p className="blog-date">
                          👁 {(blog.views)} times
                        </p>
                      </p>
                      <p className="blog-summary">
                        {blog.sections
                          .find((s) => s.type === "paragraph")
                          ?.content?.slice(0, 100)}
                        ...
                      </p>
                      <div className="blog-footer">
                        <span className="blog-category">{blog.category}</span>
                        <button
                          className="read-more"
                          onClick={() => handleReadMore(blog)}
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-blogs">No blog posts found in this category.</p>
          )}
        </div>
      </section>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="blog-modal-overlay">
          <div className="blog-modal">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            {(() => {
              const mediaSection = selectedBlog.sections.find(
                (s) => s.type === "image" || s.type === "video"
              );

              if (mediaSection?.type === "image") {
                return (
                  <div
                    className="blog-modal-image"
                    style={{
                      backgroundImage:  `url(${mediaSection.content})`,
                    }}
                  ></div>
                );
              }

              if (mediaSection?.type === "video") {
                return (
                  <video
                    className="blog-modal-video"
                    src={mediaSection.content}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      objectFit: "cover",
                    }}
                  />
                );
              }

              return null;
            })()}

            <div className="blog-modal-content">
              <div className="blog-modal-header">
                <h2>{selectedBlog.title}</h2>
                <div className="blog-meta">
                  <span className="blog-author">© By Theatives</span>
                  <span className="blog-date">
                    ⏱︎ {timeAgo(selectedBlog.created_at)}
                  </span>
                  <span className="blog-read-time">
                    👁 {selectedBlog.views} Times
                  </span>
                  <span className="blog-modal-category">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>
              <div className="blog-modal-body">
                {selectedBlog.sections.map((section, idx) => {
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
                          src={section.content}
                          alt="Blog"
                          style={{ maxWidth: "100%", margin: "15px 0" }}
                        />
                      );
                    case "video":
                      return (
                        <video
                          key={idx}
                          src={section.content}
                          controls
                          style={{ maxWidth: "100%", margin: "15px 0" }}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
              <div className="blog-modal-footer">
                <button className="back-button" onClick={closeModal}>
                  ← Back to Articles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
