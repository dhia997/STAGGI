// CandidatesTab.jsx
import { useState } from 'react';

function CandidatesTab({ candidates }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all'); // 'all', 'high', 'medium'
  
  // Filtrer les candidats
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.field.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesScore = 
      filterScore === 'all' ? true :
      filterScore === 'high' ? candidate.score >= 80 :
      filterScore === 'medium' ? candidate.score >= 60 && candidate.score < 80 :
      true;
    
    return matchesSearch && matchesScore;
  });
  
  return (
    <div className="candidates-tab">
      <h1>👥 Browse Candidates</h1>
      <p className="tab-subtitle">Find the perfect match for your internship</p>
      
      {/* Filters */}
      <div className="filters-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, university, or field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterScore === 'all' ? 'active' : ''}`}
            onClick={() => setFilterScore('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filterScore === 'high' ? 'active' : ''}`}
            onClick={() => setFilterScore('high')}
          >
            High Match (80+)
          </button>
          <button 
            className={`filter-btn ${filterScore === 'medium' ? 'active' : ''}`}
            onClick={() => setFilterScore('medium')}
          >
            Medium Match (60-79)
          </button>
        </div>
      </div>
      
      {/* Results Count */}
      <p className="results-count">
        Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
      </p>
      
      {/* Candidates Grid */}
      <div className="candidates-grid">
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            
            <div className="candidate-header">
              <div className="candidate-avatar">
                {candidate.name[0].toUpperCase()}
              </div>
              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <p>{candidate.email}</p>
              </div>
              <div className={`match-score ${candidate.score >= 80 ? 'high' : 'medium'}`}>
                {candidate.score}% Match
              </div>
            </div>
            
            <div className="candidate-details">
              <p><strong>🎓 University:</strong> {candidate.university}</p>
              <p><strong>📚 Field:</strong> {candidate.field}</p>
              
              <div className="candidate-skills">
                <strong>💡 Skills:</strong>
                <div className="skills-tags">
                  {candidate.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="candidate-actions">
              <button className="view-cv-btn">
                📄 View CV
              </button>
              <button className="contact-btn">
                ✉️ Contact
              </button>
            </div>
            
          </div>
        ))}
      </div>
      
      {filteredCandidates.length === 0 && (
        <div className="no-results">
          <p>😕 No candidates found matching your criteria</p>
        </div>
      )}
      
    </div>
  );
}

export default CandidatesTab;