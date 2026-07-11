import "./css/BlogContainer.css";
import BlogBg from "../../assets/images/blog.png";

const BlogContainer = () => {
  return (
    <div className="bl-container">
      <div className="bl-image">
        <img src={BlogBg} alt="Our creative team working together" />
      </div>

      <div className="bl-body">
        <div className="bl-details">
          <p>
            Theatives is a next-generation multimedia design agency that blends
            creativity, technology, and storytelling to deliver innovative
            digital experiences.
          </p>
          <p>
            Our core studios — Creative, Tech, and Game — cover CGI advertising,
            3D animation, product visualization, web and app development, and
            immersive game design.
          </p>
          <p>
            By combining artistic vision with advanced technology, we help
            brands stand out through high-quality visuals, engaging interactive
            experiences, and cutting-edge digital innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;
