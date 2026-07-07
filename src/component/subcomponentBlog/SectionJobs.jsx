import React, { useState, useEffect } from "react";
// import { getCareers } from "../../adminServices/AdminCareerApi";

// ---- DUMMY DATA (remove when backend is ready) ----
const DUMMY_JOBS = [
  {
    id: 1,
    position: "Frontend Developer",
    status: "Active",
    type: "Full-time",
    description: "Build and maintain our React-based web experiences.",
    requirements: "2+ years React, strong CSS, REST API experience.",
  },
  {
    id: 2,
    position: "UI/UX Designer",
    status: "Active",
    type: "Full-time",
    description: "Design intuitive interfaces for web and mobile products.",
    requirements: "Portfolio required, proficiency in Figma.",
  },
  {
    id: 3,
    position: "Motion Graphics Artist",
    status: "Closed",
    type: "Contract",
    description: "Create animated content for campaigns and social media.",
    requirements: "After Effects mastery, showreel required.",
  },
  {
    id: 4,
    position: "Backend Developer",
    status: "Active",
    type: "Remote",
    description: "Develop and scale our Node.js APIs and databases.",
    requirements: "Node.js, SQL, and cloud deployment experience.",
  },
];
// ---------------------------------------------------

export default function SectionJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      // ---- REAL BACKEND (uncomment when ready) ----
      // const data = await getCareers();
      // setJobs(data);

      // ---- DUMMY (delete this line when backend is ready) ----
      setJobs(DUMMY_JOBS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section_jobs">
      <br />
      <h3 className="sectionTitle">
        <span className="icon">🚀</span> Job Openings
      </h3>
      <div className="jobs-container">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              key={job.id}
              className={`job-card ${job.status.toLowerCase()}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="job-card-header">
                <h3>{job.position}</h3>
                <span className={`status-bubble ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </div>
              <div className="job-details">
                <p>
                  <span className="detail-label">Type:</span> {job.type}
                </p>
                <p>
                  <span className="detail-label">Description:</span>{" "}
                  {job.description}
                </p>
                <p>
                  <span className="detail-label">Requirements:</span>{" "}
                  {job.requirements}
                </p>
              </div>
              {job.status === "Active" && (
                <button className="apply-button">Apply Now</button>
              )}
            </div>
          ))
        ) : (
          <p className="no-jobs">No job openings at the moment.</p>
        )}
      </div>
    </section>
  );
}
