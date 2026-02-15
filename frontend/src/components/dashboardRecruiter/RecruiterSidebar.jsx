// RecruiterSidebar.jsx
function RecruiterSidebar({ 
    sidebarOpen, 
    setSidebarOpen, 
    user, 
    activeTab, 
    setActiveTab,
    onLogout 
  }) {
    
    return (
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        
        {/* Toggle Button */}
        <button 
          className="sidebar-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '←' : '→'}
        </button>
        
        {sidebarOpen && (
          <div className="sidebar-content">
            
            {/* User Info */}
            <div className="sidebar-user">
              <div className="user-avatar">
                {user?.companyName?.[0]?.toUpperCase() || user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user?.companyName || user?.fullName}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="sidebar-section">
              <h4>📊 Navigation</h4>
              <div className="nav-menu">
                
                <button 
                  className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="nav-icon">🏠</span>
                  <span className="nav-label">Overview</span>
                </button>
                
                <button 
                  className={`nav-item ${activeTab === 'postJob' ? 'active' : ''}`}
                  onClick={() => setActiveTab('postJob')}
                >
                  <span className="nav-icon">➕</span>
                  <span className="nav-label">Post New Job</span>
                </button>
                
                <button 
                  className={`nav-item ${activeTab === 'candidates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('candidates')}
                >
                  <span className="nav-icon">👥</span>
                  <span className="nav-label">Browse Candidates</span>
                </button>
                
                <button 
                  className={`nav-item ${activeTab === 'myJobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('myJobs')}
                >
                  <span className="nav-icon">💼</span>
                  <span className="nav-label">My Jobs</span>
                </button>
                
              </div>
            </div>
            
            {/* Logout Button */}
            <button className="logout-btn" onClick={onLogout}>
              🚪 Logout
            </button>
            
          </div>
        )}
        
      </aside>
    );
  }
  
  export default RecruiterSidebar;