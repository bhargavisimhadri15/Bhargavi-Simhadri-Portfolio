import React, { useState } from 'react';

const ResumeCRUD = ({ currentResume, onUpdate }) => {
  const [newUrl, setNewUrl] = useState(currentResume || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('Updating URL...');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeUrl: newUrl })
      });
      const result = await res.json();
      if (res.ok) {
        setStatus('Resume URL updated successfully!');
        onUpdate(result.data.resume);
      } else {
        setStatus('Failed to update URL.');
      }
    } catch (err) {
      setStatus('Error connecting to server.');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setStatus('Please select a file first.');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setStatus('Uploading file...');
    try {
      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (res.ok) {
        setStatus('File uploaded and linked successfully!');
        setNewUrl(result.fileUrl);
        onUpdate(result.fileUrl);
      } else {
        setStatus('Upload failed: ' + result.message);
      }
    } catch (err) {
      setStatus('Error uploading file.');
    }
  };

  return (
    <div className="resume-crud glass" style={{ margin: '40px auto', maxWidth: '600px', padding: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>Resume CRUD & Upload Manager</h3>
      
      {/* File Upload Section */}
      <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
        <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Upload New CV File</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ fontSize: '13px' }}
          />
          <button 
            onClick={handleFileUpload}
            className="btn btn-primary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Upload & Link
          </button>
        </div>
      </div>

      {/* URL Update Section */}
      <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Or Update Resume URL Manually:</label>
          <input 
            type="text" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter URL"
            style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)',
              color: 'white'
            }}
          />
        </div>
        <button type="submit" className="btn btn-outline" style={{ padding: '8px 15px', fontSize: '14px' }}>
          Update URL Only
        </button>
      </form>
      {status && <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--accent-primary)' }}>{status}</p>}
    </div>
  );
};

export default ResumeCRUD;
