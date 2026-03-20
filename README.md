# DevTinder

Full-stack DevTinder project with separate backend and frontend apps in one repository.

## Tech Stack

- Backend: Node.js, Express, MongoDB
- Frontend: React, Vite, Tailwind CSS, Redux Toolkit

## Project Structure

```text
devtinder/
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB connection string

## Setup & Run

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on the port configured in your backend environment variables.

### 2) Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite default port (usually `5173`) unless changed.

## Environment Variables

Create `.env` files where needed:

- `backend/.env` (database URL, JWT secret, port, etc.)
- `frontend/.env` (API base URL if your frontend uses env-based config)

## Git Workflow (Recommended)

Stage only important source/config files before commit:

```bash
git add .gitignore README.md backend/src frontend/src/Components frontend/src/utils backend/package.json backend/package-lock.json frontend/package.json frontend/package-lock.json
```

Preview staged files:

```bash
git diff --cached --name-only
```

Commit:

```bash
git commit -m "Add backend APIs and frontend components/utils"
```

Push:

```bash
git push -u origin main
```
