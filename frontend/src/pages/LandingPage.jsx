import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';

function LandingPage() {
  const navigate = useNavigate();
  
  // State pour savoir quelle carte est survolée
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ minHeight: '100vh' }}>

      <Header />

      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
      }}>

        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          textAlign: 'center',
          color: '#1e1b4b',
          marginBottom: '20px',
          lineHeight: '1.1'
        }}>
          Find Your Perfect
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Internship with AI
          </span>
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '60px',
          maxWidth: '600px'
        }}>
          Upload your CV, get instant AI analysis, 
          and match with top companies
        </p>

        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '80px'
        }}>

          {/* CARTE STUDENT */}
          <div
            onClick={() => navigate('/student/signup')}
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              width: '400px',
              padding: '40px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'student' 
                ? '0 20px 60px rgba(59,130,246,0.4)' 
                : '0 10px 40px rgba(59,130,246,0.15)',
              transform: hoveredCard === 'student' 
                ? 'translateY(-10px) scale(1.02)' 
                : 'translateY(0) scale(1)',
              transition: 'all 0.3s ease',
              border: '2px solid rgba(59,130,246,0.2)'
            }}
          >
            <div style={{
              width: '55px',
              height: '55px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px',
              marginBottom: '20px'
            }}>🎓</div>

            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#1e3a8a',
              marginBottom: '15px'
            }}>I'm a Student</h2>

            <p style={{
              color: '#1e40af',
              marginBottom: '25px',
              lineHeight: '1.6'
            }}>
              Upload your CV and discover internships 
              that match your skills
            </p>

            <span style={{
              color: '#2563eb',
              fontWeight: '700'
            }}>Get Started →</span>
          </div>

          {/* CARTE RECRUITER */}
          <div
            onClick={() => navigate('/recruiter/signup')}
            onMouseEnter={() => setHoveredCard('recruiter')}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              width: '400px',
              padding: '40px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
              cursor: 'pointer',
              boxShadow: hoveredCard === 'recruiter' 
                ? '0 20px 60px rgba(236,72,153,0.4)' 
                : '0 10px 40px rgba(236,72,153,0.15)',
              transform: hoveredCard === 'recruiter' 
                ? 'translateY(-10px) scale(1.02)' 
                : 'translateY(0) scale(1)',
              transition: 'all 0.3s ease',
              border: '2px solid rgba(236,72,153,0.2)'
            }}
          >
            <div style={{
              width: '55px',
              height: '55px',
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px',
              marginBottom: '20px'
            }}>💼</div>

            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#831843',
              marginBottom: '15px'
            }}>I'm a Recruiter</h2>

            <p style={{
              color: '#9f1239',
              marginBottom: '25px',
              lineHeight: '1.6'
            }}>
              Find qualified candidates with 
              AI-powered matching
            </p>

            <span style={{
              color: '#db2777',
              fontWeight: '700'
            }}>Get Started →</span>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '0px 20px 80px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>

          <div style={{
            textAlign: 'center', padding: '40px 30px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #dbeafe, #93c5fd)',
              borderRadius: '18px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 20px'
            }}>✨</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>
              AI-Powered Analysis
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Get instant feedback on your CV with advanced AI technology
            </p>
          </div>

          <div style={{
            textAlign: 'center', padding: '40px 30px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #f3e8ff, #d8b4fe)',
              borderRadius: '18px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 20px'
            }}>📈</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>
              Smart Matching
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              Connect with opportunities that fit your skills perfectly
            </p>
          </div>

          <div style={{
            textAlign: 'center', padding: '40px 30px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '70px', height: '70px',
              background: 'linear-gradient(135deg, #d1fae5, #6ee7b7)',
              borderRadius: '18px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 20px'
            }}>⚡</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1e1b4b', marginBottom: '10px' }}>
              Instant Results
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              No waiting - get matched with companies in seconds
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default LandingPage;