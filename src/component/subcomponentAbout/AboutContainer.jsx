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
            We are a creative powerhouse specializing in social media marketing,
            content creation, and high-quality CGI advertisements. At Theatives,
            we help brands tell their stories with visually striking content and
            innovative campaigns that captivate audiences and drive results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;
