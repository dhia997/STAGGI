import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { studentSignup } from '../services/api';
import '../pagesCSS/StudentSignup.css';


function StudentSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    fieldOfStudy: '',
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
      const data = await studentSignup(formData);
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/student/dashboard'); // redirect after signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-signup-page">
      <Header />
      <div className="student-signup-container">
        <div className="student-signup-card">

          <div className="student-signup-icon">🎓</div>
          <h1 className="student-signup-title">Student Signup</h1>
          <p className="student-signup-subtitle">Create your account to get started</p>

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

            <div className="student-signup-field">
              <label className="student-signup-label">Full Name</label>
              <input className="student-signup-input" type="text" name="fullName"
                value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="student-signup-field">
              <label className="student-signup-label">Email</label>
              <input className="student-signup-input" type="email" name="email"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="student-signup-field">
              <label className="student-signup-label">University/School</label>
              <input className="student-signup-input" type="text" name="university"
                value={formData.university} onChange={handleChange} required />
            </div>

            <div className="student-signup-field">
              <label className="student-signup-label">Field of Study</label>
              <input className="student-signup-input" type="text" name="fieldOfStudy"
                value={formData.fieldOfStudy} onChange={handleChange} required
                placeholder="e.g., Computer Science, Engineering..." />
            </div>

            <div className="student-signup-field">
              <label className="student-signup-label">Password</label>
              <input className="student-signup-input" type="password" name="password"
                value={formData.password} onChange={handleChange} required />
            </div>

            <div className="student-signup-field">
              <label className="student-signup-label">Confirm Password</label>
              <input className="student-signup-input" type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <label className="student-signup-checkbox-wrapper">
              <input className="student-signup-checkbox" type="checkbox" name="agreeToTerms"
                checked={formData.agreeToTerms} onChange={handleChange} required />
              <span className="student-signup-checkbox-text">
                I agree to the <span className="student-signup-terms">Terms and Conditions</span>
              </span>
            </label>

            <button type="submit" className="student-signup-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>

          </form>

          <p className="student-signup-footer">
            Already have an account?{' '}
            <span className="student-signup-link" onClick={() => navigate('/student/login')}>
              Log In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default StudentSignup;