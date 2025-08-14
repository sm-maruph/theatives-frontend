import "../css/About.css"; // Ensure this file contains the CSS classes used
import workBg from '../../assets/images/work.png';
import './css/WorkContainer.css';
import "../css/About.css"

const WorkContainer = () => {
  return (
    <div className="about-container">
          <div className="about-image">
            <img 
              src={workBg} 
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

export default WorkContainer;
