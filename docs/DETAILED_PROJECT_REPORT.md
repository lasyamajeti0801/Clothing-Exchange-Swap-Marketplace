# Detailed Project Report: ReWear — Sustainable Clothing Exchange & Swap Marketplace

---

## 1. Project Title & Abstract

### Project Title
**ReWear — Sustainable Clothing Exchange & Barter Marketplace**

### Abstract
Fast fashion and rapid textile consumption have driven massive volumes of wearable garments into landfills, generating vast amounts of carbon emissions and consuming billions of liters of freshwater annually. **ReWear** is a dedicated, production-ready, zero-cash barter marketplace where users exchange wearable clothing directly with other community members instead of buying and selling. Built upon a modern decoupled stack (React 18, Node.js, Express, Prisma ORM, Socket.IO, and Tailwind CSS), ReWear eliminates traditional e-commerce cart/checkout mechanics in favor of a verified barter workflow: **List → Discover → Propose → Negotiate → Exchange → Complete**. The platform features a transparent, rule-based valuation benchmark to facilitate equitable negotiations, real-time negotiation chat with in-chat counter-offers, proximity-based location discovery without exposing residential addresses, personal sustainability impact telemetry, and a complete role-based administrative moderation console.

---

## 2. Problem Statement & Motivation

### The Problem
- Over 92 million tons of textile waste are generated globally each year, with 85% ending up in landfills or incinerators.
- Producing a single cotton garment consumes approximately 2,700 liters of freshwater and generates ~2.5 kg of greenhouse emissions.
- Existing resale marketplaces enforce steep commission cuts, shipping delays, and price bargaining, discouraging users from passing on gently worn garments.
- Traditional donation ecosystems often lack transparency, with significant proportions of donated clothing discarded.
- Existing barter platforms lack objective valuation metrics, resulting in negotiation friction and inequitable trades.

### Project Objective
To establish a circular fashion exchange platform that:
1. Enables 100% cashless, peer-to-peer wardrobe bartering.
2. Formulates a transparent, non-binding valuation benchmark for trade fairness.
3. Facilitates real-time negotiations and handover logistics (local meetup or courier).
4. Quantifies environmental diversion metrics (garments kept in circulation, water conserved, CO2 prevented) in real-time.
5. Provides full administrative moderation and dispute resolution tools.

---

## 3. Technology Stack & Architecture

### Frontend
- **Framework**: React.js (v18) with Vite
- **Styling**: Tailwind CSS with custom natural/sustainable palette (Forest Green `#1E3A2F`, Sage `#8FA89B`, Terracotta `#C26D54`, Warm Off-White `#FAF8F5`)
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6) with Protected and Role-Based Admin Routes
- **HTTP Client**: Axios with automatic JWT interceptors
- **Real-Time Client**: Socket.IO Client
- **Data Visualization**: Recharts (bar and category distribution charts)

### Backend
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js REST API
- **Real-Time Engine**: Socket.IO for live peer messaging, counter-offers, and status notifications
- **Database & ORM**: Prisma ORM with SQLite for zero-setup development and native PostgreSQL cloud support
- **Authentication**: Stateless JSON Web Tokens (JWT) & bcrypt password hashing
- **Security**: Helmet, CORS, Express-Rate-Limit, and Multer file type validation

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (Vite + React)            │
│   Landing · Browse · Detail · List · Swaps · Chat · Admin   │
└──────────────┬───────────────────────────────▲──────────────┘
               │ HTTP REST                     │ WebSocket Events
               ▼                               │ (Socket.IO)
┌──────────────────────────────────────────────┴──────────────┐
│                    Express.js Backend API                    │
│   Auth · Clothes · Swaps · Chat · Valuation · Admin Routes  │
└──────────────┬──────────────────────────────────────────────┘
               │ Prisma ORM
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer (Prisma)                 │
│      User · ClothingItem · SwapRequest · Message · Review   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Key Functional Modules

### 4.1 Exchange-First Barter Workflow
Unlike traditional e-commerce platforms, ReWear has no "Buy Now", "Add to Cart", or payment gateways. The primary user flow is centered around direct barter:
- A user viewing an item clicks **Request Swap**.
- The modal opens an interactive side-by-side view: **Your Offered Item ⇄ Their Requested Item**.
- The user selects an eligible garment from their own active wardrobe.
- The system computes the value difference in real-time and provides a fairness label.
- The proposal transitions through a verified state machine.

### 4.2 Algorithmic Valuation & Fairness Engine
To solve negotiation deadlock, ReWear provides a transparent rule-based valuation model:
$$\text{Estimated Value} = \text{Base Category Value} \times F_{\text{brand}} \times F_{\text{condition}} \times F_{\text{age}} \times F_{\text{material}}$$
- **Category Base Values**: Jackets (₹2,200), Handloom Sarees (₹2,500), Kurtas (₹1,100), Hoodies (₹1,400), Jeans (₹1,500).
- **Brand Multipliers**: Premium/Designer (1.20x–1.50x), Contemporary High Street (1.0x–1.15x), Value Brands (0.80x–0.95x).
- **Condition Multipliers**: New with Tags (1.0x), Like New (0.85x), Excellent (0.72x), Good (0.58x), Fair (0.42x).
- **Fairness Classification**:
  - **Close Match**: Difference $\le 15\%$
  - **Moderate Difference**: Difference $16\% - 35\%$
  - **Large Difference**: Difference $> 35\%$

### 4.3 Swap Request State Machine
State transitions are validated strictly on the backend:
- `PENDING`: Initial swap proposal sent to listing owner.
- `NEGOTIATING`: In-chat negotiation or counter-offer initiated.
- `ACCEPTED`: Recipient accepts offer terms.
- `READY_FOR_EXCHANGE` / `SHIPPING`: Delivery method selected (Local Meetup or Courier).
- `COMPLETED`: Both parties confirm handover; items marked `SWAPPED`, user swap counts incremented.
- Terminals: `REJECTED`, `CANCELLED`, `DISPUTED`.

### 4.4 Real-Time Negotiation Chat
- WebSocket-powered chat with persistent message history and read receipts.
- Interactive **In-Chat Counter-Offer**: Users can propose an alternative garment from their wardrobe directly inside the chat thread without restarting the swap.
- Side-by-side garment context panel always visible beside the chat window.

### 4.5 Location Proximity & Privacy
- Regional cluster discovery across cities: Hyderabad, Vijayawada, Mangalagiri, Guntur, Bengaluru, Mumbai, Delhi.
- Approximate locality matching without exposing exact residential addresses.

### 4.6 Personal & Community Sustainability Tracker
- Quantifies circular fashion metrics:
  - Estimated garments diverted from landfills.
  - Freshwater conserved ($1\text{ garment} \approx 2,700\text{ Liters}$).
  - Carbon emissions avoided ($1\text{ garment} \approx 2.5\text{ kg CO}_2$).

### 4.7 Role-Based Admin Moderation Console (`/admin`)
- Accessible only to accounts with the `ADMIN` role.
- Real-time KPIs (Total Users, Active Listings, Completed Swaps, Pending Disputes).
- Recharts category and activity analytics.
- User management (search, view, suspend/activate).
- Wardrobe moderation (remove inappropriate items, restore listings).
- Dispute and report resolution workflow.

---

## 5. Database Schema & Entities

- **`User`**: Account credentials, profile bio, city/state hub, rating, swap count, suspension status.
- **`ClothingItem`**: Title, category, brand, size, color, material, condition, estimated value, original price, status (`ACTIVE`, `PENDING_SWAP`, `SWAPPED`, `ARCHIVED`), owner relation.
- **`ClothingImage`**: Multi-image storage with primary cover order.
- **`SwapRequest`**: Sender, receiver, offered item, requested item, status, exchange method, readiness flags.
- **`Message`**: Swap thread ID, sender ID, content, message type (`TEXT`, `OFFER_MODIFIED`, `STATUS_CHANGE`), read receipt.
- **`SavedItem`**: Wishlist bookmarking mechanism.
- **`Notification`**: Real-time proposal, message, and status notifications.
- **`Review`**: Mutual 1-5 star ratings and comments submitted post-exchange.
- **`Report`**: Listing and user moderation complaints with dispute resolution notes.

---

## 6. Testing & Quality Assurance

- **Unit & State Machine Tests (`tests/swap.test.js`)**:
  - Validates valuation calculation rules across brands and condition tiers.
  - Validates swap state machine transitions and rejects illegal status modifications.
  - Enforces role-based caller authorization guards.
- **REST API Integration Tests (`tests/api.test.js`)**:
  - Verifies `/api/health`, search & pagination, login authentication, and admin route protection.
- **Production Build**: Clean compilation with Vite (`npm run build` exits 0 with zero bundle errors).

---

## 7. Conclusion & Learnings
Building ReWear demonstrated how to design an exchange-first circular economy system. Key technical takeaways include:
1. Strict server-side state machines are essential to prevent race conditions during peer-to-peer item swapping.
2. Integrating transparent valuation benchmarks significantly reduces bargaining friction.
3. Decoupling WebSockets with automatic REST polling fallbacks ensures 100% messaging reliability across unstable network connections.
4. Privacy-by-design principles can protect community members' safety while maintaining rich local barter connectivity.
