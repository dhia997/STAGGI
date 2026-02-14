// Sidebar.jsx
function Sidebar({ 
    user, 
    cvHistory, 
    chatHistory, 
    sidebarOpen,
    setSidebarOpen,
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
        
        {/* Contenu de la sidebar (affiché seulement si ouvert) */}
        {sidebarOpen && (
          <div className="sidebar-content">
            
            {/* User Info */}
            <div className="sidebar-user">
              <div className="user-avatar">
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="user-info">
                <h3>{user?.fullName}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            
            {/* CV History */}
            <div className="sidebar-section">
              <h4>📄 CV History</h4>
              <div className="history-list">
                {cvHistory?.map(cv => (
                  <div key={cv.id} className="history-item">
                    <div className="history-icon">📄</div>
                    <div className="history-details">
                      <p className="history-name">{cv.name}</p>
                      <p className="history-meta">
                        Score: <span className={cv.score >= 60 ? 'score-good' : 'score-low'}>
                          {cv.score}%
                        </span>
                      </p>
                      <p className="history-date">{cv.date} • {cv.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat History */}
            <div className="sidebar-section">
              <h4>💬 Chat History</h4>
              <div className="history-list">
                {chatHistory?.map(chat => (
                  <div key={chat.id} className="history-item">
                    <div className="history-icon">💬</div>
                    <div className="history-details">
                      <p className="history-name">{chat.title}</p>
                      <p className="history-preview">{chat.preview}</p>
                      <p className="history-date">{chat.date}</p>
                    </div>
                  </div>
                ))}
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
  
  export default Sidebar;