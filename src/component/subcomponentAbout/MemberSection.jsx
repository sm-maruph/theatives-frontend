import '../css/About.css'; 
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
    <div className="container">
    <h3 className='sectionTitle'>Meet Our Team</h3>
    <div className="team-grid">
      {members.map(member => (
        <div className="team-member" key={member.id}>
          <div className="member-image">
            <img src={getFullUrl(member.member_image)} alt={member.altText} />
          </div>
          <h6 className="member-name">{member.name}</h6>
          <p className="member-nickname">" { member.nickname} "</p>
          <p className="member-position">{member.position}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default MemberSection;
