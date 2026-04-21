# Bhargavi Simhadri — Portfolio (MERN)

Personal developer portfolio built with a **React + Vite** frontend and an **Express** backend that serves portfolio data (and optionally handles contact/email + MongoDB persistence).

## Features

- Modern single-page portfolio UI (Home, About, Skills, Experience, Projects, Contact)
- Resume available at `client/public/resume.pdf`
- Backend API: `GET /api/portfolio`
- (Optional) Contact persistence to MongoDB + email via SMTP

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database (optional): MongoDB (Mongoose)
- Email (optional): Nodemailer (SMTP)

## Getting Started (Local)

### 1) Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` to `http://localhost:5000` (see `client/vite.config.js`).

## Environment Variables

Create `server/.env` (see `server/.env.example`).

- `MONGODB_URI` (optional): MongoDB connection string
- `SMTP_HOST/SMTP_PORT/SMTP_SECURE/SMTP_USER/SMTP_PASS` (optional): SMTP credentials
- `MAIL_TO` (optional): where contact emails should be delivered
- `MAIL_FROM` (optional): sender address (often same as `SMTP_USER`)

## API

- `GET /api/portfolio` → returns portfolio JSON used by the frontend
- `GET /api/health` → shows whether MongoDB/SMTP are configured
- `POST /api/contact` → (optional) saves message to MongoDB and/or sends email (depends on env config)

