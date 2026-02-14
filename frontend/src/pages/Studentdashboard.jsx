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
import '../pagesCSS/Studentdashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  
  // États principaux
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('home'); // 'home', 'scoring', 'advice', 'matching'
  
  // États pour le CV
  const [cvUploaded, setCvUploaded] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [cvScore, setCvScore] = useState(null);
  
  // États pour le chat
  const [showChat, setShowChat] = useState(false);
  
  // Historiques (mock data - sera remplacé par backend)
  const [cvHistory, setCvHistory] = useState([
    { id: 1, name: 'CV_January_2025.pdf', score: 78, date: '2025-01-15', time: '14:30' },
    { id: 2, name: 'CV_Updated.pdf', score: 65, date: '2025-01-10', time: '09:15' }
  ]);
  
  const [chatHistory] = useState([
    { id: 1, title: 'CV Improvement Tips', date: '2025-01-14', preview: 'How can I improve...' },
    { id: 2, title: 'Interview Preparation', date: '2025-01-12', preview: 'What should I prepare...' }
  ]);
  
  // Charger le user depuis localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/student/login');
    }
  }, [navigate]);
  
  // Handler pour l'upload de CV
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setCvUploaded(true);
    
    // Simuler l'analyse (2 secondes)
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 40) + 55; // Score entre 55-95
      setCvScore(randomScore);
      
      // Ajouter à l'historique
      const newCV = {
        id: cvHistory.length + 1,
        name: file.name,
        score: randomScore,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5)
      };
      setCvHistory([newCV, ...cvHistory]);
    }, 2000);
  };
  
  // Handler pour réinitialiser l'upload
  const handleReset = () => {
    setCvUploaded(false);
    setUploadedFile(null);
    setCvScore(null);
    setActiveView('home');
  };
  
  // Handler pour les clics sur les cercles
  const handleStepClick = (step) => {
    if (!cvUploaded) {
      alert('⚠️ Please upload your CV first before accessing this feature');
      return;
    }
    
    if (step === 'matching' && cvScore < 60) {
      alert('⚠️ Please check AI Resume Advice and improve your CV before applying to jobs (Score must be ≥ 60)');
      return;
    }
    
    setActiveView(step);
  };
  
  // Handler pour logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  // Loading state
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
                uploadedFile={uploadedFile}
                cvScore={cvScore}
                onFileUpload={handleFileUpload}
                onReset={handleReset}
              />
              
              <StepsCircles
                cvUploaded={cvUploaded}
                activeStep={activeView}
                onStepClick={handleStepClick}
              />
            </>
          )}
          
          {/* SCORING VIEW */}
          {activeView === 'scoring' && (
            <ScoringView
              cvScore={cvScore}
              onBack={() => setActiveView('home')}
            />
          )}
          
          {/* ADVICE VIEW */}
          {activeView === 'advice' && (
            <AdviceView
              cvScore={cvScore}
              onBack={() => setActiveView('home')}
            />
          )}
          
          {/* MATCHING VIEW */}
          {activeView === 'matching' && cvScore >= 60 && (
            <MatchingView
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