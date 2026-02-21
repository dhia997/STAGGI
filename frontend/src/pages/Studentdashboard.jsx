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

const BASE_URL = 'http://localhost:5000/api';

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
  const [selectedChat, setSelectedChat] = useState(null); // chat sélectionné depuis sidebar

  const [cvHistory, setCvHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    else navigate('/student/login');
  }, [navigate]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        // Charger CV history
        const cvData = await getCVHistory();
        setCvHistory(cvData.cvs);

        // Charger Chat history
        const chatRes = await fetch(`${BASE_URL}/chat/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const chatData = await chatRes.json();
        if (chatData.success) setChatHistory(chatData.chats);

      } catch (err) {
        console.error('Error loading history:', err);
      }
    };
    loadHistory();
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

  // Quand on clique sur un chat — charge la conversation complète
  const handleChatClick = async (chat) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/chat/${chat._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedChat(data.chat);
        setShowChat(true);
      }
    } catch (err) {
      console.error('Error loading chat:', err);
    }
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

  // Refresh chat history après fermeture du chat
  const handleChatClose = async () => {
    setShowChat(false);
    setSelectedChat(null);
    try {
      const token = localStorage.getItem('token');
      const chatRes = await fetch(`${BASE_URL}/chat/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const chatData = await chatRes.json();
      if (chatData.success) setChatHistory(chatData.chats);
    } catch (err) {
      console.error('Error refreshing chat history:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

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

      <button className="chat-float-btn" onClick={() => {
        setSelectedChat(null);
        setShowChat(!showChat);
      }}>
        💬
      </button>

      {showChat && (
        <ChatModal
          onClose={handleChatClose}
          cvData={cvDataForChat}
          initialChat={selectedChat}
        />
      )}

    </div>
  );
}

export default StudentDashboard;