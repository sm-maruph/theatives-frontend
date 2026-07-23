import React, { useState, useEffect } from "react";
import "./css/WorkSection.css";
// middle image of the ring — swap for whatever centrepiece you want
import centerImg from "../../assets/images/theatives_logo.png";
// import { getAllWorks } from "../../adminServices/workServices";

/* NOTE: `description` holds the YouTube video ID. */
const DUMMY_WORKS = [
  { id: 1, title: "Brand Film",      description: "dQw4w9WgXcQ" },
  { id: 2, title: "Product Launch",  description: "3JZ_D3ELwOQ" },
  { id: 3, title: "Explainer Video", description: "L_jWHffIx5E" },
  { id: 4, title: "Ad Campaign",     description: "e-ORhEE9VVg" },
  { id: 5, title: "Motion Reel",     description: "kJQP7kiw5Fk" },
  { id: 6, title: "Case Study",      description: "fLexgOxsZu0" },
];

export default function WorksSection() {
  const [works, setWorks] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(null); // the work playing in the modal

  useEffect(() => {
    (async () => {
      try {
        // ---- REAL BACKEND (uncomment when ready) ----
        // const data = await getAllWorks();
        // setWorks(data);

        // ---- DUMMY ----
        setWorks(DUMMY_WORKS);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // lock page scroll + Esc-to-close while the modal is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const paused = hovered || Boolean(active);

  return (
    <div className="banner">
      <div
        className={`slider ${paused ? "paused" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {works.map((work, i) => (
          <div
            className="item"
            key={work.id || i}
            style={{ "--angle": `${(360 / works.length) * i}deg` }}
            onClick={() => setActive(work)}
          >
            <div className="video-placeholder">
              <div className="video-thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${work.description}/mqdefault.jpg`}
                  alt={work.title}
                  loading="lazy"
                />
                <div className="play-icon">▶</div>
              </div>
            </div>
            <h3>{work.title}</h3>
          </div>
        ))}
      </div>

      {/* middle image — kept */}
      <div className="model">
        <img src={centerImg} alt="Theatives" />
      </div>

      {/* centered video modal */}
      {active && (
        <div className="work-modal-overlay" onClick={() => setActive(null)}>
          <div className="work-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="work-modal-close"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="work-modal-video">
              <iframe
                src={`https://www.youtube.com/embed/${active.description}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="work-modal-title">{active.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
