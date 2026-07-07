// src/components/Blogs.js
import React, { useState, useEffect } from "react";
import "./css/BlogList.css";
// import { getBlogs, incrementBlogView } from "../../adminServices/AdminBlog";
// import { getFullUrl } from "../../utils/apiUrl";

// ---- DUMMY DATA (remove when backend is ready) ----
// Shape: { id, title, category, created_at, views, sections: [...] }
// Section types: heading | paragraph | list (array content) | image | video
const DUMMY_BLOGS = [
  {
    id: 1,
    title: "Design Trends 2025: What's Next",
    category: "Design",
    created_at: "2025-06-10T09:00:00Z",
    views: 1240,
    sections: [
      { type: "image", content: "https://placehold.co/800x450/2b2d42/ffffff?text=Design+Trends" },
      { type: "paragraph", content: "The design world is shifting fast this year. From bold typography to immersive motion, here's what we're seeing shape brands in 2025 and beyond." },
      { type: "heading", content: "Bold & Expressive" },
      { type: "list", content: ["Oversized type", "Kinetic layouts", "Rich gradients"] },
    ],
  },
  {
    id: 2,
    title: "Building for Speed: Web Performance",
    category: "Development",
    created_at: "2025-06-22T15:30:00Z",
    views: 856,
    sections: [
      { type: "image", content: "https://placehold.co/800x450/ef233c/ffffff?text=Web+Performance" },
      { type: "paragraph", content: "A fast site is a successful site. We break down the techniques that keep load times low and users engaged across devices." },
      { type: "heading", content: "Core Web Vitals" },
    ],
  },
  {
    id: 3,
    title: "The Art of Storytelling in Video",
    category: "Video",
    created_at: "2025-07-01T11:15:00Z",
    views: 432,
    sections: [
      { type: "video", content: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { type: "paragraph", content: "Great video isn't about production value alone; it's about story. Here's how we approach narrative in every project we shoot." },
    ],
  },
  {
    id: 4,
    title: "Branding on a Budget",
    category: "Design",
    created_at: "2025-07-05T08:45:00Z",
    views: 178,
    sections: [
      { type: "image", content: "https://placehold.co/800x450/8d99ae/ffffff?text=Branding" },
      { type: "paragraph", content: "You don't need a huge budget to build a memorable brand. These practical tips help small businesses punch above their weight." },
    ],
  },
];
// ---------------------------------------------------

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // ---- REAL BACKEND (uncomment when ready) ----
        // const data = await getBlogs();
        // setBlogs(data);

        // ---- DUMMY (delete this line when backend is ready) ----
        setBlogs(DUMMY_BLOGS);
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
      // ---- REAL BACKEND (uncomment when ready) ----
      // await incrementBlogView(blog.id); // update view count
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

              const thumbnail = mediaSection ? mediaSection.content : "";

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
                          👁 {blog.views} times
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
                      backgroundImage: `url(${mediaSection.content})`,
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
