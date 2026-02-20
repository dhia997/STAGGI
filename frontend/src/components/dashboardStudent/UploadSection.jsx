import { useState } from 'react';
import { uploadCV } from '../../services/api';

function UploadSection({ onUploadSuccess }) {
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = async (file) => {
    // Validation
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
      // Envoie le fichier au backend → Gemini l'analyse
      const data = await uploadCV(file);
      
      // Remonte les résultats au parent (StudentDashboard)
      onUploadSuccess(data.cv);

    } catch (err) {
      setError(err.message || 'Upload failed, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      {loading ? (
        // Pendant l'analyse Gemini
        <div className="upload-loading">
          <div className="spinner">⏳</div>
          <h3>Analyzing your CV with AI...</h3>
          <p>This may take a few seconds</p>
        </div>
      ) : (
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
            <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>
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
      )}
    </div>
  );
}

export default UploadSection;