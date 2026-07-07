import React, { useState, useEffect } from "react";
// import { getAllGallerys } from "../../adminServices/GalleryServices";
// import { getFullUrl } from "../../utils/apiUrl";
import "./Gallery.css";
import "./css/client.css";
import ParticlesComponent from "../animationSubcomponent/ParticlesComponent";

// ---- DUMMY DATA (remove when backend is ready) ----
// Includes one video item so you can test the isVideo() branch.
const DUMMY_GALLERY = [
  { id: 1, title: "Team Offsite 2024",  description: "Our annual creative retreat in the hills.", media: "https://placehold.co/600x400/2b2d42/ffffff?text=Offsite" },
  { id: 2, title: "Studio Life",        description: "A glimpse into a regular day at Theatives.", media: "https://placehold.co/600x400/ef233c/ffffff?text=Studio" },
  { id: 3, title: "Behind The Scenes",  description: "Shooting our latest campaign.", media: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { id: 4, title: "Brainstorm Session", description: "Where the big ideas start.", media: "https://placehold.co/600x400/8d99ae/ffffff?text=Brainstorm" },
  { id: 5, title: "Launch Party",       description: "Celebrating a successful product launch.", media: "https://placehold.co/600x400/edf2f4/2b2d42?text=Launch" },
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
              <video className="gallery-media" muted>
                <source src={gallery.media} type="video/mp4" />
              </video>
            ) : (
              <img
                src={gallery.media}
                alt={gallery.title}
                className="gallery-media"
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <ParticlesComponent theme="dark" />
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
