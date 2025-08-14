// src/components/BlogHome.js
import React, { useState, useEffect } from "react";
import "./css/Contact.css";
import SectionJobs from "./subcomponentBlog/SectionJobs";
import Blogs from "./subcomponentBlog/Blogs";
import BlogContainer from "./subcomponentBlog/BlogContainer"
const BlogHome = () => {
  
  return (
    <div className="bloghome-wrapper">
      <BlogContainer/>
      <SectionJobs />
      <Blogs/>
      
    </div>
  );
}

export default BlogHome;
