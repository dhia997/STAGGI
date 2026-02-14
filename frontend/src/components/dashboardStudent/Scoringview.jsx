// ScoringView.jsx
function ScoringView({ cvScore, onBack }) {
  
    return (
      <div className="step-detail-view">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        
        <div className="scoring-view">
          <h2>📊 CV Scoring (ATS)</h2>
          
          <div className="score-circle-large">
            <svg width="200" height="200">
              {/* Cercle de fond (gris) */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#e5e7eb"
                strokeWidth="15"
                fill="none"
              />
              {/* Cercle de score (vert ou rouge) */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke={cvScore >= 60 ? '#10b981' : '#ef4444'}
                strokeWidth="15"
                fill="none"
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
          
          <div className="score-message">
            {cvScore >= 60 ? (
              <p>✅ Good job! You can check <strong>AI Resume Advice</strong> to further improve your CV</p>
            ) : (
              <p>⚠️ You should check <strong>AI Resume Advice</strong> to improve your CV before applying</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default ScoringView;