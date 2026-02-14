import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { recruiterLogin } from '../services/api';
import '../pagesCSS/RecruiterLogin.css';

function RecruiterLogin() {
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
      const data = await recruiterLogin(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-login-page">
      <Header />
      <div className="recruiter-login-container">
        <div className="recruiter-login-card">

          <div className="recruiter-login-icon">💼</div>
          <h1 className="recruiter-login-title">Recruiter Login</h1>
          <p className="recruiter-login-subtitle">Welcome back! Please login to your account</p>

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

            <div className="recruiter-login-field">
              <label className="recruiter-login-label">Email</label>
              <input className="recruiter-login-input" type="email" name="email"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="recruiter-login-field">
              <label className="recruiter-login-label">Password</label>
              <input className="recruiter-login-input" type="password" name="password"
                value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="recruiter-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

          </form>

          <p className="recruiter-login-footer">
            Don't have an account?{' '}
            <span className="recruiter-login-link" onClick={() => navigate('/recruiter/signup')}>
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default RecruiterLogin;