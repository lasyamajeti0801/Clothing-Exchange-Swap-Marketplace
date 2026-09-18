# ReWear — Clothing Exchange & Swap Marketplace
> **A sustainable fashion barter marketplace where users exchange wearable clothes directly with other users instead of buying and selling them.**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-sky.svg)](https://tailwindcss.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black.svg)](https://socket.io)

---

## 🌿 Project Vision & Core Principle
Fast fashion has accelerated textile waste and natural resource depletion. **ReWear** provides a cashless circular economy platform focused on:
$$\text{Reuse} \longrightarrow \text{Exchange} \longrightarrow \text{Reduce Waste} \longrightarrow \text{Sustainable Fashion}$$

This is an **exchange-first barter platform**, NOT a traditional e-commerce store:
- ❌ No "Add to Cart", checkout gateways, or online product payments.
- ✅ Direct swaps, offer counter-proposals, transparent valuation algorithms, peer negotiation chats, and neighborhood handovers.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
# In project root:
npm run install:all
```
*(Or run `npm install` inside both `server/` and `client/` directories.)*

### 2. Set Up Database & Seed Realistic Data
```bash
cd server
npm run db:setup
```
This generates the Prisma Client, creates the SQLite database, and populates:
- **21 Realistic Users** across Indian regional hubs (Hyderabad, Vijayawada, Mangalagiri, Guntur, Bengaluru, Mumbai, Delhi).
- **52 Clothing Items** with high-resolution fashion imagery across 14 categories.
- **32 Swap Proposals** spanning all workflow states.
- Pre-populated chat threads, reviews, wishlist items, and admin moderation reports.

### 3. Run Development Servers
Open two terminal windows:

**Terminal 1 (Backend API Server):**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Now open `http://localhost:5173` in your browser!

---

## 👥 Demo Accounts (1-Click Login Ready)

| Persona / Name | Email | Password | Role / Hub |
|---|---|---|---|
| **Priya Sharma** | `priya@rewear.org` | `Password@123` | Vintage Collector (Hyderabad) |
| **Rahul Verma** | `rahul@rewear.org` | `Password@123` | Streetwear & Denim (Vijayawada) |
| **Ananya Patel** | `ananya@rewear.org` | `Password@123` | Handloom Specialist (Mangalagiri) |
| **ReWear Admin** | `admin@rewear.org` | `Admin@123456` | Platform Administrator |

*Note: All 20 regular seeded users use the password `Password@123`.*

---

## ✨ Key Features & Architecture

### 1. Peer-to-Peer Clothing Barter & State Machine
- Strict server-enforced state transitions:
  `PENDING` → `NEGOTIATING` → `ACCEPTED` → `SHIPPING` / `READY_FOR_EXCHANGE` → `COMPLETED`.
- Also supports `REJECTED`, `CANCELLED`, and `DISPUTED`.
- Side-by-side interactive comparison: **Your Item ⇄ Their Item** with live value difference calculations.

### 2. Transparent Algorithmic Valuation Engine
- Computes fair trade estimates using:
  $$\text{Value} = \text{Category Base} \times \text{Brand Factor} \times \text{Condition Grade} \times \text{Purchase Age} \times \text{Material}$$
- Categorizes proposals into **Close Match**, **Moderate Difference**, and **Large Difference** to guide civil discussions.

### 3. Real-Time Negotiation Chat
- Powered by **Socket.IO** with automatic REST polling fallback.
- In-chat counter-offers (select a different item from your closet directly inside the negotiation thread).
- Real-time status updates and participant privacy guards.

### 4. Personal & Community Sustainability Tracker
- Quantifies circular impact based on completed trades:
  - Estimated garments diverted from landfills.
  - Liters of freshwater conserved ($1\text{ garment} \approx 2,700\text{L}$).
  - Kilograms of $\text{CO}_2$ emissions avoided ($1\text{ garment} \approx 2.5\text{kg}$).

### 5. Admin Moderation & Analytics Console (`/admin`)
- Real-time KPI counters (Total Users, Active Listings, Completed Swaps, Pending Disputes).
- Recharts category distribution visualizations.
- Full Swapper management (search, suspend/activate).
- Wardrobe moderation and dispute resolution.

---

## 🧪 Automated Testing

Run the test suite from the `server/` directory:
```bash
cd server
npm test
```
- **13 automated tests** covering valuation calculations, swap fairness logic, state machine transitions, participant role guards, and REST API endpoints.

---

## 📚 Complete Documentation

- [`PRD.md`](./docs/PRD.md) — Product Requirements Document & User Personas.
- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — System Architecture, Component Flow & State Guards.
- [`API_DOCUMENTATION.md`](./docs/API_DOCUMENTATION.md) — Complete REST API Catalog & Request/Response Samples.
- [`DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) — Prisma Entity Models, Relationships & Indexes.
- [`SECURITY.md`](./docs/SECURITY.md) — Authentication, Data Isolation & Privacy Safeguards.
- [`TESTING.md`](./docs/TESTING.md) — Automated Test Suite & Acceptance Verification Runbook.
- [`DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Production Deployment to Vercel, Render, Supabase, and Docker.
