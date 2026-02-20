import { useState } from 'react';
import { uploadCV } from '../../services/api';

function UploadSection({ cvUploaded, cvScore, onUploadSuccess, onReset }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) validateAndUpload(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) validateAndUpload(e.target.files[0]);
  };

  const validateAndUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('❌ Only PDF files are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('❌ File must be less than 5MB');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // On envoie le fichier + le prompt personnalisé
      const data = await uploadCV(file, prompt);
      onUploadSuccess(data.cv);
    } catch (err) {
      setError(err.message || 'Upload failed, try again');
    } finally {
      setLoading(false);
    }
  };

  // Pendant l'analyse
  if (loading) {
    return (
      <div className="upload-card">
        <div className="upload-loading">
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>⏳</div>
          <h3>Analyzing your CV with AI...</h3>
          <p style={{ color: '#6b7280' }}>This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Après upload réussi
  if (cvUploaded) {
    return (
      <div className="upload-card">
        <div className="upload-success">
          <div style={{ fontSize: '50px' }}>✅</div>
          <h3>CV Analyzed Successfully!</h3>
          {cvScore !== null && (
            <div className="quick-score">
              <span>Your CV Score: </span>
              <span className={`score-badge ${cvScore >= 60 ? 'score-good' : 'score-low'}`}>
                {cvScore}%
              </span>
            </div>
          )}
          <button className="upload-another-btn" onClick={onReset}>
            Upload Another CV
          </button>
        </div>
      </div>
    );
  }

  // État initial — upload avec prompt
  return (
    <div className="upload-card">

      {/* PROMPT PERSONNALISÉ */}
      <div style={{ marginBottom: '20px', padding: '0 10px' }}>
        <label style={{
          display: 'block', fontWeight: '600',
          fontSize: '14px', color: '#374151', marginBottom: '8px'
        }}>
          💬 Tell us what you're looking for <span style={{ color: '#9ca3af', fontWeight: '400' }}>(optional)</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: I'm looking for a 3-month web development internship in Tunis. I want to improve my React skills..."
          rows={3}
          style={{
            width: '100%', padding: '10px 14px',
            border: '2px solid #e5e7eb', borderRadius: '10px',
            fontSize: '14px', color: '#374151',
            resize: 'none', outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          This helps AI give you more personalized advice
        </p>
      </div>

      {/* UPLOAD AREA */}
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon">☁️</div>
        <h2>Upload Your CV</h2>
        <p>Drag and drop or click to browse</p>
        <p className="upload-hint">PDF only - Max 5MB</p>

        {error && (
          <p style={{ color: '#dc2626', margin: '10px 0', fontWeight: '600' }}>
            {error}
          </p>
        )}

        <input
          type="file"
          id="cv-upload"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="cv-upload" className="upload-btn">
          📤 Browse Files
        </label>
      </div>

    </div>
  );
}

export default UploadSection;