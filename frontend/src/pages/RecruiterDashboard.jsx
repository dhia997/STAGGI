// RecruiterDashboard.jsx - Page principale Recruteur
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RecruiterSidebar from '../components/dashboardRecruiter/RecruiterSidebar';
import OverviewTab from '../components/dashboardRecruiter/OverviewTab';
import PostJobTab from '../components/dashboardRecruiter/PostJobTab';
import CandidatesTab from '../components/dashboardRecruiter/CandidatesTab';
import MyJobsTab from '../components/dashboardRecruiter/MyJobsTab';
import '../pagesCSS/RecruiterDashboard.css';

function RecruiterDashboard() {
  const navigate = useNavigate();
  
  // États
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'postJob', 'candidates', 'myJobs'
  
  // Mock data (sera remplacé par backend)
  const [postedJobs, setPostedJobs] = useState([
    { 
      id: 1, 
      title: 'Frontend Developer Intern', 
      applicants: 12, 
      posted: '2025-01-20',
      status: 'active',
      location: 'Tunis',
      duration: '3 months'
    },
    { 
      id: 2, 
      title: 'UI/UX Designer Intern', 
      applicants: 8, 
      posted: '2025-01-18',
      status: 'active',
      location: 'Sfax',
      duration: '3 months'
    }
  ]);
  
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Ahmed Ben Ali',
      email: 'ahmed@email.com',
      university: 'INSAT',
      field: 'Computer Science',
      score: 85,
      skills: ['React', 'JavaScript', 'Node.js'],
      cv: 'ahmed_cv.pdf'
    },
    {
      id: 2,
      name: 'Fatma Karoui',
      email: 'fatma@email.com',
      university: 'ESPRIT',
      field: 'Software Engineering',
      score: 78,
      skills: ['Python', 'Django', 'SQL'],
      cv: 'fatma_cv.pdf'
    },
    {
      id: 3,
      name: 'Mohamed Trabelsi',
      email: 'mohamed@email.com',
      university: 'FST',
      field: 'Data Science',
      score: 92,
      skills: ['Python', 'ML', 'TensorFlow'],
      cv: 'mohamed_cv.pdf'
    }
  ]);
  
  // Charger le user
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/recruiter/login');
    }
  }, [navigate]);
  
  // Handler pour logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  // Handler pour poster un job
  const handlePostJob = (jobData) => {
    const newJob = {
      id: postedJobs.length + 1,
      ...jobData,
      applicants: 0,
      posted: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setPostedJobs([newJob, ...postedJobs]);
    setActiveTab('myJobs');
  };
  
  // Handler pour supprimer un job
  const handleDeleteJob = (jobId) => {
    setPostedJobs(postedJobs.filter(job => job.id !== jobId));
  };
  
  // Loading state
  if (!user) return <div>Loading...</div>;
  
  return (
    <div className="recruiter-dashboard">
      <Header />
      
      <div className="dashboard-layout">
        
        {/* SIDEBAR */}
        <RecruiterSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
        
        {/* MAIN CONTENT */}
        <main className="dashboard-main">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <OverviewTab 
              postedJobs={postedJobs}
              candidates={candidates}
            />
          )}
          
          {/* POST JOB TAB */}
          {activeTab === 'postJob' && (
            <PostJobTab onPostJob={handlePostJob} />
          )}
          
          {/* CANDIDATES TAB */}
          {activeTab === 'candidates' && (
            <CandidatesTab candidates={candidates} />
          )}
          
          {/* MY JOBS TAB */}
          {activeTab === 'myJobs' && (
            <MyJobsTab 
              jobs={postedJobs}
              onDeleteJob={handleDeleteJob}
            />
          )}
          
        </main>
      </div>
    </div>
  );
}

export default RecruiterDashboard;