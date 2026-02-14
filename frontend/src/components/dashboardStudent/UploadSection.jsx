// UploadSection.jsx
import { useState } from 'react';

function UploadSection({ cvUploaded, uploadedFile, cvScore, onFileUpload, onReset }) {
  const [dragActive, setDragActive] = useState(false);
  
  // Gérer le drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };
  
  // Gérer la sélection de fichier
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };
  
  // Valider et uploader le fichier
  const validateAndUpload = (file) => {
    // Vérifier le type
    const isPDF = file.type === 'application/pdf';
    const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (!isPDF && !isDOCX) {
      alert('❌ Please upload a PDF or DOCX file');
      return;
    }
    
    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ File size must be less than 5MB');
      return;
    }
    
    // Tout est bon, uploader
    onFileUpload(file);
  };
  
  return (
    <div className="upload-card">
      
      {/* SI le CV n'est PAS encore uploadé */}
      {!cvUploaded ? (
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
          <p className="upload-hint">PDF, DOCX - Max 5MB</p>
          
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <label htmlFor="cv-upload" className="upload-btn">
            📤 Browse Files
          </label>
        </div>
      ) : (
        /* SINON (CV uploadé) */
        <div className="upload-success">
          <div className="success-icon">✅</div>
          <h3>CV Uploaded Successfully!</h3>
          <p className="uploaded-file-name">📄 {uploadedFile?.name}</p>
          
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
      )}
      
    </div>
  );
}

export default UploadSection;