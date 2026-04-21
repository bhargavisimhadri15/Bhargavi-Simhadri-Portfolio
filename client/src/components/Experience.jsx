import React from 'react';

const Experience = ({ experience }) => {
  return (
    <section id="experience" className="experience">
      <div className="section-header">
        <h2 className="gradient-text">Work Experience</h2>
        <div className="underline"></div>
      </div>

      <div className="timeline">
        {experience?.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content glass animate-fade-in">
              <div className="timeline-header">
                <h3>{exp.role}</h3>
                <span className="duration">{exp.duration}</span>
              </div>
              <h4 className="company">{exp.company}</h4>
              <ul className="highlights">
                {exp.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .timeline {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          padding-left: 30px;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 2px;
          background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary), transparent);
        }
        .timeline-item {
          margin-bottom: 50px;
          position: relative;
        }
        .timeline-marker {
          position: absolute;
          left: -36px;
          top: 5px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent-primary);
          box-shadow: 0 0 10px var(--accent-primary);
        }
        .timeline-content {
          padding: 30px;
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .timeline-header h3 {
          font-size: 20px;
          color: var(--text-primary);
        }
        .duration {
          font-size: 14px;
          color: var(--accent-primary);
          font-weight: 600;
        }
        .company {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .highlights {
          list-style: none;
        }
        .highlights li {
          color: var(--text-secondary);
          margin-bottom: 10px;
          position: relative;
          padding-left: 20px;
          font-size: 15px;
        }
        .highlights li::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--accent-primary);
        }
      `}} />
    </section>
  );
};

export default Experience;
