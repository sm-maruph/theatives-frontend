// src/components/About.jsx
import React from "react";
import "./css/About.css";
import TestimonialSlider from "./subcomponentAbout/TestmonialSlider";
import ClientsSection from "./subcomponentAbout/ClientsSection";
import MemberSection from "./subcomponentAbout/MemberSection";
import AboutContainer from "./subcomponentAbout/AboutContainer";
import GallerySection from "./subcomponentAbout/GallerySection";

/* All About-page classes are namespaced `ab-*` and scoped under
   `.about-page`, so nothing here can collide with Gallery, Works,
   Blog, or any other page's CSS. */

const About = () => (
  <div className="about-page">
    {/* fixed 3D background scene — sits behind everything, no pointer events */}
    <div className="ab-scene" aria-hidden="true">
      <div className="ab-scene__aurora" />
      <div className="ab-scene__ceiling" />
      <div className="ab-scene__floor" />
      <div className="ab-scene__shards">
        <span className="ab-shard" />
        <span className="ab-shard" />
        <span className="ab-shard" />
        <span className="ab-shard" />
        <span className="ab-shard" />
      </div>
      <div className="ab-scene__vignette" />
    </div>

    <div className="ab-hero">
      <AboutContainer />
    </div>

    <div className="ab-members">
      <MemberSection />
    </div>

    <div className="ab-testimonials">
      <TestimonialSlider />
    </div>

    <div className="ab-clients">
      <ClientsSection />
    </div>

    <div className="ab-gallery">
      <GallerySection />
    </div>
  </div>
);

export default About;
