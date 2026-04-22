import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import OwnerDashboard from './components/OwnerDashboard';

const readSession = (key) => {
  try {
    return sessionStorage.getItem(key) || '';
  } catch (err) {
    return '';
  }
};

const writeSession = (key, value) => {
  try {
    if (!value) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch (err) {
    // ignore
  }
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [mongoConnected, setMongoConnected] = useState(false);
  const [ownerToken, setOwnerToken] = useState(() => readSession('portfolio_owner_token'));
  const [isOwner, setIsOwner] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [path, setPath] = useState(() => {
    try {
      return window.location.pathname || '/';
    } catch {
      return '/';
    }
  });

  useEffect(() => {
    const onPopState = () => {
      try {
        setPath(window.location.pathname || '/');
      } catch {
        setPath('/');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    (async () => {
      try {
        const res = await fetch('/api/portfolio', { signal: controller.signal });
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        const json = await res.json();
        setData(json);
        setApiAvailable(true);

        try {
          const healthRes = await fetch('/api/health');
          if (healthRes.ok) {
            const health = await healthRes.json();
            setAdminEnabled(Boolean(health?.adminEnabled));
            setMongoConnected(Boolean(health?.mongoConnected));
          } else {
            setAdminEnabled(false);
            setMongoConnected(false);
          }
        } catch (err) {
          setAdminEnabled(false);
          setMongoConnected(false);
        }
      } catch (err) {
        try {
          const res = await fetch('/portfolio.json');
          const json = await res.json();
          setData(json);
          setApiAvailable(false);
          setAdminEnabled(false);
          setMongoConnected(false);
        } catch (fallbackErr) {
          console.error('Error fetching portfolio data:', fallbackErr);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    })();
  }, [reloadCounter]);

  const refreshPortfolio = () => setReloadCounter((c) => c + 1);

  useEffect(() => {
    if (!apiAvailable || !adminEnabled || !ownerToken) {
      setIsOwner(false);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/admin/check', {
          headers: { 'x-admin-token': ownerToken },
          signal: controller.signal,
        });
        setIsOwner(res.ok);
      } catch (err) {
        setIsOwner(false);
      }
    })();

    return () => controller.abort();
  }, [apiAvailable, adminEnabled, ownerToken]);

  const loginOwner = async (token) => {
    const t = String(token || '').trim();
    if (!t) throw new Error('missing');
    if (!apiAvailable) throw new Error('no_api');
    const res = await fetch('/api/admin/check', { headers: { 'x-admin-token': t } });
    if (!res.ok) throw new Error('invalid');
    writeSession('portfolio_owner_token', t);
    setOwnerToken(t);
    setIsOwner(true);
  };

  const logoutOwner = () => {
    writeSession('portfolio_owner_token', '');
    setOwnerToken('');
    setIsOwner(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0c' }}>
        <h2 className="gradient-text">Loading Excellence...</h2>
      </div>
    );
  }

  const isOwnerRoute = path === '/owner';

  const handleAddProject = (newProject) => {
    if (!newProject) return;
    setData((prev) => {
      const prevProjects = Array.isArray(prev?.projects) ? prev.projects : [];
      return { ...(prev || {}), projects: [newProject, ...prevProjects] };
    });
  };

  const handleUpdateProject = (updatedProject) => {
    if (!updatedProject) return;
    setData((prev) => {
      const prevProjects = Array.isArray(prev?.projects) ? prev.projects : [];
      const updatedId = updatedProject?._id;
      if (!updatedId) return prev;
      return {
        ...(prev || {}),
        projects: prevProjects.map((p) => (String(p?._id) === String(updatedId) ? updatedProject : p)),
      };
    });
  };

  const handleDeleteProject = (deletedId) => {
    if (!deletedId) return;
    setData((prev) => {
      const prevProjects = Array.isArray(prev?.projects) ? prev.projects : [];
      return {
        ...(prev || {}),
        projects: prevProjects.filter((p) => String(p?._id) !== String(deletedId)),
      };
    });
  };

  return (
    <div className="app">
      <Navbar />
      {isOwnerRoute ? (
        <OwnerDashboard
          apiAvailable={apiAvailable}
          adminEnabled={adminEnabled}
          mongoConnected={mongoConnected}
          isOwner={isOwner}
          ownerToken={ownerToken}
          onLogin={loginOwner}
          onLogout={logoutOwner}
          onRefresh={refreshPortfolio}
          projects={data?.projects || []}
          onProjectAdded={handleAddProject}
          onProjectUpdated={handleUpdateProject}
          onProjectDeleted={handleDeleteProject}
        />
      ) : (
        <Home data={data} />
      )}
      <Footer profile={data?.profile} />
    </div>
  );
}

export default App;
