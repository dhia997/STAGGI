import { useState } from 'react';
import { uploadCV } from '../../services/api';

function UploadSection({ cvUploaded, cvScore, onUploadSuccess, onReset }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const data = await uploadCV(file);
      onUploadSuccess(data.cv);
    } catch (err) {
      setError(err.message || 'Upload failed, try again');
    } finally {
      setLoading(false);
    }
  };

  // Pendant l'analyse Gemini
  if (loading) {
    return (
      <div className="upload-card">
        <div className="upload-loading">
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>⏳</div>
          <h3>Analyzing your CV with Gemini AI...</h3>
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

  // État initial — upload
  return (
    <div className="upload-card">
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