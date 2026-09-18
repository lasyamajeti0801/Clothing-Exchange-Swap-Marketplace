# System Architecture Documentation
## ReWear — Clothing Exchange & Swap Marketplace

---

## 1. System Overview

ReWear is architected as a modern, decoupled full-stack web application designed for high responsiveness, real-time peer negotiation, and strict data consistency.

```
┌─────────────────────────────────────────────────────────────┐
│                       React 18 Client                       │
│    Vite · Tailwind CSS · React Router · Lucide · Recharts    │
└──────────────┬───────────────────────────────▲──────────────┘
               │ HTTP REST Requests            │ WebSocket Events
               ▼                               │ (Socket.IO)
┌──────────────────────────────────────────────┴──────────────┐
│                    Express.js Backend API                    │
│     Helmet · Rate Limiting · JWT Auth · Multer · Socket.IO  │
└──────────────┬──────────────────────────────────────────────┘
               │ Prisma ORM
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                         │
│       SQLite (Local Dev & Tests) / PostgreSQL (Cloud)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
rewear/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Modals, Badges, Cards)
│   │   ├── context/            # AuthContext, NotificationContext, SocketContext
│   │   ├── pages/              # 12+ Connected Application Pages
│   │   ├── services/           # Axios API Client & Endpoints
│   │   └── index.css           # Tailwind Design System & Custom Themes
│   ├── vite.config.js          # Proxy configuration for API & WebSockets
│   └── package.json
│
├── server/                     # Backend Application
│   ├── prisma/
│   │   ├── schema.prisma       # Normalized Database Entities & Relations
│   │   └── seed.js             # Realistic Seed Script (20+ Users, 50+ Listings)
│   ├── src/
│   │   ├── controllers/        # REST Route Controllers
│   │   ├── middleware/         # Auth, Admin, Uploads, Error Handling
│   │   ├── routes/             # Express API Route Definitions
│   │   ├── services/           # Valuation Engine, Swap State Machine
│   │   ├── socket.js           # Socket.IO Real-Time Server
│   │   └── app.js              # Express Application Assembly
│   └── vitest.config.js        # Test Runner Configuration
│
├── tests/                      # Automated Unit & Integration Tests
└── docs/                       # Comprehensive Engineering Documentation
```

---

## 3. Swap State Machine

The core swap exchange workflow is strictly enforced on the server:

```
                  ┌─────────┐
                  │ PENDING │
                  └───┬───┬─┘
         Accept /     │   │     \ Reject /
     Negotiate        │   │        Cancel
                      ▼   ▼
               ┌─────────────┐
               │ NEGOTIATING │
               └──────┬──────┘
                      │ Accept
                      ▼
               ┌─────────────┐
               │  ACCEPTED   │
               └──────┬──────┘
       Local Meetup / │   │ Courier
                      ▼   ▼
         ┌──────────────────────┐
         │ READY_FOR_EXCHANGE / │
         │       SHIPPING       │
         └──────────┬───────────┘
                    │ Both Parties Confirm Handover
                    ▼
               ┌───────────┐
               │ COMPLETED │
               └─────┬─────┘
                     │
                     ▼
           [ Reviews & Reputation ]
```

### State Guard Table
| Transition | Allowed Caller | Prerequisites |
|---|---|---|
| `PENDING` → `ACCEPTED` | Receiver only | Both items in `ACTIVE` state |
| `PENDING` → `NEGOTIATING` | Sender or Receiver | Valid counter-offer or chat modification |
| `PENDING` → `REJECTED` | Receiver only | Returns items to active pool |
| `PENDING` → `CANCELLED` | Sender only | Returns items to active pool |
| `ACCEPTED` → `READY_FOR_EXCHANGE` | Either participant | Exchange method is `LOCAL_MEETUP` |
| `ACCEPTED` → `SHIPPING` | Either participant | Courier details or tracking provided |
| `READY_FOR_EXCHANGE` → `COMPLETED` | Both participants confirm | Sets `completedAt`, marks items `SWAPPED` |
| Any Active State → `DISPUTED` | Either participant | Opens moderation dispute case |

---

## 4. Valuation Engine Algorithmic Formula

$$\text{Estimated Value} = \text{Base Category Rate} \times F_{\text{brand}} \times F_{\text{condition}} \times F_{\text{age}} \times F_{\text{material}}$$

- **Base Rates**: Jackets (₹2,200), Handloom Sarees (₹2,500), Kurtas (₹1,100), Hoodies (₹1,400), Jeans (₹1,500).
- **Brand Multipliers**: Designer/Premium (1.30x–1.50x), Contemporary High-Street (1.0x–1.20x), Everyday (0.85x–0.95x).
- **Condition Multipliers**: New with Tags (1.0x), Like New (0.85x), Excellent (0.72x), Good (0.58x), Fair (0.42x).
- **Fairness Classification**:
  - **Close Match**: Value gap $\le 15\%$
  - **Moderate Difference**: Value gap between $16\%$ and $35\%$
  - **Large Difference**: Value gap $> 35\%$
