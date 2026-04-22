import React, { useState } from 'react';

const AddProject = ({ onProjectAdded, ownerToken }) => {
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
    
    const newProject = {
      ...project,
      tech: project.tech.split(',').map(t => t.trim())
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ownerToken ? { 'x-admin-token': ownerToken } : {}),
        },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) {
        const contentType = String(res.headers.get('content-type') || '');
        if (contentType.includes('application/json')) {
          const msg = await res.json().catch(() => null);
          setStatus(msg?.message ? `Failed to add project: ${msg.message}` : 'Failed to add project.');
          return;
        }
        throw new Error(`Non-JSON response (${res.status})`);
      }

      const created = await res.json();
      setStatus('Project added successfully!');
      onProjectAdded(created);
      setProject({ title: '', description: '', tech: '', link: '#' });
    } catch (err) {
      setStatus('Failed to add project (server not reachable).');
    }
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
