## FundTrust

FundTrust is a full-stack donation tracking web application designed to build transparency and trust between donors and non-governmental organizations (NGOs). The platform enables categorized charity management, secure Stripe-powered donations, and real-time impact tracking through a transparency dashboard.

FundTrust ensures that every donation is securely processed, properly categorized, and transparently reported.

## Project Overview

FundTrust connects donors with verified charities and provides visibility into how funds are allocated. The system supports both one-time and recurring donations, tracks impact metrics, and enforces role-based access control for secure administration.

## Core Features

### Authentication & Security
- JWT-based authentication
- Role-based access control (Admin & Donor roles)
- Protected API routes
- Secure password handling

### Category Management
- Public category listing
- Admin-only category creation
- Admin-only category update & deletion
- Structured charity categorization

### Charity Management
- Create, update, and delete charities (Admin only)
- Assign charities to categories
- Track charity goals and transparency updates

### Donation System
- One-time donations via Stripe PaymentIntent
- Donation history tracking per user

### Transparency & Impact Tracking
- Aggregated donation summaries
- Total funds per charity
- Donation count metrics
- Structured data for dashboard visualization
- MongoDB aggregation pipeline for analytics

## Project Structure

FundTrust/
├── client/               # React (Vite) frontend
│   ├── src/
│   └── package.json
│
├── server/               # Express API + MongoDB backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
└── README.md

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT (JSON Web Tokens)
- Stripe API

### Frontend
- React (Vite)
- Axios
- React Router DOM

## Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Stripe account (Test keys)

## Backend Setup

### 1️Navigate to Server

```bash
cd server
```

### 2️Create Environment File

```bash
cp .env.example .env
```

Update `.env` with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000/api
```
##  Stripe Integration

FundTrust supports:

- Secure payment processing via Stripe
- One-time donations using PaymentIntent

To enable live Stripe functionality, provide your test secret key in `.env`.

---

##  Transparency & Impact Tracking

FundTrust includes:

- Donation aggregation using MongoDB pipelines
- Charity-level donation summaries
- Donation count metrics
- Structured response for dashboard charts
- Transparent financial reporting architecture

This ensures donor confidence and platform accountability.

---

## Academic Significance

FundTrust demonstrates:

- RESTful API design
- MVC architecture
- Role-based authorization
- Secure authentication using JWT
- Third-party payment integration
- Database relationship modeling
- Data aggregation and analytics
- Scalable backend structure

It is designed as a full-stack MERN project suitable for university-level evaluation.

## API Endpoints Overview

# Authentication
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`

# Categories
- `GET /api/categories` (Public)
- `POST /api/categories` (Admin only)
- `PATCH /api/categories/:id` (Admin only)
- `DELETE /api/categories/:id` (Admin only)

# Charities
- `GET /api/charities` (Public)
- `GET /api/charities/admin/all` (Admin only)
- `GET /api/charities/:id` (Public)
- `POST /api/charities` (Admin only)
- `PATCH /api/charities/:id` (Admin only)
- `DELETE /api/charities/:id` (Admin only)
- `POST /api/charities/:id/update` (Admin only)
# Donations
- `GET /api/donations/stats` (Public)
- `GET /api/donations/transparency` (Public)
- `GET /api/donations/charity/:charityId` (Public)
- `POST /api/donations` (Authenticated)
- `POST /api/donations/:id/confirm` (Authenticated)
- `GET /api/donations/me` (Authenticated)
- `GET /api/donations/:id/receipt` (Authenticated)

# Feedback
- `GET /api/feedback/charity/:charityId` (Public)
- `GET /api/feedback/all` (Public)
- `GET /api/feedback/admin/all` (Admin only)
- `POST /api/feedback/charity/:charityId` (Authenticated)
- `DELETE /api/feedback/:id` (Authenticated)

# Users
- `GET /api/users/profile` (Authenticated)
- `GET /api/users/me` (Authenticated)
- `PATCH /api/users/me` (Authenticated)
- `GET /api/users/admin/all` (Admin only)
- `DELETE /api/users/admin/:id` (Admin only)
- `POST /api/users/admin/create` (Admin only)
- `PATCH /api/users/admin/:id/toggle-admin` (Admin only)

# Health
- `GET /api/health` (Public)

## Integration Testing
- Carried out using Postman

## Performance Testing 
- Carried out using Artillery

# Setup
# Install dependencies
```bash
cd server
npm install --save-dev artillery dotenv-cli
```

# Structure
server/
artillery/
load-test.yml
quick-test.yml
.env.test 

## Deployment

# Backend - Render
# Setup
- Push your code to GitHub
- Go to Render 
- Connect your GitHub repository
- Configure the service :
- Root Directory - `server`
- Runtime - `Node`
- Build Command - `npm install`
- Start Command - `npm start`

# env
`MONGO_URI` - MongoDB Atlas connection string
`JWT_SECRET`- Secret key for signing JWTs 
`PORT` - Server port (Render sets this automatically) 
`RESEND_API_KEY` - API key from resend.com for sending emails 
`STRIPE_SECRET_KEY` - Stripe secret key from Stripe dashboard 
`STRIPE_PUBLISHABLE_KEY` - Stripe publishable key 
`STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret 
`CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads 
`CLOUDINARY_API_KEY` - Cloudinary API key 
`CLOUDINARY_API_SECRET` - Cloudinary API secret

# Frontend - Vercel
# Setup
- Push your code to GitHub
- Go to Verel 
- Import your GitHub repository
- Configure the service :
- Root Directory - `client`
- Node.js version - `24.x`
- Build Command - `npm run build`
- Output directory - `dist`
- Install Command - `npm install`

# env
`VITE_API_URL` - URL of the deployed backend API
`VITE_STRIPE_PUBLISHABLE_KEY` - Stripe Publishable Key