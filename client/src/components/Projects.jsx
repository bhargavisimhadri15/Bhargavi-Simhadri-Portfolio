import React from 'react';

const Projects = ({ projects, isOwner = false, ownerToken, onProjectUpdated, onProjectDeleted }) => {
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ title: '', description: '', tech: '', link: '#' });
  const [status, setStatus] = React.useState('');

  const getId = (p) => p?._id || p?._localId;
  const isLocal = (p) => String(p?._localId || '').startsWith('local_');
  const techToString = (tech) => (Array.isArray(tech) ? tech.join(', ') : String(tech || ''));
  const techToArray = (value) =>
    String(value || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const startEdit = (project) => {
    const id = getId(project);
    if (!id) return;
    setEditingId(String(id));
    setDraft({
      title: project?.title || '',
      description: project?.description || '',
      tech: techToString(project?.tech),
      link: project?.link || '#',
    });
    setStatus('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ title: '', description: '', tech: '', link: '#' });
    setStatus('');
  };

  const handleDelete = async (project) => {
    if (!isOwner) return;
    const id = getId(project);
    if (!id) return;
    if (!confirm('Delete this project?')) return;

    if (isLocal(project)) {
      onProjectDeleted?.(id);
      return;
    }

    setStatus('Deleting...');
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          ...(ownerToken ? { 'x-admin-token': ownerToken } : {}),
        },
      });
      if (!res.ok) {
        const contentType = String(res.headers.get('content-type') || '');
        if (contentType.includes('application/json')) {
          const msg = await res.json().catch(() => null);
          setStatus(msg?.message ? `Delete failed: ${msg.message}` : 'Delete failed.');
          return;
        }
        throw new Error(`Non-JSON response (${res.status})`);
      }
      onProjectDeleted?.(id);
      setStatus('Deleted.');
    } catch (err) {
      setStatus('Delete failed (server not reachable).');
    }
  };

  const handleSave = async (project) => {
    if (!isOwner) return;
    const id = getId(project);
    if (!id) return;

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      tech: techToArray(draft.tech),
      link: draft.link.trim() || '#',
    };

    if (!payload.title || !payload.description) {
      setStatus('Title and description are required.');
      return;
    }

    if (isLocal(project)) {
      onProjectUpdated?.({ ...project, ...payload });
      setStatus('Updated locally.');
      setEditingId(null);
      return;
    }

    setStatus('Saving...');
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(ownerToken ? { 'x-admin-token': ownerToken } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const contentType = String(res.headers.get('content-type') || '');
        if (contentType.includes('application/json')) {
          const msg = await res.json().catch(() => null);
          setStatus(msg?.message ? `Save failed: ${msg.message}` : 'Save failed.');
          return;
        }
        throw new Error(`Non-JSON response (${res.status})`);
      }
      const updated = await res.json();
      onProjectUpdated?.(updated);
      setStatus('Saved.');
      setEditingId(null);
    } catch (err) {
      setStatus('Save failed (server not reachable).');
    }
  };

  return (
    <section id="projects" className="projects">
      <div className="section-header">
        <h2 className="gradient-text">Featured Projects</h2>
        <div className="underline"></div>
      </div>

      <div className="projects-grid">
        {projects?.map((project, index) => {
          const id = getId(project);
          const idKey = id ? String(id) : `idx_${index}`;
          const tech = Array.isArray(project?.tech) ? project.tech : [];
          const editing = editingId && id && String(editingId) === String(id);

          return (
            <div key={idKey} className="project-card glass">
              <div className="project-content">
                {!editing ? (
                  <>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    {isOwner && (
                      <div className="project-actions">
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => startEdit(project)}
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => handleDelete(project)}
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="project-edit">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                          value={draft.title}
                          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Tech (comma separated)
                        </label>
                        <input
                          value={draft.tech}
                          onChange={(e) => setDraft((d) => ({ ...d, tech: e.target.value }))}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                          rows="3"
                          value={draft.description}
                          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            resize: 'vertical',
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Link</label>
                        <input
                          value={draft.link}
                          onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                          }}
                        />
                      </div>
                    </div>
                    <div className="project-actions" style={{ marginTop: '14px' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleSave(project)}
                        style={{ padding: '8px 14px', fontSize: '12px' }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={cancelEdit}
                        style={{ padding: '8px 14px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {status && editing && (
                  <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--accent-primary)' }}>
                    {status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .project-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: var(--transition-smooth);
        }
        .project-card:hover {
          transform: translateY(-10px);
          border-color: var(--accent-primary);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .project-card h3 {
          font-size: 22px;
          margin-bottom: 15px;
          color: var(--text-primary);
        }
        .project-card p {
          color: var(--text-secondary);
          margin-bottom: 25px;
          font-size: 15px;
          flex-grow: 1;
        }
        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }
        .project-tech span {
          font-size: 12px;
          color: var(--accent-primary);
          font-family: monospace;
          background: rgba(99, 102, 241, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .project-actions {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .link-btn {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: gap 0.3s;
        }
        .link-btn:hover {
          color: var(--accent-primary);
          gap: 12px;
        }
      `}} />
    </section>
  );
};

export default Projects;
