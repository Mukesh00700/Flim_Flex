# BookMyShow Clone (React + Node + Prisma + PostgreSQL)

Monorepo with:
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- DB: PostgreSQL via Prisma
- Auth: JWT (Bearer token)

## Structure
- `/client` React + Tailwind
- `/server` Express + Prisma

## Prerequisites
- Node 18+
- PostgreSQL 14+

## Setup
1) Copy envs:
- cp .env.example .env
- cp server/.env.example server/.env
- cp client/.env.example client/.env

2) Install deps:
- cd server && npm install && cd ..
- cd client && npm install && cd ..

3) DB + Prisma:
- cd server
- npx prisma migrate dev --name init
- npx prisma generate
- cd ..

4) Run:
- cd server && npm run dev
- cd client && npm run dev