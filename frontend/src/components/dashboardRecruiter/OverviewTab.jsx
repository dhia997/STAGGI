// OverviewTab.jsx
function OverviewTab({ postedJobs, candidates, onNavigate }) {

  const totalJobs = postedJobs.length;
  const activeJobs = postedJobs.filter(j => j.status === 'active').length;
  const totalApplicants = postedJobs.reduce((sum, job) => sum + (job.applicants || 0), 0);
  const matchedCandidates = candidates.filter(c => c.score >= 70).length;

  return (
    <div className="overview-tab">
      <h1>Dashboard Overview</h1>
      <p className="tab-subtitle">Welcome back! Here's what's happening.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <h3>{activeJobs}</h3>
            <p>Active Jobs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <h3>{totalApplicants}</h3>
            <p>Total Applicants</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{matchedCandidates}</h3>
            <p>Matched Candidates (70%+)</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{candidates.length}</h3>
            <p>Total Candidates</p>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      {postedJobs.length > 0 && (
        <div className="activity-section">
          <h2>📋 Recent Jobs</h2>
          <div className="activity-list">
            {postedJobs.slice(0, 5).map(job => (
              <div key={job._id} className="activity-item">
                <div className={`activity-dot ${job.status === 'active' ? 'match' : 'application'}`}></div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{job.title}</strong> — {job.location}
                    <span className={`job-status ${job.status}`} style={{ marginLeft: '8px', fontSize: '12px' }}>
                      {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
                    </span>
                  </p>
                  <span className="activity-time">
                    Posted {new Date(job.createdAt).toLocaleDateString()} • {job.applicants || 0} applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => onNavigate('postJob')}>
            <span className="action-icon">➕</span>
            <span>Post New Job</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('candidates')}>
            <span className="action-icon">👥</span>
            <span>Browse Candidates</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('myJobs')}>
            <span className="action-icon">💼</span>
            <span>My Jobs ({totalJobs})</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default OverviewTab;