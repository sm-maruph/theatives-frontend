import "../css/Services.css"; // Ensure this file contains the CSS classes used
import BlogBg from '../../assets/images/blog.png';
import "../css/About.css"
const ServiceContainer = () => {
  return (
    <div className="about-container">
          <div className="about-image">
            <img 
              src={BlogBg} 
              alt="Our creative team working together" 
            />
          </div>
          <div className="about-description">
            <div className="details">
              <p>
                We are a creative powerhouse specializing in social media marketing, content
     creation, and high-quality CGI advertisements. At Theatives, we help brands tell
     their stories with visually striking content and innovative campaigns that captivate
     audiences and drive results.
              </p>
            </div>
          </div>
        </div>
  );
};

export default ServiceContainer;
