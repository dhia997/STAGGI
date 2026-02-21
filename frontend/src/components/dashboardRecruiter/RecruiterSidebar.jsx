// RecruiterSidebar.jsx
function RecruiterSidebar({ 
  sidebarOpen, setSidebarOpen, user, 
  activeTab, setActiveTab, onLogout, unseenCount 
}) {
  return (
    <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '←' : '→'}
      </button>

      {sidebarOpen && (
        <div className="sidebar-content">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.companyName?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user?.companyName || user?.fullName}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>📊 Navigation</h4>
            <div className="nav-menu">
              <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Overview</span>
              </button>
              <button className={`nav-item ${activeTab === 'postJob' ? 'active' : ''}`} onClick={() => setActiveTab('postJob')}>
                <span className="nav-icon">➕</span>
                <span className="nav-label">Post New Job</span>
              </button>
              <button className={`nav-item ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
                <span className="nav-icon">👥</span>
                <span className="nav-label">Browse Candidates</span>
              </button>
              <button className={`nav-item ${activeTab === 'myJobs' ? 'active' : ''}`} onClick={() => setActiveTab('myJobs')}>
                <span className="nav-icon">💼</span>
                <span className="nav-label">My Jobs</span>
              </button>
              <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <span className="nav-icon">🔔</span>
                <span className="nav-label">
                  Applications
                  {unseenCount > 0 && (
                    <span style={{
                      background: '#ef4444', color: 'white',
                      borderRadius: '50%', padding: '1px 6px',
                      fontSize: '11px', marginLeft: '6px', fontWeight: '700'
                    }}>{unseenCount}</span>
                  )}
                </span>
              </button>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>
      )}
    </aside>
  );
}

export default RecruiterSidebar;