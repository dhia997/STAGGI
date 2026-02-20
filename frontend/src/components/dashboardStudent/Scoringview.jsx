// ScoringView.jsx
function ScoringView({ cvScore, cvName, skills, onBack, onViewAdvice, onViewMatching }) {

  return (
    <div className="step-detail-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      {cvName && (
        <p style={{ color: '#6b7280', marginBottom: '10px', fontSize: '14px' }}>
          📄 {cvName}
        </p>
      )}

      <div className="scoring-view">
        <h2>📊 CV Scoring (ATS)</h2>

        {/* SCORE CIRCLE */}
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
            <p>✅ Good profile! Check AI Advice to improve even further.</p>
          ) : (
            <p>⚠️ Your CV needs improvement. Check AI Advice for recommendations.</p>
          )}
        </div>

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>🛠️ Skills Found in Your CV</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{
                  background: '#ede9fe', color: '#7c3aed',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '13px', fontWeight: '600'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <button onClick={onViewAdvice} style={{
            background: '#f3f4f6', color: '#374151',
            border: '2px solid #e5e7eb', padding: '12px 24px',
            borderRadius: '10px', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer'
          }}>
            💡 View AI Advice
          </button>

          {cvScore >= 60 && (
            <button onClick={onViewMatching} style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white', border: 'none', padding: '12px 24px',
              borderRadius: '10px', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer'
            }}>
              🎯 View Matching Jobs →
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default ScoringView;