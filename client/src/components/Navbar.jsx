import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`fixed-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="logo" onClick={closeMenu}>BS<span>.</span></a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact" className="btn btn-outline">Contact</a>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="menu-icon" />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" onClick={closeMenu} role="presentation">
          <div className="mobile-menu-panel glass" onClick={(e) => e.stopPropagation()} role="presentation">
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button type="button" className="mobile-close" onClick={closeMenu} aria-label="Close menu">
                ✕
              </button>
            </div>
            <div className="mobile-links">
              <a href="#home" onClick={closeMenu}>Home</a>
              <a href="#about" onClick={closeMenu}>About</a>
              <a href="#skills" onClick={closeMenu}>Skills</a>
              <a href="#experience" onClick={closeMenu}>Experience</a>
              <a href="#projects" onClick={closeMenu}>Projects</a>
              <a href="#contact" onClick={closeMenu} className="btn btn-outline">Contact</a>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .fixed-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 20px 0;
          transition: var(--transition-smooth);
        }
        .fixed-nav.scrolled {
          background: rgba(10, 10, 12, 0.8);
          backdrop-filter: blur(20px);
          padding: 15px 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: -1px;
        }
        .logo span {
          color: var(--accent-primary);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }
        .nav-links a:not(.btn) {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition-smooth);
        }
        .nav-links a:not(.btn):hover {
          color: var(--text-primary);
        }

        .menu-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .menu-toggle:hover {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.06);
        }
        .menu-icon {
          display: block;
          width: 18px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          position: relative;
        }
        .menu-icon::before,
        .menu-icon::after {
          content: "";
          position: absolute;
          left: 0;
          width: 18px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
        }
        .menu-icon::before { top: -6px; }
        .menu-icon::after { top: 6px; }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 12, 0.7);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 2000;
          padding: 90px 16px 16px;
        }
        .mobile-menu-panel {
          max-width: 520px;
          margin: 0 auto;
          padding: 18px;
        }
        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .mobile-menu-title {
          font-family: var(--font-heading);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .mobile-close {
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-primary);
          border-radius: 10px;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .mobile-links a:not(.btn) {
          text-decoration: none;
          color: var(--text-primary);
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.03);
        }
        .mobile-links a:not(.btn):hover {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.06);
        }
        .mobile-links .btn {
          justify-content: center;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .menu-toggle { display: inline-flex; }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
