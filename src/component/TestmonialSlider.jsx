import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { fetchReviews } from "../adminServices/AdminReviewsApi";
import { getFullUrl } from "../utils/apiUrl";
import './css/About.css'


function TestimonialSlider() {
  const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    // Fetch services on mount
    useEffect(() => {
      loadReviews();
    }, []);
  
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchReviews();
        setReviews(data);
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
    autoplaySpeed: 4000
  };

  return (
    <div className="thirdsection">
      <h4 className="sectionTitle">What Our Clients Say</h4>
      <Slider {...settings}>
        {reviews.map((review) => (
          <div className="testimonial-slide" key={review.id}>
            <div className="left-panel">
              <span className="quote-mark">❝</span>
              <p>{review.review_text}</p>
            </div>
            <div className="right-panel">
              <img src={getFullUrl(review.reviewer_image)} alt={review.reviewer_name} className="reviewer-img" />
              <h4>- {review.reviewer_name.toUpperCase()} -</h4>
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
