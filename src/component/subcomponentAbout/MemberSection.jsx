import './css/member.css';
import React, { useState, useEffect } from "react";
// import { fetchMembers } from "../../adminServices/AdminMembersApi";
// import { getFullUrl } from "../../utils/apiUrl";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_MEMBERS = [
  { id: 1, name: "Ayesha Rahman",  nickname: "Ash",   position: "Creative Director", member_image: "https://placehold.co/400x400/2b2d42/ffffff?text=Ayesha", altText: "Ayesha Rahman" },
  { id: 2, name: "Tanvir Hasan",   nickname: "Tanu",  position: "Lead Developer",    member_image: "https://placehold.co/400x400/8d99ae/ffffff?text=Tanvir", altText: "Tanvir Hasan" },
  { id: 3, name: "Nabila Karim",   nickname: "Nab",   position: "UI/UX Designer",    member_image: "https://placehold.co/400x400/ef233c/ffffff?text=Nabila", altText: "Nabila Karim" },
  { id: 4, name: "Rafiq Islam",    nickname: "Raf",   position: "Motion Artist",     member_image: "https://placehold.co/400x400/edf2f4/2b2d42?text=Rafiq",  altText: "Rafiq Islam" },
];
// ---------------------------------------------------

const MemberSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await fetchMembers();
      // setMembers(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setMembers(DUMMY_MEMBERS);
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
