import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="section-header">
        <h2 className="gradient-text">Get In Touch</h2>
        <div className="underline"></div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Let's talk about your next project</h3>
          <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
          <div className="info-item">
            <span>Email</span>
            <p>bhargavisimhadri1998@gmail.com</p>
          </div>

          <div className="contact-actions">
            <a className="btn btn-primary" href="mailto:bhargavisimhadri1998@gmail.com">
              Email Me
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .contact-info h3 {
          font-size: 28px;
          margin-bottom: 20px;
        }
        .contact-info p {
          color: var(--text-secondary);
          margin-bottom: 30px;
        }
        .info-item {
          margin-bottom: 20px;
        }
        .info-item span {
          color: var(--accent-primary);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .info-item p {
          color: var(--text-primary);
          margin-top: 5px;
          margin-bottom: 0;
        }
        .contact-actions {
          margin-top: 25px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}} />
    </section>
  );
};

export default Contact;
