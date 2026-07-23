// src/components/subcomponentWork/ShowcaseWork.jsx
import React, { useState, useEffect } from "react";
import "./css/ShowcaseWork.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";
// import { getBlogs, incrementBlogView } from "../../adminServices/AdminShowcase";
// import { getFullUrl } from "../../utils/apiUrl";

// ---- DUMMY DATA (remove when backend is ready) ----
// Section types: heading | paragraph | list (array) | image | video
const DUMMY_BLOGS = [
  {
    id: 1,
    title: "Rebranding Nimbus Studio",
    category: "Branding",
    created_at: "2025-05-20T10:00:00Z",
    sections: [
      { type: "image", content: "https://static.vecteezy.com/system/resources/thumbnails/027/575/466/small/business-horizontal-banner-template-design-it-is-suitable-for-social-media-advertising-fashion-brand-promotion-digital-marketing-etc-vector.jpg" },
      { type: "heading", content: "A Fresh Identity" },
      { type: "paragraph", content: "We reimagined Nimbus Studio's brand from the ground up, delivering a cohesive visual system." },
      { type: "list", content: ["New logo suite", "Brand guidelines", "Social templates"] },
    ],
  },
  {
    id: 2,
    title: "Product Launch Film",
    category: "Video",
    created_at: "2025-06-02T14:30:00Z",
    sections: [
      { type: "video", content: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { type: "heading", content: "Bringing the Story to Life" },
      { type: "paragraph", content: "A 60-second launch film that captured the essence of the product." },
    ],
  },
  {
    id: 3,
    title: "E-commerce Redesign",
    category: "Web Design",
    created_at: "2025-06-18T09:15:00Z",
    sections: [
      { type: "image", content: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhxDIq64xas1hTDITsNeM1h8qg_AjpoJlLi2c9Gg_vU0ymetq8BSpJMzL&s=10" },
      { type: "paragraph", content: "A conversion-focused redesign that lifted checkout completion by 34%." },
    ],
  },
  {
    id: 4,
    title: "Campaign Microsite",
    category: "Web Design",
    created_at: "2025-07-01T16:45:00Z",
    sections: [
      { type: "image", content: "https://static.vecteezy.com/system/resources/previews/017/764/762/non_2x/banner-for-sale-people-rush-to-shop-with-bags-the-girl-runs-to-the-supermarket-young-people-with-bags-vector.jpg" },
      { type: "heading", content: "Interactive & Playful" },
      { type: "paragraph", content: "A scroll-driven microsite built for a seasonal marketing push." },
    ],
  },
];
// ---------------------------------------------------

export default function ShowcaseWork() {
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

  // lock page scroll + Esc-to-close while the modal is open
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
      // await incrementBlogView(blog.id);
    } catch (error) {
      // optional: toast or silently fail
    }
    setSelectedBlog(blog);
  };

  const closeModal = () => setSelectedBlog(null);

  function timeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
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
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
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
                (section) => section.type === "image" || section.type === "video"
              );
              const mediaUrl = mediaSection ? mediaSection.content : "";

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
                        <video className="showcase-media" muted loop playsInline preload="metadata">
                          <source src={mediaUrl} type={`video/${mediaUrl.split(".").pop()}`} />
                        </video>
                        <div className="video-play-icon">
                          <svg viewBox="0 0 24 24" width="48" height="48">
                            <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
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
        <div className="sw-modal-overlay" onClick={closeModal}>
          {/* particle background behind the modal */}
          <ParticlesComponent theme="dark" />

          <div className="sw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sw-modal-close" onClick={closeModal}>
              &times;
            </button>

            {(() => {
              const mediaSection = selectedBlog.sections.find(
                (s) => s.type === "image" || s.type === "video"
              );

              if (mediaSection?.type === "image") {
                return (
                  <div
                    className="sw-modal-image"
                    style={{ backgroundImage: `url(${mediaSection.content})` }}
                  ></div>
                );
              }

              if (mediaSection?.type === "video") {
                return (
                  <video
                    className="sw-modal-video"
                    src={mediaSection.content}
                    controls
                    style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                  />
                );
              }

              return null;
            })()}

            <div className="sw-modal-content">
              <div className="sw-modal-header">
                <h2>{selectedBlog.title}</h2>
                <div className="sw-modal-meta">
                  <span className="sw-modal-author">© By Theatives</span>
                  <span className="sw-modal-date">⏱︎ {timeAgo(selectedBlog.created_at)}</span>
                  <span className="sw-modal-category">{selectedBlog.category}</span>
                </div>
              </div>

              <div className="sw-modal-body">
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
                        <img key={idx} src={section.content} alt="Blog"
                          style={{ maxWidth: "100%", margin: "15px 0" }} />
                      );
                    case "video":
                      return (
                        <video key={idx} src={section.content} controls
                          style={{ maxWidth: "100%", margin: "15px 0" }} />
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              <div className="sw-modal-footer">
                <button className="sw-modal-back" onClick={closeModal}>
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