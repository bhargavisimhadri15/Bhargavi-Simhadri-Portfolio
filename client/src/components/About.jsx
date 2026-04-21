import React from 'react';

const About = ({ summary }) => {
  return (
    <section id="about" className="about">
      <div className="section-header">
        <h2 className="gradient-text">About Me</h2>
        <div className="underline"></div>
      </div>
      <div className="about-grid">
        <div className="about-text glass">
          <p>{summary}</p>
          <p>
            I am passionate about creating efficient backend architectures and 
            dynamic, responsive frontends. My goal is to build software that not 
            only works perfectly but also provides an exceptional user experience.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-card glass">
            <h3>2+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-card glass">
            <h3>10+</h3>
            <p>Projects Completed</p>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .section-header {
          margin-bottom: 50px;
          text-align: center;
        }
        .section-header h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        .underline {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          margin: 0 auto;
          border-radius: 2px;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        .about-text {
          padding: 40px;
          font-size: 17px;
          color: var(--text-secondary);
        }
        .about-text p:not(:last-child) {
          margin-bottom: 20px;
        }
        .about-stats {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30px;
          text-align: center;
        }
        .stat-card h3 {
          font-size: 48px;
          margin-bottom: 5px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-card p {
          color: var(--text-secondary);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </section>
  );
};

export default About;
