// OverviewTab.jsx
function OverviewTab({ postedJobs, candidates }) {
  
    // Calculer les stats
    const totalJobs = postedJobs.length;
    const totalApplicants = postedJobs.reduce((sum, job) => sum + job.applicants, 0);
    const matchedCandidates = candidates.filter(c => c.score >= 70).length;
    
    // Activité récente mock
    const recentActivity = [
      { id: 1, type: 'application', text: 'New application for Frontend Developer Intern', time: '2 hours ago' },
      { id: 2, type: 'match', text: 'High match candidate found (92%)', time: '5 hours ago' },
      { id: 3, type: 'job', text: 'Posted new job: UI/UX Designer Intern', time: '1 day ago' },
      { id: 4, type: 'application', text: 'New application for Data Science Intern', time: '2 days ago' }
    ];
    
    return (
      <div className="overview-tab">
        <h1>Dashboard Overview</h1>
        <p className="tab-subtitle">Welcome back! Here's what's happening with your internships.</p>
        
        {/* Stats Cards */}
        <div className="stats-grid">
          
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <h3>{totalJobs}</h3>
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
              <p>Matched Candidates</p>
            </div>
          </div>
          
        </div>
        
        {/* Recent Activity */}
        <div className="activity-section">
          <h2>📊 Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.type}`}></div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span className="action-icon">➕</span>
              <span>Post New Job</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">👥</span>
              <span>Browse Candidates</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </button>
          </div>
        </div>
        
      </div>
    );
  }
  
  export default OverviewTab;