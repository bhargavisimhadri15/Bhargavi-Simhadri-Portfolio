import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import path from 'node:path';
import crypto from 'node:crypto';
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

let mongoConnectPromise = null;

const connectMongo = () => {
  if (mongoConnectPromise) return mongoConnectPromise;

  mongoConnectPromise = mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return true;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      mongoConnectPromise = null;
      throw err;
    });

  return mongoConnectPromise;
};

connectMongo().catch(() => {});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const isMongoConnected = () => mongoose.connection.readyState === 1;
const ensureMongoConnected = async () => {
  if (isMongoConnected()) return true;
  try {
    await connectMongo();
  } catch {
    return false;
  }
  return isMongoConnected();
};

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

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tech: { type: [String], default: [] },
    link: { type: String, default: '#', trim: true },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true, bufferCommands: false }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

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
    adminEnabled: Boolean(String(process.env.ADMIN_TOKEN || '').trim()),
    port: PORT,
  });
});

const adminToken = String(process.env.ADMIN_TOKEN || '').trim();
if (!adminToken) {
  console.warn('ADMIN_TOKEN is not set. Project write APIs are disabled.');
}

function isValidAdminToken(provided) {
  if (!adminToken) return false;
  if (!provided) return false;

  try {
    const a = Buffer.from(String(adminToken), 'utf8');
    const b = Buffer.from(String(provided), 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  if (!adminToken) {
    return res.status(503).json({ message: 'Admin is not configured on the server.' });
  }

  const headerToken = String(req.header('x-admin-token') || '').trim();
  const authHeader = String(req.header('authorization') || '').trim();
  const bearerToken =
    authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';

  const token = headerToken || bearerToken;

  if (isValidAdminToken(token)) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

app.get('/api/admin/check', requireAdmin, (req, res) => {
  res.json({ ok: true });
});

function normalizeTech(value) {
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
  }
  return [];
}

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
app.get('/api/portfolio', async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.json(portfolioData);
  }

  try {
    const dbProjects = await Project.find({})
      .sort({ featured: -1, order: -1, createdAt: -1 })
      .lean();

    if (!dbProjects.length) {
      return res.json(portfolioData);
    }

    const projects = dbProjects.map(p => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      tech: Array.isArray(p.tech) ? p.tech : [],
      link: p.link || '#',
    }));

    return res.json({ ...portfolioData, projects });
  } catch (err) {
    console.error('Failed to load projects from MongoDB:', err);
    return res.json(portfolioData);
  }
});

app.get('/api/projects', async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  try {
    const projects = await Project.find({})
      .sort({ featured: -1, order: -1, createdAt: -1 })
      .lean();
    return res.json(projects);
  } catch (err) {
    console.error('Failed to list projects:', err);
    return res.status(500).json({ message: 'Failed to list projects.' });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json(project);
  } catch (err) {
    console.error('Failed to fetch project:', err);
    return res.status(400).json({ message: 'Invalid project id.' });
  }
});

app.post('/api/projects', requireAdmin, async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  const title = String(req.body?.title || '').trim();
  const description = String(req.body?.description || '').trim();
  const link = String(req.body?.link || '#').trim() || '#';
  const tech = normalizeTech(req.body?.tech);
  const featured = typeof req.body?.featured === 'boolean' ? req.body.featured : true;
  const order = Number.isFinite(Number(req.body?.order)) ? Number(req.body.order) : 0;

  if (!title || !description) {
    return res.status(400).json({ message: 'title and description are required.' });
  }

  try {
    const created = await Project.create({ title, description, tech, link, featured, order });
    return res.status(201).json(created);
  } catch (err) {
    console.error('Failed to create project:', err);
    return res.status(500).json({ message: 'Failed to create project.' });
  }
});

app.post('/api/projects/seed', requireAdmin, async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  try {
    const existingCount = await Project.estimatedDocumentCount();
    if (existingCount > 0) {
      return res.status(409).json({
        message: 'Projects already exist in the database. Seed skipped.',
        existingCount,
      });
    }

    const seedProjects = Array.isArray(portfolioData?.projects) ? portfolioData.projects : [];
    if (!seedProjects.length) {
      return res.status(400).json({ message: 'No seed projects found.' });
    }

    const docs = seedProjects.map((p, idx) => ({
      title: String(p?.title || '').trim(),
      description: String(p?.description || '').trim(),
      tech: normalizeTech(p?.tech),
      link: String(p?.link || '#').trim() || '#',
      featured: true,
      order: seedProjects.length - idx,
    })).filter(p => p.title && p.description);

    if (!docs.length) {
      return res.status(400).json({ message: 'Seed projects are invalid.' });
    }

    const inserted = await Project.insertMany(docs);
    return res.status(201).json({ insertedCount: inserted.length });
  } catch (err) {
    console.error('Failed to seed projects:', err);
    return res.status(500).json({ message: 'Failed to seed projects.' });
  }
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  const updates = {};

  if (req.body?.title !== undefined) updates.title = String(req.body.title || '').trim();
  if (req.body?.description !== undefined) {
    updates.description = String(req.body.description || '').trim();
  }
  if (req.body?.link !== undefined) updates.link = String(req.body.link || '#').trim() || '#';
  if (req.body?.tech !== undefined) updates.tech = normalizeTech(req.body.tech);
  if (req.body?.featured !== undefined) updates.featured = Boolean(req.body.featured);
  if (req.body?.order !== undefined && Number.isFinite(Number(req.body.order))) {
    updates.order = Number(req.body.order);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided.' });
  }

  if (updates.title === '' || updates.description === '') {
    return res.status(400).json({ message: 'title/description cannot be empty.' });
  }

  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Project not found.' });
    return res.json(updated);
  } catch (err) {
    console.error('Failed to update project:', err);
    return res.status(400).json({ message: 'Invalid project id.' });
  }
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  if (!(await ensureMongoConnected())) {
    return res.status(503).json({ message: 'MongoDB is not connected.' });
  }

  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found.' });
    return res.status(204).end();
  } catch (err) {
    console.error('Failed to delete project:', err);
    return res.status(400).json({ message: 'Invalid project id.' });
  }
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
    if (!(await ensureMongoConnected())) {
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

if (!process.env.VERCEL) {
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
}

export default app;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
