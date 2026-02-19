# FundTrust

FundTrust is a full-stack donation tracking web application designed to build transparency and trust between donors and non-governmental organizations (NGOs). The platform enables categorized charity management, secure Stripe-powered donations, and real-time impact tracking through a transparency dashboard.

FundTrust ensures that every donation is securely processed, properly categorized, and transparently reported.

---

## Project Overview

FundTrust connects donors with verified charities and provides visibility into how funds are allocated. The system supports both one-time and recurring donations, tracks impact metrics, and enforces role-based access control for secure administration.

---

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
- Recurring donations via Stripe Checkout
- Simulation mode when Stripe key is not configured
- Donation receipts with impact notes
- Donation history tracking per user

### Transparency & Impact Tracking
- Aggregated donation summaries
- Total funds per charity
- Donation count metrics
- Structured data for dashboard visualization
- MongoDB aggregation pipeline for analytics

---

## Project Structure

```
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
```

---

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

---

## Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Stripe account (Test keys)

---

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

---

##  API Endpoints Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Categories
- `GET /api/categories` (Public)
- `POST /api/categories` (Admin only)
- `PUT /api/categories/:id` (Admin only)
- `DELETE /api/categories/:id` (Admin only)

### Charities
- `GET /api/charities`
- `POST /api/charities` (Admin only)

### Donations
- `POST /api/donations/one-time`
- `POST /api/donations/recurring`
- `GET /api/donations/transparency`
- `GET /api/donations/me`

---

##  Stripe Integration

FundTrust supports:

- Secure payment processing via Stripe
- One-time donations using PaymentIntent
- Recurring donations via subscription Checkout
- Simulation mode if Stripe secret key is not configured

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

---

##  Future Improvements

- Stripe webhook integration
- Admin dashboard UI
- Category-level analytics visualization
- Email receipt notifications
- Docker containerization
- Automated API and UI testing

---

##  Project Vision

FundTrust aims to create a reliable and transparent digital ecosystem where donors can confidently contribute to social causes, knowing exactly how their funds are managed and utilized.

---

**FundTrust — Building Trust Through Transparent Funding.**
