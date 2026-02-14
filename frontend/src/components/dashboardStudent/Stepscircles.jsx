// StepsCircles.jsx
function StepsCircles({ cvUploaded, activeStep, onStepClick }) {
  
    return (
      <div className="steps-section">
        <h2 className="steps-title">Your Journey to Success</h2>
        <p className="steps-subtitle">
          Choose a sample resume below and click "CV Scoring (ATS)" to see our AI-powered analysis
        </p>
        
        <div className="steps-container">
          
          {/* Cercle 1: CV Scoring */}
          <div
            className={`step-circle 
              ${!cvUploaded ? 'disabled' : ''} 
              ${activeStep === 'scoring' ? 'active' : ''}`}
            onClick={() => onStepClick('scoring')}
          >
            <div className="step-circle-inner">
              <div className="step-icon">📊</div>
              <h3>CV Scoring (ATS)</h3>
              <p>Analyze your resume with AI-powered insights</p>
            </div>
          </div>
          
          {/* Ligne de connexion */}
          <div className="step-connector"></div>
          
          {/* Cercle 2: AI Resume Advice */}
          <div
            className={`step-circle 
              ${!cvUploaded ? 'disabled' : ''} 
              ${activeStep === 'advice' ? 'active' : ''}`}
            onClick={() => onStepClick('advice')}
          >
            <div className="step-circle-inner">
              <div className="step-icon">💡</div>
              <h3>AI Resume Advice</h3>
              <p>Get professional advice to improve your CV</p>
            </div>
          </div>
          
          {/* Ligne de connexion */}
          <div className="step-connector"></div>
          
          {/* Cercle 3: Job Matching */}
          <div
            className={`step-circle 
              ${!cvUploaded ? 'disabled' : ''} 
              ${activeStep === 'matching' ? 'active' : ''}`}
            onClick={() => onStepClick('matching')}
          >
            <div className="step-circle-inner">
              <div className="step-icon">🎯</div>
              <h3>Job Matching Score</h3>
              <p>Find your perfect job match with smart algorithms</p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
  
  export default StepsCircles;