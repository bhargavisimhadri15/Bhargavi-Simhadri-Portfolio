import React from 'react';

const Hero = ({ profile }) => {
  return (
    <section id="home" className="hero">
      <div className="hero-content animate-fade-in">
        <h3 className="hero-tagline">Hello, I'm</h3>
        <h1 className="hero-name gradient-text">{profile?.name}</h1>
        <h2 className="hero-role">{profile?.role}</h2>
        <p className="hero-description">
          Specializing in building robust, scalable web applications with the 
          <span className="highlight"> MERN Stack</span>. Transforming complex ideas into seamless digital experiences.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href={profile?.resume || "/resume.pdf"} download className="btn btn-outline">Download CV</a>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="blob-gradient"></div>
        <div className="blob-gradient secondary"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero {
          height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          max-width: 700px;
          z-index: 2;
        }
        .hero-tagline {
          color: var(--accent-primary);
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .hero-name {
          font-size: clamp(40px, 8vw, 80px);
          line-height: 1.1;
          margin-bottom: 10px;
        }
        .hero-role {
          font-size: clamp(20px, 4vw, 32px);
          color: var(--text-secondary);
          margin-bottom: 25px;
          font-weight: 500;
        }
        .hero-description {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 35px;
          max-width: 550px;
        }
        .highlight {
          color: var(--text-primary);
          font-weight: 600;
        }
        .hero-actions {
          display: flex;
          gap: 15px;
        }
        .hero-visual {
          position: absolute;
          right: -100px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          width: 500px;
          height: 500px;
          opacity: 0.5;
        }
        .blob-gradient {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
          filter: blur(60px);
          opacity: 0.4;
          border-radius: 50%;
          animation: blobFloat 20s infinite linear;
        }
        .blob-gradient.secondary {
          background: radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%);
          right: -100px;
          bottom: -100px;
          animation-direction: reverse;
          animation-duration: 25s;
        }
        @keyframes blobFloat {
          0% { transform: rotate(0deg) translate(30px) rotate(0deg); }
          100% { transform: rotate(360deg) translate(30px) rotate(-360deg); }
        }

        @media (max-width: 768px) {
          .hero {
            height: auto;
            min-height: 100svh;
            padding-top: 120px;
            padding-bottom: 80px;
            text-align: center;
          }
          .hero-content {
            max-width: 100%;
          }
          .hero-description {
            font-size: 16px;
            margin-left: auto;
            margin-right: auto;
          }
          .hero-actions {
            justify-content: center;
            flex-wrap: wrap;
          }
          .hero-actions .btn {
            width: 100%;
            justify-content: center;
          }
          .hero-visual {
            display: none;
          }
        }
      `}} />
    </section>
  );
};

export default Hero;
