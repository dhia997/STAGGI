// RecruiterDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RecruiterSidebar from '../components/dashboardRecruiter/RecruiterSidebar';
import OverviewTab from '../components/dashboardRecruiter/OverviewTab';
import PostJobTab from '../components/dashboardRecruiter/PostJobTab';
import CandidatesTab from '../components/dashboardRecruiter/CandidatesTab';
import MyJobsTab from '../components/dashboardRecruiter/MyJobsTab';
import '../pagesCSS/RecruiterDashboard.css';

const BASE_URL = 'http://localhost:5000/api';

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [postedJobs, setPostedJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    else navigate('/recruiter/login');
  }, [navigate]);

  // Charger jobs et candidates depuis MongoDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Charger mes jobs
        const jobsRes = await fetch(`${BASE_URL}/jobs/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobsData = await jobsRes.json();
        if (jobsData.success) setPostedJobs(jobsData.jobs);

        // Charger les candidats
        const candidatesRes = await fetch(`${BASE_URL}/jobs/candidates`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const candidatesData = await candidatesRes.json();
        if (candidatesData.success) setCandidates(candidatesData.candidates);

      } catch (err) {
        console.error('Error loading recruiter data:', err);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Poster un job vers MongoDB
  const handlePostJob = async (jobData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await res.json();
      if (data.success) {
        setPostedJobs(prev => [data.job, ...prev]);
        setActiveTab('myJobs');
      }
    } catch (err) {
      console.error('Error posting job:', err);
      alert('❌ Error posting job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un job depuis MongoDB
  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setPostedJobs(prev => prev.filter(job => job._id !== jobId));
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // Changer le statut d'un job
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';

      const res = await fetch(`${BASE_URL}/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        setPostedJobs(prev =>
          prev.map(job => job._id === jobId ? { ...job, status: newStatus } : job)
        );
      }
    } catch (err) {
      console.error('Error toggling job status:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="recruiter-dashboard">
      <Header />

      <div className="dashboard-layout">

        <RecruiterSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        <main className="dashboard-main">

          {activeTab === 'overview' && (
            <OverviewTab
              postedJobs={postedJobs}
              candidates={candidates}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'postJob' && (
            <PostJobTab
              onPostJob={handlePostJob}
              loading={loading}
            />
          )}

          {activeTab === 'candidates' && (
            <CandidatesTab candidates={candidates} />
          )}

          {activeTab === 'myJobs' && (
            <MyJobsTab
              jobs={postedJobs}
              onDeleteJob={handleDeleteJob}
              onToggleStatus={handleToggleStatus}
            />
          )}

        </main>
      </div>
    </div>
  );
}

export default RecruiterDashboard;