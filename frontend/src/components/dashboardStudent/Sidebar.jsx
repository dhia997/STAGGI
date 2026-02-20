// Sidebar.jsx
function Sidebar({ 
  user, 
  cvHistory, 
  chatHistory, 
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  onCVClick,      // nouveau — appelé quand on clique sur un CV
  onChatClick     // nouveau — appelé quand on clique sur un chat
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
              {cvHistory && cvHistory.length > 0 ? (
                cvHistory.map(cv => (
                  <div 
                    key={cv._id || cv.id} 
                    className="history-item clickable"
                    onClick={() => onCVClick && onCVClick(cv)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="history-icon">📄</div>
                    <div className="history-details">
                      <p className="history-name">{cv.filename || cv.name}</p>
                      <p className="history-meta">
                        Score: <span className={cv.score >= 60 ? 'score-good' : 'score-low'}>
                          {cv.score}%
                        </span>
                      </p>
                      <p className="history-date">
                        {cv.uploadedAt 
                          ? new Date(cv.uploadedAt).toLocaleDateString() 
                          : cv.date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '13px', padding: '10px 0' }}>
                  No CV uploaded yet
                </p>
              )}
            </div>
          </div>
          
          {/* Chat History */}
          <div className="sidebar-section">
            <h4>💬 Chat History</h4>
            <div className="history-list">
              {chatHistory && chatHistory.length > 0 ? (
                chatHistory.map(chat => (
                  <div 
                    key={chat._id || chat.id} 
                    className="history-item clickable"
                    onClick={() => onChatClick && onChatClick(chat)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="history-icon">💬</div>
                    <div className="history-details">
                      <p className="history-name">{chat.title}</p>
                      <p className="history-preview">{chat.preview}</p>
                      <p className="history-date">{chat.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '13px', padding: '10px 0' }}>
                  No chat history yet
                </p>
              )}
            </div>
          </div>
          
          {/* Logout */}
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
          
        </div>
      )}
      
    </aside>
  );
}

export default Sidebar;