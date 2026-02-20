// Adviceview.jsx
function AdviceView({ cvScore, advice, onBack }) {

  // Icônes selon l'index du conseil
  const icons = ['💡', '📝', '🎯', '📚', '✨', '🚀'];

  return (
    <div className="step-detail-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="advice-view">
        <h2>💡 AI Resume Advice</h2>

        {/* Score affiché en haut */}
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          borderRadius: '20px',
          background: cvScore >= 60 ? '#d1fae5' : '#fee2e2',
          color: cvScore >= 60 ? '#065f46' : '#dc2626',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          Your Score: {cvScore}%
        </div>

        <p className="advice-intro">
          {cvScore >= 60
            ? '✅ Good profile! Here are tips to make it even stronger:'
            : '⚠️ Your CV needs improvement. Follow these recommendations:'}
        </p>

        {/* Vrais conseils de Gemini */}
        {advice && advice.length > 0 ? (
          <div className="advice-cards">
            {advice.map((tip, index) => (
              <div key={index} className="advice-card">
                <span className="advice-icon">
                  {icons[index] || '💡'}
                </span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        ) : (
          // Fallback si advice est vide
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>⚠️ No advice available. Please upload your CV first.</p>
            <button className="back-btn" onClick={onBack} style={{ marginTop: '20px' }}>
              Go Upload CV
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdviceView;