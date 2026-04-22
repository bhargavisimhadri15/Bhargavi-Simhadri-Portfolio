# Bhargavi Simhadri — Portfolio (MERN)

Live site: `https://bhargavi-simhadri-portfolio.vercel.app`

Personal developer portfolio built with a **React + Vite** frontend and an **Express** backend (optional for deployment).

## Features

- Modern single-page portfolio UI (Home, About, Skills, Experience, Projects, Contact)
- Resume available at `client/public/resume.pdf`
- Frontend loads data from `client/public/portfolio.json`
- (Optional) Backend API + MongoDB + SMTP contact handling

## Tech Stack

- Frontend: React, Vite
- Backend (optional): Node.js, Express
- Database (optional): MongoDB (Mongoose)
- Email (optional): Nodemailer (SMTP)

## Getting Started (Local)

### Frontend

```bash
cd client
npm install
npm run dev
```

Owner-only CRUD:
- Go to `/owner`, enter `ADMIN_TOKEN` (from `server/.env`) to enable add/edit/delete.
- Click **Initialize Projects** once (owner-only) to copy static projects into MongoDB.

### Backend (optional)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Environment Variables (Backend)

Create `server/.env` (see `server/.env.example`).

- `MONGODB_URI` (optional): MongoDB connection string
- `ADMIN_TOKEN` (required for owner CRUD): send as `x-admin-token` for project write APIs
- `SMTP_HOST/SMTP_PORT/SMTP_SECURE/SMTP_USER/SMTP_PASS` (optional): SMTP credentials
- `MAIL_TO` (optional): where contact emails should be delivered
- `MAIL_FROM` (optional): sender address (often same as `SMTP_USER`)

## API (Backend)

- `GET /api/portfolio`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/health`
- `GET /api/admin/check` (owner token check)
- `POST /api/contact`

## Deploy (Vercel)

This repo deploys the React app as static output (`client/dist`) and exposes the backend as a Vercel Function (`api/index.js`).

In the Vercel project settings, set:
- `MONGODB_URI`
- `ADMIN_TOKEN`
