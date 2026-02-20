// StudentDashboard.jsx
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
  const [activeView, setActiveView] = useState('home');

  // ── États CV ──────────────────────────────────────────
  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvScore, setCvScore] = useState(null);
  const [cvAdvice, setCvAdvice] = useState([]);
  const [cvSkills, setCvSkills] = useState([]);
  const [selectedCVName, setSelectedCVName] = useState('');

  // ── États Chat ────────────────────────────────────────
  const [showChat, setShowChat] = useState(false);
  const [initialMessages, setInitialMessages] = useState(null);

  // ── Historiques ───────────────────────────────────────
  const [cvHistory, setCvHistory] = useState([]);
  const [chatHistory] = useState([]);

  // ── Charger user depuis localStorage ─────────────────
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/student/login');
    }
  }, [navigate]);

  // ── Charger CV History depuis MongoDB ─────────────────
  useEffect(() => {
    const loadCVHistory = async () => {
      try {
        const data = await getCVHistory();
        setCvHistory(data.cvs);
      } catch (err) {
        console.error('Error loading CV history:', err);
      }
    };
    loadCVHistory();
  }, []);

  // ── Handler upload réussi ─────────────────────────────
  const handleUploadSuccess = (cvData) => {
    setCvScore(cvData.score);
    setCvAdvice(cvData.advice);
    setCvSkills(cvData.skills);
    setCvUploaded(true);
    setSelectedCVName(cvData.filename);
    setCvHistory(prev => [cvData, ...prev]);
  };

  // ── Handler clic sur un CV dans la sidebar ────────────
  const handleCVClick = (cv) => {
    setCvScore(cv.score);
    setCvAdvice(cv.advice || []);
    setCvSkills(cv.skills || []);
    setCvUploaded(true);
    setSelectedCVName(cv.filename || cv.name);
    setActiveView('home'); // ← revient à home avec les cercles cliquables
  };

  // ── Handler clic sur un chat dans la sidebar ─────────
  const handleChatClick = (chat) => {
    if (chat.messages) setInitialMessages(chat.messages);
    setShowChat(true);
  };

  // ── Handler reset ─────────────────────────────────────
  const handleReset = () => {
    setCvUploaded(false);
    setCvScore(null);
    setCvAdvice([]);
    setCvSkills([]);
    setSelectedCVName('');
    setActiveView('home');
  };

  // ── Handler clics sur les cercles ─────────────────────
  const handleStepClick = (step) => {
    if (!cvUploaded) {
      alert('⚠️ Please upload your CV first');
      return;
    }
    if (step === 'matching' && cvScore < 60) {
      alert('⚠️ Your score must be ≥ 60 to see job matches!');
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="student-dashboard">
      <Header />

      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <Sidebar
          user={user}
          cvHistory={cvHistory}
          chatHistory={chatHistory}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
          onCVClick={handleCVClick}
          onChatClick={handleChatClick}
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

          {/* SCORING VIEW — score + conseils + skills + bouton matching */}
          {activeView === 'scoring' && (
  <ScoringView
    cvScore={cvScore}
    cvName={selectedCVName}
    skills={cvSkills}
    onBack={() => setActiveView('home')}
    onViewAdvice={() => setActiveView('advice')}      // ← nouveau
    onViewMatching={() => setActiveView('matching')}
  />
)}

          {/* ADVICE VIEW */}
          {activeView === 'advice' && (
            <AdviceView
              cvScore={cvScore}
              advice={cvAdvice}
              onBack={() => setActiveView('home')}
            />
          )}

          {/* MATCHING VIEW */}
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
        <ChatModal
          onClose={() => {
            setShowChat(false);
            setInitialMessages(null);
          }}
          initialMessages={initialMessages}
        />
      )}

    </div>
  );
}

export default StudentDashboard;