// CandidatesTab.jsx
import { useState } from 'react';

function CandidatesTab({ candidates }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState('all');
  const [contactModal, setContactModal] = useState(null);
  const [cvModal, setCvModal] = useState(null);

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

      <div className="filters-section">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, university, or field..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button className={`filter-btn ${filterScore === 'all' ? 'active' : ''}`} onClick={() => setFilterScore('all')}>All</button>
          <button className={`filter-btn ${filterScore === 'high' ? 'active' : ''}`} onClick={() => setFilterScore('high')}>High Match (80+)</button>
          <button className={`filter-btn ${filterScore === 'medium' ? 'active' : ''}`} onClick={() => setFilterScore('medium')}>Medium Match (60-79)</button>
        </div>
      </div>

      <p className="results-count">
        Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
      </p>

      <div className="candidates-grid">
        {filteredCandidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-header">
              <div className="candidate-avatar">{candidate.name[0].toUpperCase()}</div>
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
              <button className="view-cv-btn" onClick={() => setCvModal(candidate)}>📄 View CV</button>
              <button className="contact-btn" onClick={() => setContactModal(candidate)}>✉️ Contact</button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="no-results">
          <p>😕 No candidates found matching your criteria</p>
        </div>
      )}

      {/* CV MODAL */}
      {cvModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setCvModal(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '30px',
            maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>📄 CV Details</h2>
              <button onClick={() => setCvModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', color: 'white', fontWeight: '700'
              }}>
                {cvModal.name[0].toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{cvModal.name}</h3>
                <p style={{ margin: 0, color: '#6b7280' }}>{cvModal.email}</p>
              </div>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '15px', marginBottom: '15px' }}>
              <p style={{ margin: '0 0 8px' }}><strong>🎓 University:</strong> {cvModal.university}</p>
              <p style={{ margin: '0 0 8px' }}><strong>📚 Field:</strong> {cvModal.field}</p>
              <p style={{ margin: '0 0 8px' }}><strong>📄 CV File:</strong> {cvModal.cvFilename || 'Not available'}</p>
              <p style={{ margin: 0 }}>
                <strong>🏆 CV Score:</strong>
                <span style={{
                  marginLeft: '8px',
                  background: cvModal.score >= 60 ? '#d1fae5' : '#fee2e2',
                  color: cvModal.score >= 60 ? '#065f46' : '#991b1b',
                  padding: '2px 10px', borderRadius: '20px', fontWeight: '700'
                }}>
                  {cvModal.score}%
                </span>
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>💡 Skills:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {cvModal.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    background: '#ede9fe', color: '#7c3aed',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '13px'
                  }}>{skill}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setCvModal(null); setContactModal(cvModal); }}
              style={{
                width: '100%', background: 'linear-gradient(135deg, #ec4899, #be185d)',
                color: 'white', border: 'none', padding: '12px',
                borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer'
              }}
            >
              ✉️ Contact This Candidate
            </button>
          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {contactModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setContactModal(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '30px',
            maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>✉️ Contact Candidate</h2>
              <button onClick={() => setContactModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', color: 'white', fontWeight: '700',
                margin: '0 auto 15px'
              }}>
                {contactModal.name[0].toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 5px' }}>{contactModal.name}</h3>
              <p style={{ color: '#6b7280', margin: '0 0 25px' }}>{contactModal.university}</p>

              {/* Email avec bouton copier */}
              <div style={{
                background: '#f9fafb', border: '2px solid #e5e7eb',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#374151', fontWeight: '600' }}>{contactModal.email}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(contactModal.email);
                    alert('✅ Email copied!');
                  }}
                  style={{
                    background: '#7c3aed', color: 'white', border: 'none',
                    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '600'
                  }}
                >
                  📋 Copy
                </button>
              </div>

              <a
                href={`https://mail.google.com/mail/#compose?to=${contactModal.email}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  color: 'white', padding: '14px 30px', borderRadius: '10px',
                  textDecoration: 'none', fontWeight: '700', fontSize: '15px',
                  marginBottom: '10px'
                }}
              >
                📧 Open Gmail in Browser
              </a>

              <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '10px' }}>
                Copy the email or open Gmail directly in browser
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CandidatesTab;