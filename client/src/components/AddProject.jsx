import React, { useState } from 'react';

const AddProject = ({ onProjectAdded }) => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    tech: '',
    link: '#'
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Adding Project...');
    
    // In a real MERN app, this would be a POST request to /api/projects
    // For this demonstration, we'll simulate the state update
    const newProject = {
      ...project,
      tech: project.tech.split(',').map(t => t.trim())
    };

    // Simulate success
    setStatus('Project added successfully! (Simulated)');
    onProjectAdded(newProject);
    setProject({ title: '', description: '', tech: '', link: '#' });
  };

  return (
    <div className="add-project glass" style={{ margin: '40px auto', maxWidth: '800px', padding: '30px' }}>
      <h3 className="gradient-text" style={{ marginBottom: '20px' }}>Add New Project</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label>Project Title</label>
          <input 
            type="text" 
            required 
            value={project.title}
            onChange={(e) => setProject({...project, title: e.target.value})}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          />
        </div>
        <div className="form-group">
          <label>Tech Stack (comma separated)</label>
          <input 
            type="text" 
            placeholder="React, Node, MongoDB..."
            value={project.tech}
            onChange={(e) => setProject({...project, tech: e.target.value})}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          />
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>Description</label>
          <textarea 
            rows="3" 
            required
            value={project.description}
            onChange={(e) => setProject({...project, description: e.target.value})}
            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Project to Portfolio</button>
      </form>
      {status && <p style={{ marginTop: '15px', color: 'var(--accent-primary)', fontSize: '14px' }}>{status}</p>}
    </div>
  );
};

export default AddProject;
