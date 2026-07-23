import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const BottomContact = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((v) => !v);

  // Esc closes the drawer + lock scroll while open
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e) => e.key === "Escape" && setIsExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  const contactDetails = [
    { icon: <FaMapMarkerAlt />, text: "House 5, Road 2, Block J, Banani, Dhaka 1212" },
    { icon: <FaClock />,        text: "We are open 24/7" },
    { icon: <FaPhone />,        text: "+880 1521 112229" },
    { icon: <FaEnvelope />,     text: "info@theatives.com" },
  ];

  const socials = [
    { icon: <FaFacebookF />,  url: "https://www.facebook.com/share/16tW4yPvKE/",              label: "Facebook" },
    { icon: <FaYoutube />,    url: "https://youtube.com/@theatives?si=UexZU07WBFKmv1HW",       label: "Youtube" },
    { icon: <FaInstagram />,  url: "https://www.instagram.com/theatives_?igsh=MXhwaTNid2gwYmxyaw==", label: "Instagram" },
    { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/company/theatives/posts/",        label: "LinkedIn" },
  ];

  return (
    <div className={`bottom-contact ${isExpanded ? "expanded" : ""}`}>
      {!isExpanded ? (
        <button className="contact-toggle" onClick={toggleExpand}>
          Contact Us
        </button>
      ) : (
        <div className="contact-content">
          <button className="close-contact" onClick={toggleExpand} aria-label="Close">
            <FaTimes />
          </button>

          <h3>Get in Touch</h3>

          <div className="contactMain">
            <div className="contact-form-container">
              <form className="contact-form">
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Email Address" required />
                <select defaultValue="">
                  <option value="" disabled>Select Service</option>
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
                  <p>Connect with us</p>
                  <div className="social-icons">
                    {socials.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                      >
                        {s.icon}
                      </a>
                    ))}
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