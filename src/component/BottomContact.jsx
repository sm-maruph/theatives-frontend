import React, { useState } from "react";
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
} from "react-icons/fa";

const BottomContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const contactDetails = [
    {
      icon: <FaMapMarkerAlt />,
      text: "House - 5, Road - 2, Block - J, Banani, Dhaka 1212",
    },
    {
      icon: <FaClock />,
      text: "We are open 24/7",
    },
    {
      icon: <FaPhone />,
      text: "+880 1521 112229",
    },
    {
      icon: <FaEnvelope />,
      text: "info@batterylowinteractive.com",
    },
  ];

  return (
    <div className={`bottom-contact ${isExpanded ? "expanded" : ""}`}>
      {!isExpanded ? (
        <button className="contact-toggle" onClick={toggleExpand}>
          Contact Us
        </button>
      ) : (
        <div className="contact-content">
          <button className="close-contact" onClick={toggleExpand}>
            <FaTimes />
          </button>
          <h3>Get in Touch</h3>
          <div className="contactMain">
            <div className="contact-form-container">
              <form className="contact-form">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Email Address" required />
                <select>
                  <option value="">Select Service</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="design">UI/UX Design</option>
                </select>
                <textarea placeholder="Type your message..." rows="4" required />
                <button type="submit">Send Message</button>
              </form>
            </div>

            <div className="contact-info-container">
              <div className="contact-info">
                {contactDetails.map((item, idx) => (
                  <div className="info-item" key={idx}>
                    <span className="icon">{item.icon}</span>
                    <p>{item.text}</p>
                  </div>
                ))}
                <div className="social-links">
                  <h2>Connect with us</h2>
                   <div className="social-icons">
          <a
            href="https://www.facebook.com/share/16tW4yPvKE/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://youtube.com/@theatives?si=UexZU07WBFKmv1HW"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Youtube"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href="https://www.instagram.com/theatives_?igsh=MXhwaTNid2gwYmxyaw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/theatives/posts/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomContact;
