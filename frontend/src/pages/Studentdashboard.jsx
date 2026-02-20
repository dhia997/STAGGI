// StudentDashboard.jsx - Fichier Principal
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/dashboardStudent/Sidebar';
import UploadSection from '../components/dashboardStudent/UploadSection';
import StepsCircles from '../components/dashboardStudent/Stepscircles';
import ScoringView from '../components/dashboardStudent/Scoringview';
import AdviceView from '../components/dashboardStudent/Adviceview';
import MatchingView from '../components/dashboardStudent/Matchingview';
import ChatModal from '../components/dashboardStudent/ChatModal';
import { getCVHistory } from '../services/api';
import '../pagesCSS/Studentdashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();

  // ── États principaux ──────────────────────────────────
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('home'); // 'home' | 'scoring' | 'advice' | 'matching'

  // ── États CV ──────────────────────────────────────────
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvScore, setCvScore] = useState(null);
  const [cvAdvice, setCvAdvice] = useState([]);   // vrais conseils Gemini
  const [cvSkills, setCvSkills] = useState([]);   // vraies compétences Gemini

  // ── États Chat ────────────────────────────────────────
  const [showChat, setShowChat] = useState(false);

  // ── Historiques ───────────────────────────────────────
  const [cvHistory, setCvHistory] = useState([]);        // chargé depuis MongoDB
  const [chatHistory] = useState([                        // encore mocké
    { id: 1, title: 'CV Improvement Tips', date: '2025-01-14', preview: 'How can I improve...' },
    { id: 2, title: 'Interview Preparation', date: '2025-01-12', preview: 'What should I prepare...' }
  ]);

  // ── Charger user depuis localStorage ─────────────────
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/student/login');
    }
  }, [navigate]);

  // ── Charger l'historique CV depuis MongoDB ────────────
  // S'exécute une fois quand le dashboard charge
  useEffect(() => {
    const loadCVHistory = async () => {
      try {
        const data = await getCVHistory();
        setCvHistory(data.cvs);
      } catch (err) {
        console.error('Error loading CV history:', err);
        // Si erreur (ex: pas encore de CVs), on garde le tableau vide
      }
    };

    loadCVHistory();
  }, []); // [] = s'exécute une seule fois au montage du composant

  // ── Handler upload réussi (appelé depuis UploadSection) ──
  // cvData = { id, filename, score, advice, skills, summary, uploadedAt }
  // Ces données viennent de Gemini via le backend
  const handleUploadSuccess = (cvData) => {
    setCvScore(cvData.score);         // vrai score Gemini
    setCvAdvice(cvData.advice);       // vrais conseils Gemini
    setCvSkills(cvData.skills);       // vraies compétences trouvées
    setCvUploaded(true);

    // Ajouter immédiatement à l'historique sans recharger la page
    setCvHistory(prev => [cvData, ...prev]);
  };

  // ── Handler reset ─────────────────────────────────────
  const handleReset = () => {
    setCvUploaded(false);
    setCvScore(null);
    setCvAdvice([]);
    setCvSkills([]);
    setActiveView('home');
  };

  // ── Handler clics sur les cercles ─────────────────────
  const handleStepClick = (step) => {
    if (!cvUploaded) {
      alert('⚠️ Please upload your CV first');
      return;
    }
    if (step === 'matching' && cvScore < 60) {
      alert('⚠️ Your score must be ≥ 60 to see job matches. Check AI Advice first!');
      return;
    }
    setActiveView(step);
  };

  // ── Handler logout ────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ── Loading ───────────────────────────────────────────
  if (!user) return <div>Loading...</div>;

  return (
    <div className="student-dashboard">
      <Header />

      <div className="dashboard-layout">

        {/* SIDEBAR — reçoit le vrai historique MongoDB */}
        <Sidebar
          user={user}
          cvHistory={cvHistory}
          chatHistory={chatHistory}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* MAIN CONTENT */}
        <main className="dashboard-main">

          {/* HOME VIEW */}
          {activeView === 'home' && (
            <>
              <div className="welcome-section">
                <h1>Welcome to STAGII! 👋</h1>
                <p>Let's start by uploading your CV to find the perfect internship</p>
              </div>

              {/* UploadSection — maintenant appelle le vrai backend */}
              <UploadSection
                cvUploaded={cvUploaded}
                cvScore={cvScore}
                onUploadSuccess={handleUploadSuccess}
                onReset={handleReset}
              />

              <StepsCircles
                cvUploaded={cvUploaded}
                activeStep={activeView}
                onStepClick={handleStepClick}
              />
            </>
          )}

          {/* SCORING VIEW — vrai score Gemini */}
          {activeView === 'scoring' && (
            <ScoringView
              cvScore={cvScore}
              onBack={() => setActiveView('home')}
            />
          )}

          {/* ADVICE VIEW — vrais conseils Gemini */}
          {activeView === 'advice' && (
            <AdviceView
              cvScore={cvScore}
              advice={cvAdvice}
              onBack={() => setActiveView('home')}
            />
          )}

          {/* MATCHING VIEW — seulement si score >= 60 */}
          {activeView === 'matching' && cvScore >= 60 && (
            <MatchingView
              skills={cvSkills}
              onBack={() => setActiveView('home')}
            />
          )}

        </main>
      </div>

      {/* CHAT BUTTON FLOTTANT */}
      <button
        className="chat-float-btn"
        onClick={() => setShowChat(!showChat)}
      >
        💬
      </button>

      {/* CHAT MODAL */}
      {showChat && (
        <ChatModal onClose={() => setShowChat(false)} />
      )}

    </div>
  );
}

export default StudentDashboard;