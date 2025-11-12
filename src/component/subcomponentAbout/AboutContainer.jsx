import "../css/About.css"; // Ensure this file contains the CSS classes used
import aboutBg from "../../assets/images/about.png";

const AboutContainer = () => {
  return (
    <div className="about-container">
      <div className="about-image">
        <img src={aboutBg} alt="Our creative team working together" />
      </div>
      <div className="about-description">
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
        <div className="details">
          <p>
            Theatives is a next-generation multimedia design agency that blends
            creativity, technology, and storytelling to deliver innovative
            digital experiences. Our core services are divided into three
            studios: Creative, Tech, and Game. We specialize in CGI advertising,
            3D animation, product visualization, web and app development, and
            immersive game design. By combining artistic vision with advanced
            technology, we help brands and businesses stand out through
            high-quality visuals, engaging interactive experiences, and
            cutting-edge digital innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;
