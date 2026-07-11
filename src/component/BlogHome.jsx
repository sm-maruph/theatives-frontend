// src/components/BlogHome.jsx
import React from "react";
import "./css/blogHome.css";
import SectionJobs from "./subcomponentBlog/SectionJobs";
import Blogs from "./subcomponentBlog/Blogs";
import BlogContainer from "./subcomponentBlog/BlogContainer";

/* All blog classes are namespaced `bl-*` under `.blog-page`.
   This page imports nothing from About/Services/Works CSS. */

const BlogHome = () => (
  <div className="blog-page">
    {/* fixed 3D scene: hex data-field + rising light columns */}
    <div className="bl-scene" aria-hidden="true">
      <div className="bl-scene__glow" />
      <div className="bl-scene__grid" />
      <div className="bl-scene__columns">
        <span className="bl-col" /><span className="bl-col" /><span className="bl-col" />
        <span className="bl-col" /><span className="bl-col" />
      </div>
      <div className="bl-scene__chips">
        <span className="bl-chip" /><span className="bl-chip" /><span className="bl-chip" />
      </div>
      <div className="bl-scene__vignette" />
    </div>

    <BlogContainer />
    <SectionJobs />
    <Blogs />
  </div>
);

export default BlogHome;
