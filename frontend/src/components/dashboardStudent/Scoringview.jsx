// ScoringView.jsx
function ScoringView({ cvScore, cvName, advice, skills, onBack, onViewMatching }) {

  const icons = ['💡', '📝', '🎯', '📚', '✨', '🚀'];

  return (
    <div className="step-detail-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      {/* CV Name */}
      {cvName && (
        <p style={{ color: '#6b7280', marginBottom: '10px', fontSize: '14px' }}>
          📄 {cvName}
        </p>
      )}

      {/* SCORE CIRCLE */}
      <div className="scoring-view">
        <h2>📊 CV Scoring (ATS)</h2>

        <div className="score-circle-large">
          <svg width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="#e5e7eb" strokeWidth="15" fill="none" />
            <circle
              cx="100" cy="100" r="80"
              stroke={cvScore >= 60 ? '#10b981' : '#ef4444'}
              strokeWidth="15" fill="none"
              strokeDasharray={`${(cvScore / 100) * 502.4} 502.4`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{cvScore}</span>
            <span className="score-percent">%</span>
          </div>
        </div>

        {/* Score message */}
        <div className="score-message">
          {cvScore >= 60 ? (
            <p>✅ Good profile! Here are your personalized tips to go further:</p>
          ) : (
            <p>⚠️ Your CV needs improvement. Follow these recommendations:</p>
          )}
        </div>

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>🛠️ Skills Found in Your CV</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{
                  background: '#ede9fe',
                  color: '#7c3aed',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ADVICE */}
        {advice && advice.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>💡 AI Recommendations</h3>
            <div className="advice-cards">
              {advice.map((tip, index) => (
                <div key={index} className="advice-card">
                  <span className="advice-icon">{icons[index] || '💡'}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHING BUTTON — seulement si score >= 60 */}
        {cvScore >= 60 && (
          <button
            onClick={onViewMatching}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              border: 'none',
              padding: '14px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🎯 View Matching Jobs →
          </button>
        )}

      </div>
    </div>
  );
}

export default ScoringView;