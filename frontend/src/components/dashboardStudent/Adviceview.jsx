// AdviceView.jsx
function AdviceView({ cvScore, onBack }) {
  
    // Conseils basés sur le score (plus tard viendra du backend)
    const adviceList = cvScore >= 60 ? [
      {
        icon: '💡',
        title: 'Add Quantifiable Achievements',
        description: 'Include metrics like "Improved app performance by 40%" to showcase impact'
      },
      {
        icon: '📝',
        title: 'Professional Summary',
        description: 'Add a compelling summary at the top highlighting your key strengths'
      },
      {
        icon: '🎯',
        title: 'Tailor to Job Description',
        description: 'Customize your CV for each application using keywords from the job posting'
      },
      {
        icon: '📚',
        title: 'Add Relevant Certifications',
        description: 'Include industry certifications and online courses to strengthen your profile'
      }
    ] : [
      {
        icon: '⚠️',
        title: 'Missing Technical Skills',
        description: 'Add specific technologies and tools you have worked with'
      },
      {
        icon: '📝',
        title: 'Vague Work Experience',
        description: 'Include specific projects, responsibilities, and measurable results'
      },
      {
        icon: '✨',
        title: 'Improve Formatting',
        description: 'Use clear sections, bullet points, and consistent formatting throughout'
      },
      {
        icon: '🎯',
        title: 'Add Keywords',
        description: 'Include industry-specific keywords to pass ATS (Applicant Tracking Systems)'
      }
    ];
    
    return (
      <div className="step-detail-view">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        
        <div className="advice-view">
          <h2>💡 AI Resume Advice</h2>
          <p className="advice-intro">
            Based on your CV analysis, here are personalized recommendations:
          </p>
          
          <div className="advice-cards">
            {adviceList.map((advice, index) => (
              <div key={index} className="advice-card">
                <span className="advice-icon">{advice.icon}</span>
                <h3>{advice.title}</h3>
                <p>{advice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default AdviceView;