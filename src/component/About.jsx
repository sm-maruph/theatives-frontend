// src/components/About.js
import React from "react";
import "./css/About.css";
import TestimonialSlider from "./TestmonialSlider";
import ClientsSection from "./subcomponentAbout/ClientsSection";
import MemberSection from "./subcomponentAbout/MemberSection";
// We'll create this CSS file next
import AboutContainer from "./subcomponentAbout/AboutContainer";
import GallerySection from "./subcomponentAbout/GallerySection";

const About = () => (
  <div className="content-about-wrapper">
    <AboutContainer />
    <div className="secondAboutsection">
      <MemberSection />
    </div>

    <div className="thirdAboutsection">
      <TestimonialSlider />
    </div>
    <div className="sectionAboutFour">
      <ClientsSection />
    </div>
    <div className="sectionAboutFive">
      <GallerySection />
    </div>
  </div>
);

export default About;
