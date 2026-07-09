import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { fetchReviews } from "../../adminServices/AdminReviewsApi";
// import { getFullUrl } from "../../utils/apiUrl";
import "./css/testmonial.css";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_REVIEWS = [
  {
    id: 1,
    review_text: "Theatives transformed our brand from the ground up. The team's creativity and attention to detail exceeded every expectation.",
    reviewer_name: "Sarah Ahmed",
    reviewer_position: "Marketing Head",
    reviewer_company: "BrightPixel Ltd.",
    reviewer_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyraoft-szrzbrjUcZe7YldxLW9zTSbl31C1nPqOU6RqUQm0b_moQjEH73&s=10",
  },
  {
    id: 2,
    review_text: "Working with this team was seamless. They delivered a stunning product on time and were a joy to collaborate with.",
    reviewer_name: "David Chen",
    reviewer_position: "Founder & CEO",
    reviewer_company: "Nimbus Studio",
    reviewer_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyraoft-szrzbrjUcZe7YldxLW9zTSbl31C1nPqOU6RqUQm0b_moQjEH73&s=10",
  },
  {
    id: 3,
    review_text: "Professional, responsive, and genuinely talented. Our engagement metrics doubled after the redesign.",
    reviewer_name: "Priya Nair",
    reviewer_position: "Product Manager",
    reviewer_company: "Cloudline",
    reviewer_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyraoft-szrzbrjUcZe7YldxLW9zTSbl31C1nPqOU6RqUQm0b_moQjEH73&s=10",
  },
];
// ---------------------------------------------------

function TestimonialSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await fetchReviews();
      // setReviews(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setReviews(DUMMY_REVIEWS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="thirdsection">
      <h4 className="sectionTitle">Our Clients Say's</h4>
      <Slider {...settings}>
        {reviews.map((review) => (
          <div className="testimonial-slide" key={review.id}>
            <div className="left-panel">
              <span className="quote-mark">❝</span>
              <p>{review.review_text}</p>
              <span className="quote-mark-bottom">❞</span>
            </div>
            <div className="right-panel">
              <img
                src={review.reviewer_image}
                alt={review.reviewer_name}
                className="reviewer-img"
              />
              <h4>{review.reviewer_name.toUpperCase()}</h4>
              <p>{review.reviewer_position}</p>
              <p>{review.reviewer_company}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default TestimonialSlider;
