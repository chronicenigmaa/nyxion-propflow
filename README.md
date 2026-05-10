# Propflow — by Nyxion Labs

Property management portal with AI features for Pakistani property builders.

## Stack
- **Frontend** — React + Vite + Tailwind CSS + React Router + Zustand → deployed on Vercel
- **Backend** — Node.js + Express + PostgreSQL → deployed on Railway
- **Auth** — Supabase (email OTP, password reset, session tokens)

## Monorepo structure
```
propflow/
├── frontend/   # Vercel
└── backend/    # Railway
```

## Getting started

### 1. Clone
```bash
git clone https://github.com/nyxionlabs/propflow.git
cd propflow
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# fill in your Railway PostgreSQL URL and Supabase keys
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# fill in your backend URL and Supabase keys
npm install
npm run dev
```

## Deployment
- Push to `main` → Vercel auto-deploys `frontend/`
- Push to `main` → Railway auto-deploys `backend/`

## Environment variables
See `.env.example` in each folder.
