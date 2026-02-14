import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { recruiterSignup } from '../services/api';
import '../pagesCSS/RecruiterSignup.css';

function RecruiterSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    position: '',
    companyWebsite: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const data = await recruiterSignup(formData);
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
    <div className="recruiter-signup-page">
      <Header />
      <div className="recruiter-signup-container">
        <div className="recruiter-signup-card">

          <div className="recruiter-signup-icon">💼</div>
          <h1 className="recruiter-signup-title">Recruiter Signup</h1>
          <p className="recruiter-signup-subtitle">Create your company account</p>

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

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Company Name</label>
              <input className="recruiter-signup-input" type="text" name="companyName"
                value={formData.companyName} onChange={handleChange} required />
            </div>

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Email</label>
              <input className="recruiter-signup-input" type="email" name="email"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Position/Role</label>
              <input className="recruiter-signup-input" type="text" name="position"
                value={formData.position} onChange={handleChange} required
                placeholder="e.g., HR Manager, Recruiter..." />
            </div>

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Company Website</label>
              <input className="recruiter-signup-input" type="url" name="companyWebsite"
                value={formData.companyWebsite} onChange={handleChange} required
                placeholder="https://www.example.com" />
            </div>

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Password</label>
              <input className="recruiter-signup-input" type="password" name="password"
                value={formData.password} onChange={handleChange} required />
            </div>

            <div className="recruiter-signup-field">
              <label className="recruiter-signup-label">Confirm Password</label>
              <input className="recruiter-signup-input" type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <label className="recruiter-signup-checkbox-wrapper">
              <input className="recruiter-signup-checkbox" type="checkbox" name="agreeToTerms"
                checked={formData.agreeToTerms} onChange={handleChange} required />
              <span className="recruiter-signup-checkbox-text">
                I agree to the <span className="recruiter-signup-terms">Terms and Conditions</span>
              </span>
            </label>

            <button type="submit" className="recruiter-signup-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

          </form>

          <p className="recruiter-signup-footer">
            Already have an account?{' '}
            <span className="recruiter-signup-link" onClick={() => navigate('/recruiter/login')}>
              Log In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default RecruiterSignup;