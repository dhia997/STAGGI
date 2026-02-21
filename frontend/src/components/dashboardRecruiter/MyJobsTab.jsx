// MyJobsTab.jsx
function MyJobsTab({ jobs, onDeleteJob, onToggleStatus }) {

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
            <div key={job._id} className="job-card">

              <div className="job-header">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-meta">
                    📍 {job.location} • ⏱️ {job.duration || 'Not specified'}
                  </p>
                </div>
                <span className={`job-status ${job.status}`}>
                  {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                </span>
              </div>

              <div className="job-stats">
                <div className="stat-item">
                  <span className="stat-value">{job.applicants || 0}</span>
                  <span className="stat-label">Applicants</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className="stat-label">Posted On</span>
                </div>
              </div>

              {job.description && (
                <div className="job-description">
                  <p>{job.description.substring(0, 150)}...</p>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                  <strong>Required Skills:</strong>
                  <div className="skills-tags">
                    {job.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="job-actions">
                <button
                  className={`action-btn ${job.status === 'active' ? 'edit' : 'view'}`}
                  onClick={() => onToggleStatus(job._id, job.status)}
                >
                  {job.status === 'active' ? '🔴 Close Job' : '🟢 Reopen Job'}
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(job._id, job.title)}
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