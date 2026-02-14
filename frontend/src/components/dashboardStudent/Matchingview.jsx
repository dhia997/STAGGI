// MatchingView.jsx
function MatchingView({ onBack }) {
  
    // Jobs mockés (plus tard viendra du backend)
    const jobs = [
      {
        id: 1,
        company: 'TechCorp Tunisia',
        logo: 'TC',
        position: 'Frontend Developer Intern',
        location: 'Tunis, Tunisia',
        duration: '3 months',
        match: 85,
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Git']
      },
      {
        id: 2,
        company: 'DesignStudio',
        logo: 'DS',
        position: 'UI/UX Design Intern',
        location: 'Sfax, Tunisia',
        duration: '3 months',
        match: 78,
        skills: ['Figma', 'Adobe XD', 'User Research']
      },
      {
        id: 3,
        company: 'DataTech',
        logo: 'DT',
        position: 'Data Science Intern',
        location: 'Tunis, Tunisia',
        duration: '4 months',
        match: 72,
        skills: ['Python', 'Pandas', 'SQL']
      }
    ];
    
    return (
      <div className="step-detail-view">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        
        <div className="matching-view">
          <h2>🎯 Job Matching Results</h2>
          <p className="matching-intro">
            Based on your CV, here are the best internship matches for you:
          </p>
          
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="company-logo">{job.logo}</div>
                  <div className="job-info">
                    <h3>{job.position}</h3>
                    <p className="company-name">{job.company}</p>
                  </div>
                  <div className={`match-badge ${job.match >= 80 ? 'high' : 'medium'}`}>
                    {job.match}% Match
                  </div>
                </div>
                
                <div className="job-details">
                  <p>📍 {job.location} • ⏱️ {job.duration}</p>
                  
                  <div className="skills-match">
                    <strong>Matching Skills:</strong>
                    <div className="skills-tags">
                      {job.skills.map((skill, idx) => (
                        <span key={idx}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button className="apply-btn">Apply Now →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default MatchingView;