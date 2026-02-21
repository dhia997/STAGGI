// NotificationsTab.jsx
import { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000/api';

function NotificationsTab() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/applications/recruiter`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplications(data.applications);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      setApplications(prev =>
        prev.map(app => app._id === appId ? { ...app, status, seen: true } : app)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const unseenCount = applications.filter(a => !a.seen).length;

  const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e', label: '⏳ Pending' },
    viewed: { bg: '#dbeafe', color: '#1e40af', label: '👁️ Viewed' },
    accepted: { bg: '#d1fae5', color: '#065f46', label: '✅ Accepted' },
    rejected: { bg: '#fee2e2', color: '#991b1b', label: '❌ Rejected' }
  };

  return (
    <div className="notifications-tab">
      <h1>🔔 Applications
        {unseenCount > 0 && (
          <span style={{
            background: '#ef4444', color: 'white',
            borderRadius: '20px', padding: '2px 10px',
            fontSize: '14px', marginLeft: '10px'
          }}>
            {unseenCount} new
          </span>
        )}
      </h1>
      <p className="tab-subtitle">Students who applied to your job postings</p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>⏳ Loading applications...</p>
        </div>
      )}

      {!loading && applications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>📭</div>
          <h3>No applications yet</h3>
          <p>When students apply to your jobs, you'll see them here.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {applications.map(app => (
          <div key={app._id} style={{
            background: app.seen ? 'white' : '#faf5ff',
            border: app.seen ? '1px solid #e5e7eb' : '2px solid #7c3aed',
            borderRadius: '12px', padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>

              {/* Student info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', color: 'white', fontWeight: '700', flexShrink: 0
                }}>
                  {app.student?.fullName?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>
                    {app.student?.fullName}
                    {!app.seen && <span style={{
                      background: '#7c3aed', color: 'white',
                      fontSize: '11px', padding: '2px 8px',
                      borderRadius: '10px', marginLeft: '8px'
                    }}>NEW</span>}
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{app.student?.email}</p>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>🎓 {app.student?.university || 'Not specified'}</p>
                </div>
              </div>

              {/* Status badge */}
              <span style={{
                background: statusColors[app.status]?.bg,
                color: statusColors[app.status]?.color,
                padding: '4px 12px', borderRadius: '20px',
                fontWeight: '700', fontSize: '13px'
              }}>
                {statusColors[app.status]?.label}
              </span>
            </div>

            {/* Job info */}
            <div style={{
              background: '#f9fafb', borderRadius: '8px',
              padding: '10px 14px', margin: '12px 0',
              fontSize: '13px', color: '#374151'
            }}>
              <strong>💼 Applied for:</strong> {app.job?.title} — 📍 {app.job?.location}
              <br />
              <strong>🏆 CV Score:</strong> {app.cvScore || 'N/A'}%
              <br />
              <strong>📅 Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}
            </div>

            {/* Skills */}
            {app.skills && app.skills.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ fontSize: '13px' }}>💡 Skills:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                  {app.skills.slice(0, 6).map((skill, idx) => (
                    <span key={idx} style={{
                      background: '#ede9fe', color: '#7c3aed',
                      padding: '2px 8px', borderRadius: '10px', fontSize: '12px'
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {app.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleUpdateStatus(app._id, 'accepted')}
                  style={{
                    background: '#d1fae5', color: '#065f46', border: 'none',
                    padding: '8px 16px', borderRadius: '8px',
                    fontWeight: '700', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleUpdateStatus(app._id, 'rejected')}
                  style={{
                    background: '#fee2e2', color: '#991b1b', border: 'none',
                    padding: '8px 16px', borderRadius: '8px',
                    fontWeight: '700', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  ❌ Reject
                </button>
                <a
                  href={`https://mail.google.com/mail/#compose?to=${app.student?.email}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: '#dbeafe', color: '#1e40af', border: 'none',
                    padding: '8px 16px', borderRadius: '8px',
                    fontWeight: '700', cursor: 'pointer', fontSize: '13px',
                    textDecoration: 'none'
                  }}
                >
                  📧 Contact
                </a>
              </div>
            )}

            {app.status !== 'pending' && (
              <a
                href={`https://mail.google.com/mail/#compose?to=${app.student?.email}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-block', background: '#dbeafe', color: '#1e40af',
                  padding: '8px 16px', borderRadius: '8px',
                  fontWeight: '700', fontSize: '13px', textDecoration: 'none'
                }}
              >
                📧 Contact Student
              </a>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsTab;