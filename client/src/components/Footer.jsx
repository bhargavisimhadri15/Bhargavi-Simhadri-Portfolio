import React from 'react';

const Footer = ({ profile }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#" className="logo">BS<span>.</span></a>
          <p>Building the future of web applications with passion and precision.</p>
        </div>
        
        <div className="footer-links">
          <h4>Links</h4>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-social">
          <h4>Social</h4>
          <a className="social-link" href={profile?.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.814 20.452H3.86V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </span>
            LinkedIn
          </a>
          <a className="social-link" href={profile?.github} target="_blank" rel="noopener noreferrer">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.236-3.22-.123-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.044.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.655 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </span>
            GitHub
          </a>
          <a className="social-link" href={`mailto:${profile?.email || 'bhargavisimhadri1998@gmail.com'}`}>
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" focusable="false">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            Email
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {profile?.name}. All rights reserved.</p>
        <p>Designed for excellence.</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          background: #050507;
          padding: 80px 20px 40px;
          border-top: 1px solid var(--glass-border);
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 50px;
          margin-bottom: 60px;
        }
        .footer-brand p {
          color: var(--text-secondary);
          margin-top: 15px;
          max-width: 300px;
        }
        .footer-content h4 {
          margin-bottom: 25px;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer-links, .footer-social {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a, .footer-social a {
          text-decoration: none;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          font-size: 14px;
        }
        .footer-links a:hover, .footer-social a:hover {
          color: var(--accent-primary);
        }
        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
        }
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          padding-top: 30px;
          border-top: 1px solid var(--glass-border);
          color: var(--text-secondary);
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .footer-content { grid-template-columns: 1fr; }
        }
      `}} />
    </footer>
  );
};

export default Footer;
