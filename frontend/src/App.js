import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentSignup from './pages/StudentSignup';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/Studentdashboard';
import RecruiterSignup from './pages/RecruiterSignup';
import RecruiterLogin from './pages/RecruiterLogin';
import RecruiterDashboard from './pages/RecruiterDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 1 */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Page 2 */}
        <Route path="/student/signup" element={<StudentSignup />} />
        
        {/* Page 3 */}
        <Route path="/student/login" element={<StudentLogin />} />
        
        {/* Page 4 */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        {/* Page 5 */}
        <Route path="/recruiter/signup" element={<RecruiterSignup />} />
        
        {/* Page 6 */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        
        {/* Page 7 */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;