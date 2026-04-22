import React from 'react';
import AddProject from './AddProject';
import Projects from './Projects';

const OwnerDashboard = ({
  apiAvailable,
  adminEnabled,
  mongoConnected,
  isOwner,
  ownerToken,
  onLogin,
  onLogout,
  onRefresh,
  projects,
  onProjectUpdated,
  onProjectDeleted,
  onProjectAdded,
}) => {
  const [tokenInput, setTokenInput] = React.useState(ownerToken || '');
  const [status, setStatus] = React.useState('');
  const [seedStatus, setSeedStatus] = React.useState('');

  const needsSeed = Boolean(isOwner && projects?.some((p) => !p?._id));

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('Checking...');
    try {
      await onLogin(tokenInput);
      setStatus('Logged in.');
    } catch (err) {
      setStatus('Invalid token.');
    }
  };

  const handleSeedProjects = async () => {
    setSeedStatus('Initializing projects...');
    try {
      const res = await fetch('/api/projects/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(ownerToken ? { 'x-admin-token': ownerToken } : {}),
        },
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => null);
        setSeedStatus(msg?.message ? `Failed: ${msg.message}` : 'Failed to initialize projects.');
        return;
      }

      setSeedStatus('Initialized. Refreshing...');
      onRefresh?.();
      setTimeout(() => setSeedStatus(''), 2000);
    } catch (err) {
      setSeedStatus('Failed (server not reachable).');
    }
  };

  return (
    <main>
      <section style={{ paddingTop: '60px' }}>
        <div className="section-header">
          <h2 className="gradient-text">Owner Dashboard</h2>
          <div className="underline"></div>
        </div>

        {!apiAvailable && (
          <div className="glass" style={{ padding: '18px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Backend API is not available. Deploy/start the server to manage projects.
            </p>
          </div>
        )}

        {apiAvailable && !adminEnabled && (
          <div className="glass" style={{ padding: '18px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Owner editing is disabled. Set `ADMIN_TOKEN` on the server environment.
            </p>
          </div>
        )}

        {apiAvailable && adminEnabled && !mongoConnected && (
          <div className="glass" style={{ padding: '18px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              MongoDB is not connected. Set `MONGODB_URI` and ensure DB network access.
            </p>
          </div>
        )}

        {apiAvailable && adminEnabled && mongoConnected && (
          <div className="glass" style={{ padding: '18px', marginBottom: '20px' }}>
            {isOwner ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--accent-primary)' }}>
                  Logged in as owner
                </span>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onLogout}
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter ADMIN_TOKEN"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    color: 'white',
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
                  Login
                </button>
              </form>
            )}

            {status && (
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--accent-primary)' }}>
                {status}
              </p>
            )}
          </div>
        )}

        {isOwner && apiAvailable && adminEnabled && mongoConnected && needsSeed && (
          <div className="glass" style={{ padding: '18px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px' }}>Initialize projects for editing</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Your projects are currently coming from static data. Click below to copy them into
              MongoDB so you can edit/delete them.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSeedProjects}
              style={{ padding: '10px 16px', fontSize: '12px' }}
            >
              Initialize Projects
            </button>
            {seedStatus && (
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--accent-primary)' }}>
                {seedStatus}
              </p>
            )}
          </div>
        )}

        {isOwner && apiAvailable && adminEnabled && mongoConnected && (
          <AddProject onProjectAdded={onProjectAdded} ownerToken={ownerToken} />
        )}

        <Projects
          projects={projects}
          isOwner={Boolean(isOwner && apiAvailable && adminEnabled && mongoConnected)}
          ownerToken={ownerToken}
          onProjectUpdated={onProjectUpdated}
          onProjectDeleted={onProjectDeleted}
        />
      </section>
    </main>
  );
};

export default OwnerDashboard;

