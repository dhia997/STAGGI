// MyJobsTab.jsx
function MyJobsTab({ jobs, onDeleteJob }) {
  
    const handleDelete = (jobId, jobTitle) => {
      if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
        onDeleteJob(jobId);
      }
    };
    
    return (
      <div className="my-jobs-tab">
        <h1>💼 My Posted Jobs</h1>
        <p className="tab-subtitle">Manage your active internship listings</p>
        
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No jobs posted yet</h3>
              <p>Create your first job posting to start receiving applications</p>
            </div>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                
                <div className="job-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-meta">
                      📍 {job.location} • ⏱️ {job.duration}
                    </p>
                  </div>
                  <span className={`job-status ${job.status}`}>
                    {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                  </span>
                </div>
                
                <div className="job-stats">
                  <div className="stat-item">
                    <span className="stat-value">{job.applicants}</span>
                    <span className="stat-label">Applicants</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{job.posted}</span>
                    <span className="stat-label">Posted On</span>
                  </div>
                </div>
                
                {job.description && (
                  <div className="job-description">
                    <p>{job.description.substring(0, 150)}...</p>
                  </div>
                )}
                
                {job.skills && (
                  <div className="job-skills">
                    <strong>Required Skills:</strong>
                    <div className="skills-tags">
                      {job.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="job-actions">
                  <button className="action-btn view">
                    👁️ View Applications
                  </button>
                  <button className="action-btn edit">
                    ✏️ Edit
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(job.id, job.title)}
                  >
                    🗑️ Delete
                  </button>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  export default MyJobsTab;