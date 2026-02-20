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

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('home');

  const [cvUploaded, setCvUploaded] = useState(false);
  const [cvScore, setCvScore] = useState(null);
  const [cvAdvice, setCvAdvice] = useState([]);
  const [cvSkills, setCvSkills] = useState([]);
  const [selectedCVName, setSelectedCVName] = useState('');

  const [showChat, setShowChat] = useState(false);
  const [initialMessages, setInitialMessages] = useState(null);

  const [cvHistory, setCvHistory] = useState([]);
  const [chatHistory] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    else navigate('/student/login');
  }, [navigate]);

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

  const handleUploadSuccess = (cvData) => {
    setCvScore(cvData.score);
    setCvAdvice(cvData.advice);
    setCvSkills(cvData.skills);
    setCvUploaded(true);
    setSelectedCVName(cvData.filename);
    setCvHistory(prev => [cvData, ...prev]);
  };

  const handleCVClick = (cv) => {
    setCvScore(cv.score);
    setCvAdvice(cv.advice || []);
    setCvSkills(cv.skills || []);
    setCvUploaded(true);
    setSelectedCVName(cv.filename || cv.name);
    setActiveView('home');
  };

  const handleChatClick = (chat) => {
    if (chat.messages) setInitialMessages(chat.messages);
    setShowChat(true);
  };

  const handleReset = () => {
    setCvUploaded(false);
    setCvScore(null);
    setCvAdvice([]);
    setCvSkills([]);
    setSelectedCVName('');
    setActiveView('home');
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  // Données CV pour le chat
  const cvDataForChat = cvUploaded ? {
    score: cvScore,
    skills: cvSkills,
    advice: cvAdvice,
    filename: selectedCVName
  } : null;

  return (
    <div className="student-dashboard">
      <Header />

      <div className="dashboard-layout">

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

        <main className="dashboard-main">

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

          {activeView === 'scoring' && (
            <ScoringView
              cvScore={cvScore}
              cvName={selectedCVName}
              skills={cvSkills}
              onBack={() => setActiveView('home')}
              onViewAdvice={() => setActiveView('advice')}
              onViewMatching={() => setActiveView('matching')}
            />
          )}

          {activeView === 'advice' && (
            <AdviceView
              cvScore={cvScore}
              advice={cvAdvice}
              onBack={() => setActiveView('home')}
            />
          )}

          {activeView === 'matching' && cvScore >= 60 && (
            <MatchingView
              skills={cvSkills}
              onBack={() => setActiveView('home')}
            />
          )}

        </main>
      </div>

      <button className="chat-float-btn" onClick={() => setShowChat(!showChat)}>
        💬
      </button>

      {showChat && (
        <ChatModal
          onClose={() => {
            setShowChat(false);
            setInitialMessages(null);
          }}
          cvData={cvDataForChat}
          initialMessages={initialMessages}
        />
      )}

    </div>
  );
}

export default StudentDashboard;