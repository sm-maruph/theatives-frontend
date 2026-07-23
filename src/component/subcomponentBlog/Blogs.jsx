// src/components/subcomponentBlog/Blogs.jsx
import React, { useState, useEffect } from "react";
import "./css/BlogList.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";
// import { getBlogs, incrementBlogView } from "../../adminServices/AdminBlog";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_BLOGS = [
  {
    id: 1,
    title: "Design Trends 2025: What's Next",
    category: "Design",
    created_at: "2025-06-10T09:00:00Z",
    views: 1240,
    sections: [
      { type: "image", content: "https://placehold.co/800x450/871f27/ffc46b?text=Design+Trends" },
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
      { type: "image", content: "https://placehold.co/800x450/5c141a/ff5c72?text=Web+Performance" },
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
      { type: "image", content: "https://placehold.co/800x450/a32b34/ffc46b?text=Branding" },
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

        // ---- DUMMY ----
        setBlogs(DUMMY_BLOGS);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!selectedBlog) return;
    const onKey = (e) => e.key === "Escape" && setSelectedBlog(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedBlog]);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs =
    activeCategory === "All" ? blogs : blogs.filter((b) => b.category === activeCategory);

  const handleReadMore = async (blog) => {
    try {
      // await incrementBlogView(blog.id);
    } catch (error) {}
    setSelectedBlog(blog);
  };

  const closeModal = () => setSelectedBlog(null);

  function timeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const s = Math.floor((now - createdDate) / 1000);
    if (s < 60) return `${s} seconds ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} minute${m !== 1 ? "s" : ""} ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hour${h !== 1 ? "s" : ""} ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} day${d !== 1 ? "s" : ""} ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} month${mo !== 1 ? "s" : ""} ago`;
    const y = Math.floor(mo / 12);
    return `${y} year${y !== 1 ? "s" : ""} ago`;
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
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
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
                (s) => s.type === "image" || s.type === "video"
              );
              const thumbnail = mediaSection ? mediaSection.content : "";
              const [mainTitle, subTitle] = blog.title.split(":");

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
                        <h3>{mainTitle}</h3>
                        {subTitle && <h4>{subTitle.trim()}</h4>}
                      </div>
                      <div className="blog-date">
                        <span>⏱︎ {timeAgo(blog.created_at)}</span>
                        <span>👁 {blog.views} views</span>
                      </div>
                      <p className="blog-summary">
                        {blog.sections.find((s) => s.type === "paragraph")?.content?.slice(0, 100)}…
                      </p>
                      <div className="blog-footer">
                        <span className="blog-category">{blog.category}</span>
                        <button className="read-more" onClick={() => handleReadMore(blog)}>
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
        <div className="bl-modal-overlay" onClick={closeModal}>
          <ParticlesComponent theme="dark" />
          <div className="bl-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bl-modal-close" onClick={closeModal}>&times;</button>

            {(() => {
              const mediaSection = selectedBlog.sections.find(
                (s) => s.type === "image" || s.type === "video"
              );
              if (mediaSection?.type === "image") {
                return (
                  <div
                    className="bl-modal-image"
                    style={{ backgroundImage: `url(${mediaSection.content})` }}
                  ></div>
                );
              }
              if (mediaSection?.type === "video") {
                return (
                  <video
                    className="bl-modal-video"
                    src={mediaSection.content}
                    controls
                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                  />
                );
              }
              return null;
            })()}

            <div className="bl-modal-content">
              <div className="bl-modal-header">
                <h2>{selectedBlog.title}</h2>
                <div className="bl-modal-meta">
                  <span className="bl-modal-author">© By Theatives</span>
                  <span>⏱︎ {timeAgo(selectedBlog.created_at)}</span>
                  <span>👁 {selectedBlog.views} times</span>
                  <span className="bl-modal-category">{selectedBlog.category}</span>
                </div>
              </div>

              <div className="bl-modal-body">
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
                      return <img key={idx} src={section.content} alt="Blog" style={{ maxWidth: "100%", margin: "15px 0" }} />;
                    case "video":
                      return <video key={idx} src={section.content} controls style={{ maxWidth: "100%", margin: "15px 0" }} />;
                    default:
                      return null;
                  }
                })}
              </div>

              <div className="bl-modal-footer">
                <button className="bl-modal-back" onClick={closeModal}>
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
