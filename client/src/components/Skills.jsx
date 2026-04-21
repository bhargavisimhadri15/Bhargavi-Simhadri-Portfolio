import React from 'react';

const Skills = ({ skills }) => {
  return (
    <section id="skills" className="skills">
      <div className="section-header">
        <h2 className="gradient-text">My Expertise</h2>
        <div className="underline"></div>
      </div>
      
      <div className="skills-container">
        <div className="skill-category glass">
          <h3>MERN Core</h3>
          <div className="skill-list">
            {skills?.core?.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>
        
        <div className="skill-category glass">
          <h3>Frontend</h3>
          <div className="skill-list">
            {skills?.frontend?.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>

        <div className="skill-category glass">
          <h3>Backend & Security</h3>
          <div className="skill-list">
            {skills?.backend?.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>

        <div className="skill-category glass">
          <h3>Tools & DB</h3>
          <div className="skill-list">
            {skills?.tools?.map(skill => (
              <div key={skill} className="skill-item">{skill}</div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .skills-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }
        .skill-category {
          padding: 30px;
          transition: var(--transition-smooth);
        }
        .skill-category:hover {
          transform: translateY(-5px);
          border-color: var(--accent-primary);
        }
        .skill-category h3 {
          margin-bottom: 20px;
          font-size: 18px;
          color: var(--text-primary);
          border-left: 3px solid var(--accent-primary);
          padding-left: 12px;
        }
        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .skill-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          border: 1px solid var(--glass-border);
          transition: var(--transition-smooth);
        }
        .skill-item:hover {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }
      `}} />
    </section>
  );
};

export default Skills;
