// src/components/BlogHome.js
import React, { useState, useEffect } from "react";
import "./css/ShowcaseWork.css";
import { getBlogs, incrementBlogView } from "../../adminServices/AdminShowcase";
import { getFullUrl } from "../../utils/apiUrl"; // adjust relative path

export default function ShowcaseWork() {
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
      <section className="section_showcase">
        <h3 className="sectionTitle">
          <span className="icon"></span> What we have done
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

        <div className="showcase-container">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog, index) => {
              const mediaSection = blog.sections.find(
                (section) =>
                  section.type === "image" || section.type === "video"
              );

              const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
              const mediaUrl = mediaSection
                ? mediaSection.content
                : "";

              return (
                <div
                  key={blog._id || index}
                  className="showcase-home"
                  onClick={() => handleReadMore(blog)}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="showcase-media-container">
                    {mediaSection?.type === "video" ? (
                      <>
                        <video
                          className="showcase-media"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        >
                          <source
                            src={mediaUrl}
                            type={`video/${mediaUrl.split(".").pop()}`}
                          />
                        </video>
                        <div className="video-play-icon">
                          <svg viewBox="0 0 24 24" width="48" height="48">
                            <path
                              fill="white"
                              d="M8,5.14V19.14L19,12.14L8,5.14Z"
                            />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div
                        className="showcase-media"
                        style={{ backgroundImage: `url(${mediaUrl})` }}
                      />
                    )}
                  </div>
                  <h3 className="title">{blog.title}</h3>
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
                      backgroundImage: `url(${
                        mediaSection.content
                      })`,
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
                  ← Back to Showcase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
