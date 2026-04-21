import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const DEFAULT_PORT = 5000;
const PORT = Number.parseInt(process.env.PORT ?? '', 10) || DEFAULT_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Fallback to local if no URI)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhargavi_portfolio';

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Falling back to local MongoDB:', MONGODB_URI);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const isMongoConnected = () => mongoose.connection.readyState === 1;

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true, bufferCommands: false }
);

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

const mailTo = process.env.MAIL_TO || 'bhargavisimhadri1998@gmail.com';
const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER || '';
const smtpHost = process.env.SMTP_HOST || '';
const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? '587', 10) || 587;
const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';

const mailer =
  smtpHost
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
      })
    : null;

const isEmailConfigured = () => Boolean(mailer && mailTo && mailFrom);

if (!mailer) {
  console.warn('SMTP_HOST is not set. Email sending is disabled.');
} else if (!mailTo || !mailFrom) {
  console.warn('MAIL_TO or MAIL_FROM is not set. Email sending is disabled.');
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mongoConnected: isMongoConnected(),
    emailConfigured: isEmailConfigured(),
    port: PORT,
  });
});

// Data from Resume
const portfolioData = {
  profile: {
    name: "BHARGAVI SIMHADRI",
    role: "MERN Full Stack Developer",
    email: "bhargavisimhadri1998@gmail.com",
    linkedin: "https://linkedin.com/in/57a226268/",
    github: "https://github.com/bhargavisimhadri15",
    resume: "/resume.pdf",
    summary: "MERN Stack Developer with 2 years of experience building scalable web applications using React.js, Node.js, and MongoDB. Skilled in developing secure REST APIs, optimizing performance, and implementing JWT-based authentication."
  },
  experience: [
    {
      company: "Intechnet Limited",
      role: "MERN Stack Developer",
      duration: "01/2024 – 02/2026",
      highlights: [
        "Developed and maintained 5+ full-stack web applications using the MERN stack, improving system efficiency by 30%",
        "Built 15+ scalable RESTful APIs, reducing data retrieval time by 25%",
        "Designed reusable React.js components, improving UI development speed by 40%",
        "Optimized MongoDB schemas, reducing query execution time by 20%",
        "Implemented JWT-based authentication & RBAC"
      ]
    },
    {
      company: "Deloitte",
      role: "Frontend Developer Intern",
      duration: "01/2022 – 01/2023",
      highlights: [
        "Developed responsive UI components using React.js",
        "Integrated REST APIs to display real-time data",
        "Fixed UI bugs and improved performance, reducing page load time by 15%",
        "Built reusable components, reducing development effort by 30%"
      ]
    },
    {
      company: "Krify",
      role: "Frontend Developer Intern",
      duration: "06/2020 – 07/2020",
      highlights: [
        "Developed a personal portfolio website with optimized performance",
        "Improved page load speed by 20% through code optimization"
      ]
    }
  ],
  projects: [
    {
      title: "1-on-1 Mentor-Student Platform",
      description: "Full-stack mentorship platform with real-time coding sessions, video calls (WebRTC), and collaborative editing via Monaco Editor.",
      tech: ["Next.js", "TypeScript", "Node.js", "Socket.io", "Supabase", "WebRTC", "PostgreSQL"],
      link: "#"
    },
    {
      title: "Smart Project Management Platform",
      description: "MERN-based system for task assignment, project tracking, and team collaboration with an interactive dashboard.",
      tech: ["MongoDB", "Express", "React", "Node.js", "JWT"],
      link: "#"
    },
    {
      title: "Ancestral Medicine Plants App",
      description: "Offline-first web application showcasing traditional medicinal plants with structured categories and offline storage.",
      tech: ["React", "Service Workers", "IndexedDB", "Vanilla CSS"],
      link: "#"
    },
    {
      title: "Landmine Soft Website",
      description: "Modern, responsive company website for software development services with optimized performance.",
      tech: ["React", "Responsive Design", "UX/UI"],
      link: "#"
    },
    {
      title: "Periodic Table Web App",
      description: "Interactive application to explore chemical elements with dynamic data visualization of properties.",
      tech: ["React", "JSON API", "Dynamic UI"],
      link: "#"
    },
    {
      title: "BLOGENTO Blogging Platform",
      description: "Full-stack MERN blogging application with secure JWT authentication and post management.",
      tech: ["MongoDB", "Express", "React", "Node.js"],
      link: "#"
    },
    {
      title: "NoteVault Manager",
      description: "Secure notes management application with CRUD operations and JWT-based security.",
      tech: ["MongoDB", "Express", "React", "Node.js", "JWT"],
      link: "#"
    },
    {
      title: "ShopEasy E-Commerce",
      description: "E-commerce platform featuring product listings, shopping cart, and order management systems.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
      link: "#"
    },
    {
      title: "NexERP Management System",
      description: "Business ERP system for managing organizational operations with role-based authentication.",
      tech: ["MERN Stack", "RBAC", "Dashboard"],
      link: "#"
    },
    {
      title: "CRUD User Management",
      description: "React application for dynamic data retrieval and updates of user records via REST APIs.",
      tech: ["React", "REST API", "Reusable Components"],
      link: "#"
    }
  ],
  skills: {
    core: ["MongoDB", "Express.js", "React.js", "Node.js"],
    frontend: ["HTML5", "CSS3", "JavaScript (ES6+)", "Redux", "Tailwind CSS", "Bootstrap"],
    backend: ["RESTful APIs", "JWT Authentication", "RBAC", "Python"],
    tools: ["Git", "GitHub", "Postman", "VS Code", "MySQL", "PostgreSQL"]
  }
};

// Routes
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData);
});

app.post('/api/contact', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  console.log(`Received message from ${name} (${email}): ${message}`);

  let saved = false;
  try {
    if (!isMongoConnected()) {
      throw new Error('MongoDB is not connected. Check MONGODB_URI and Atlas Network Access.');
    }
    await ContactMessage.create({ name, email, message });
    saved = true;
  } catch (err) {
    console.error('MongoDB save error:', err);
  }

  if (!mailer || !mailTo || !mailFrom) {
    if (saved) {
      return res.status(200).json({
        message: 'Message received and saved. Email sending is not configured on the server yet.',
        saved: true,
        mailSent: false,
      });
    }

    return res.status(500).json({
      message:
        'Message could not be saved (database) and email sending is not configured on the server yet.',
      saved: false,
      mailSent: false,
    });
  }

  try {
    await mailer.sendMail({
      to: mailTo,
      from: mailFrom,
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
      `,
    });

    return res.status(200).json({
      message: saved
        ? 'Message saved and emailed successfully!'
        : 'Message emailed successfully (but failed to save to database).',
      saved,
      mailSent: true,
    });
  } catch (err) {
    console.error('Email send error:', err);
    if (saved) {
      return res.status(200).json({
        message: 'Message saved, but failed to send email.',
        saved: true,
        mailSent: false,
      });
    }

    return res.status(500).json({
      message: 'Message failed to save to database and failed to send email.',
      saved: false,
      mailSent: false,
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error('Stop the other process, or start with a different port.');
    console.error('PowerShell example: $env:PORT=5001; npm run dev');
    process.exit(1);
  }

  console.error('Server error:', err);
  process.exit(1);
});

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
