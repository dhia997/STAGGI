// PostJobTab.jsx
import { useState } from 'react';

function PostJobTab({ onPostJob }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    requirements: '',
    skills: '',
    salary: '',
    type: 'internship'
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    onPostJob(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      location: '',
      duration: '',
      requirements: '',
      skills: '',
      salary: '',
      type: 'internship'
    });
    
    alert('✅ Job posted successfully!');
  };
  
  return (
    <div className="post-job-tab">
      <h1>➕ Post New Job</h1>
      <p className="tab-subtitle">Create a new internship opportunity</p>
      
      <form className="job-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer Intern"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the internship, responsibilities, and what the intern will learn..."
            rows="5"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Tunis, Tunisia"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 3 months"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Education level, experience, certifications..."
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Required Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, JavaScript, CSS (comma separated)"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Salary/Stipend</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 500 TND/month or Unpaid"
            />
          </div>
          
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="internship">Internship</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            📤 Post Job
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => setFormData({
              title: '',
              description: '',
              location: '',
              duration: '',
              requirements: '',
              skills: '',
              salary: '',
              type: 'internship'
            })}
          >
            Clear Form
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default PostJobTab;