import React, { useState, useEffect } from "react";
// import { getAllGallerys } from "../../adminServices/GalleryServices";
// import { getFullUrl } from "../../utils/apiUrl";
import "./Gallery.css";
import "./css/client.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_GALLERY = [
  { id: 1, title: "Team Offsite 2024",  description: "Our annual creative retreat in the hills.", media: "https://graphicsfamily.com/wp-content/uploads/edd/2022/01/Professional-website-banner-with-yellow-shapes-1180x627.jpg" },
  { id: 2, title: "Studio Life",        description: "A glimpse into a regular day at Theatives.", media: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHEkowoBRF9d0u7B1A1g0MCHz0-eZG_aYXl8RVhw27e8HDTFSyCF6XAf8o&s=10" },
  { id: 3, title: "Behind The Scenes",  description: "Shooting our latest campaign.", media: "https://graphicsfamily.com/wp-content/uploads/edd/2023/04/Business-Website-Banner-Design-with-White-and-Green-scaled.jpg" },
  { id: 4, title: "Brainstorm Session", description: "Where the big ideas start.", media: "https://graphicsfamily.com/wp-content/uploads/edd/2023/04/Business-Website-Banner-Design-with-White-and-Green-scaled.jpg" },
  { id: 5, title: "Launch Party",       description: "Celebrating a successful product launch.", media: "https://img.magnific.com/free-vector/professional-website-banner-with-abstract-red-shapes_1361-1812.jpg?semt=ais_hybrid&w=740&q=80" },
];
// ---------------------------------------------------

function GallerySection() {
  const [gallerys, setGallerys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadGallerys();
  }, []);

  const loadGallerys = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await getAllGallerys();
      // setGallerys(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setGallerys(DUMMY_GALLERY);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="sectionAboutFour">
      <h4 className="sectionTitle">Life At Theatives</h4>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="gallery-grid">
        {gallerys.map((gallery) => (
          <div
            key={gallery.id}
            className="gallery-card"
            onClick={() => setSelectedItem(gallery)}
          >
            {isVideo(gallery.media) ? (
              <>
                <video className="gallery-media" muted playsInline preload="metadata">
                  <source src={gallery.media} type="video/mp4" />
                </video>
                <span className="gallery-play">▶</span>
              </>
            ) : (
              <img
                src={gallery.media}
                alt={gallery.title}
                className="gallery-media"
                loading="lazy"
              />
            )}

            {/* caption rises on hover; hidden behind the scrim at rest */}
            <div className="gallery-caption">
              <h3>{gallery.title}</h3>
              <p>{gallery.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal — unchanged */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          {/* <ParticlesComponent theme="dark" /> */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span
              className="close-button"
              onClick={() => setSelectedItem(null)}
            >
              &times;
            </span>
            {isVideo(selectedItem.media) ? (
              <video controls className="modal-media">
                <source src={selectedItem.media} type="video/mp4" />
              </video>
            ) : (
              <img
                src={selectedItem.media}
                alt={selectedItem.title}
                className="modal-media"
              />
            )}
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GallerySection;