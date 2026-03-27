# Online Delivery System

## Features
- Customer registration, login, and order placement
- Real-time driver tracking using Socket.io
- Admin dashboard to assign drivers and monitor orders
- Payment integration using Stripe
- Driver app for order updates and GPS location

## Tech Stack
- Backend: Node.js, Express, Sequelize, PostgreSQL
- Frontend: React, Axios, React Router
- Real-time: Socket.io
- Payment: Stripe

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your secrets
npm run dev
