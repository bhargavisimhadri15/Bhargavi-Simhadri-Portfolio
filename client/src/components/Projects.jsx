import React from 'react';

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="projects">
      <div className="section-header">
        <h2 className="gradient-text">Featured Projects</h2>
        <div className="underline"></div>
      </div>

      <div className="projects-grid">
        {projects?.map((project, index) => (
          <div key={index} className="project-card glass">
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map(t => <span key={t}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
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
