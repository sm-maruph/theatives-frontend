import "../css/Services.css"; // Ensure this file contains the CSS classes used
import serviceBg from "../../assets/images/service.png";
import "../css/About.css";

const ServiceContainer = () => {
  return (
    <div className="about-container">
      <div className="about-image">
        <img src={serviceBg} alt="Our creative team working together" />
      </div>
      <div className="about-description">
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

export default ServiceContainer;
