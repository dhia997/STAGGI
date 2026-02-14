import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { studentLogin } from '../services/api';
import '../pagesCSS/StudentLogin.css';

function StudentLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await studentLogin(formData);
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-page">
      <Header />
      <div className="student-login-container">
        <div className="student-login-card">

          <div className="student-login-icon">🎓</div>
          <h1 className="student-login-title">Student Login</h1>
          <p className="student-login-subtitle">Welcome back! Please login to your account</p>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '12px 16px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="student-login-field">
              <label className="student-login-label">Email</label>
              <input className="student-login-input" type="email" name="email"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="student-login-field">
              <label className="student-login-label">Password</label>
              <input className="student-login-input" type="password" name="password"
                value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="student-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

          </form>

          <p className="student-login-footer">
            Don't have an account?{' '}
            <span className="student-login-link" onClick={() => navigate('/student/signup')}>
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default StudentLogin;