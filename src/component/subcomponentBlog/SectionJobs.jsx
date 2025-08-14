import React, { useState, useEffect } from "react";
import { getCareers } from "../../adminServices/AdminCareerApi";

export default function SectionJobs() {
    const [jobs, setJobs] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
      
        // Fetch services on mount
        useEffect(() => {
          loadJobs();
        }, []);
      
        const loadJobs = async () => {
          setLoading(true);
          try {
            const data = await getCareers();
            setJobs(data);
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

  )
}
