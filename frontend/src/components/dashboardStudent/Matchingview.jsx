// MatchingView.jsx
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api';

function MatchingView({ skills, cvScore, onBack }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState({}); // track applied jobs

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/jobs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.jobs.length > 0) {
          const jobsWithMatch = data.jobs.map(job => {
            const jobSkills = job.skills || [];
            const studentSkills = skills || [];

            const matchingSkills = jobSkills.filter(jobSkill =>
              studentSkills.some(s =>
                s.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(s.toLowerCase())
              )
            );

            const matchScore = jobSkills.length > 0
              ? Math.round((matchingSkills.length / jobSkills.length) * 100)
              : 50;

            return {
              ...job,
              match: Math.min(matchScore + 30, 99),
              matchingSkills
            };
          });

          jobsWithMatch.sort((a, b) => b.match - a.match);
          setJobs(jobsWithMatch);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [skills]);

  const handleApply = async (job) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: job._id,
          cvScore: cvScore,
          skills: skills
        })
      });

      const data = await res.json();

      if (res.ok) {
        setApplied(prev => ({ ...prev, [job._id]: 'applied' }));
      } else if (data.message === 'Already applied to this job') {
        setApplied(prev => ({ ...prev, [job._id]: 'already' }));
      } else {
        alert('❌ Error applying. Please try again.');
      }
    } catch (err) {
      alert('❌ Error applying. Please try again.');
    }
  };

  return (
    <div className="step-detail-view">
      <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>

      <div className="matching-view">
        <h2>🎯 Job Matching Results</h2>
        <p className="matching-intro">Based on your CV skills, here are the best internship matches:</p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
            <p>Loading jobs...</p>
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>📭</div>
            <h3>No jobs available yet</h3>
            <p>Recruiters haven't posted any jobs yet. Check back later!</p>
          </div>
        )}

        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <div className="company-logo">
                  {job.recruiter?.companyName?.[0]?.toUpperCase() ||
                   job.recruiter?.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <p className="company-name">
                    {job.recruiter?.companyName || job.recruiter?.fullName || 'Company'}
                  </p>
                </div>
                <div className={`match-badge ${job.match >= 80 ? 'high' : 'medium'}`}>
                  {job.match}% Match
                </div>
              </div>

              <div className="job-details">
                <p>📍 {job.location} • ⏱️ {job.duration || 'Not specified'}</p>
                {job.salary && <p>💰 {job.salary}</p>}

                {job.skills && job.skills.length > 0 && (
                  <div className="skills-match">
                    <strong>Required Skills:</strong>
                    <div className="skills-tags">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          background: job.matchingSkills?.some(s =>
                            s.toLowerCase() === skill.toLowerCase()
                          ) ? '#d1fae5' : '#f3f4f6',
                          color: job.matchingSkills?.some(s =>
                            s.toLowerCase() === skill.toLowerCase()
                          ) ? '#065f46' : '#374151',
                          padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* APPLY BUTTON */}
              {applied[job._id] === 'applied' ? (
                <div style={{
                  background: '#d1fae5', color: '#065f46',
                  padding: '12px', borderRadius: '10px',
                  textAlign: 'center', fontWeight: '700'
                }}>
                  ✅ Application Sent! Recruiter notified.
                </div>
              ) : applied[job._id] === 'already' ? (
                <div style={{
                  background: '#fef3c7', color: '#92400e',
                  padding: '12px', borderRadius: '10px',
                  textAlign: 'center', fontWeight: '700'
                }}>
                  ⚠️ Already Applied
                </div>
              ) : (
                <button
                  className="apply-btn"
                  onClick={() => handleApply(job)}
                >
                  Apply Now →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchingView;