// src/components/Works.js
import React from 'react';
import './css/Works.css';
import WorkContainer from './subcomponentWork/WorkContainer';
import WorksSection from './subcomponentWork/WorksSection';
import MicroserviceSection from './subComponentService/MicroserviceSection';
import ShowcaseWork from './subcomponentWork/ShowcaseWork';
const Works = () => (
  <div className="content-wrapper">
    <div className="firstsection">
      <WorkContainer />
    </div>
    <div className="secondsection">
      <h3 className='sectionTitle'>Our works</h3>
      <WorksSection />
    </div>
    
      <ShowcaseWork />
  </div>
);

export default Works;