import React, { useState, useEffect } from "react";
import { getAllGallerys } from "../../adminServices/GalleryServices";
import { getFullUrl } from "../../utils/apiUrl";
import "./Gallery.css"; // Assuming you add styles here
import './css/client.css'

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
      const data = await getAllGallerys();
      setGallerys(data);
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedItem(null)}>
              &times;
            </span>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description}</p>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default GallerySection;
