import './css/member.css'; 
import React, { useState, useEffect } from "react";
import { getAllGallerys } from "../../adminServices/GalleryServices";
import { getFullUrl } from "../../utils/apiUrl";
import { fetchMembers } from "../../adminServices/AdminMembersApi";


const MemberSection = () =>
  
  {
    const [members, setMembers] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
      
        // Fetch services on mount
        useEffect(() => {
          loadMembers();
        }, []);
      
        const loadMembers = async () => {
          setLoading(true);
          try {
            const data = await fetchMembers();
            setMembers(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
  return (
  <div className="secondSection">
    <h4 className='sectionTitle'>Meet Our Team</h4>

    <div className="team-grid">

      {/* SHOW LOADER WHEN LOADING */}
      {loading &&
        [...Array(4)].map((_, i) => (
          <div className="team-member skeleton-card" key={i}>
            <div className="member-image skeleton-box"></div>
            <div className="skeleton-text name"></div>
            <div className="skeleton-text small"></div>
            <div className="skeleton-text small"></div>
            <div className="skeleton-button"></div>
          </div>
        ))
      }

      {/* SHOW DATA WHEN DONE */}
      {!loading && members.map(member => (
        <div className="team-member" key={member.id}>
          <div className="member-image">
            <img src={member.member_image} alt={member.altText} />
          </div>
          <h6 className="member-name">{member.name}</h6>
          <p className="member-nickname">" {member.nickname} "</p>
          <p className="member-position">{member.position}</p>
          <button className='member-button'>Portfolio</button>
        </div>
      ))}
    </div>
  </div>
);

};

export default MemberSection;
