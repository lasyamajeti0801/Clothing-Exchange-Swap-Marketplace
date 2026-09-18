# Testing Documentation & Verification Suite
## ReWear — Clothing Exchange & Swap Marketplace

---

## 1. Automated Test Architecture

ReWear utilizes **Vitest** for fast, isolated unit and integration testing of the valuation engine, swap state machine, and REST API controllers.

### Running Backend Tests
From the root or `server/` directory:
```bash
cd server
npm test
```

### Test Coverage Summary
1. **Valuation Engine (`tests/swap.test.js`)**:
   - Algorithmic calculation of garment swap value with brand and condition multipliers.
   - Suggested fair trade price range estimation ($\pm 12\%$).
   - Fairness categorization (`Close Match`, `Moderate Difference`, `Large Difference`).
2. **Swap State Machine (`tests/swap.test.js`)**:
   - Enforces valid transition paths (`PENDING` → `NEGOTIATING` → `ACCEPTED` → `READY_FOR_EXCHANGE` → `COMPLETED`).
   - Rejects illegal state jumps (e.g. `COMPLETED` → `PENDING`, `REJECTED` → `ACCEPTED`).
   - Enforces role-based caller validation (e.g. receiver vs. sender vs. admin).
3. **REST API Endpoints (`tests/api.test.js`)**:
   - `GET /api/health` system liveness check.
   - `GET /api/clothes` pagination, search queries, and filtering.
   - `POST /api/valuation/estimate` algorithmic calculation endpoint.
   - `POST /api/auth/login` credential validation and JWT token issuance.
   - Admin route 401 unauthenticated protection.

---

## 2. End-to-End User Acceptance Test (Manual Verification)

Following the specification in **Section 53** of the Master Prompt:

### Step 1: User A (Priya Sharma)
- Navigate to `http://localhost:5173/login` -> Select "Priya" one-click chip -> Log in.
- Navigate to `/clothes` -> View existing listed items (e.g. Levi's Sherpa Trucker Jacket).
- View `/dashboard` -> Verify wardrobe items, swap count, and sustainability statistics.

### Step 2: User B (Rahul Verma)
- Open in an incognito window or log out and log in as "Rahul Verma" (`rahul@rewear.org`).
- Browse clothes at `/clothes` -> Open Priya's Levi's Jacket detail page.
- Click **Request Swap** -> Select own H&M Oversized Hoodie from closet.
- Verify side-by-side display:
  - Your Garment: H&M Hoodie (₹1,350)
  - Requested Garment: Levi's Jacket (₹2,400)
  - Difference & fairness indicator displayed.
- Submit proposal note -> Receives success confirmation.

### Step 3: User A Receives Proposal & Negotiates
- Switch back to Priya's session -> Notice notification badge update at `/notifications`.
- Open `/swaps?tab=incoming` -> See incoming proposal from Rahul Verma.
- Click **Open Negotiation Chat** (`/chat/:swapId`) -> Discuss handover terms.
- Click **Accept Terms** -> Status advances to `ACCEPTED`.

### Step 4: Handover & Completion
- Choose "Local Meetup" -> Click **Confirm & Complete Handover**.
- When both users mark ready -> Status advances to `COMPLETED`.
- Both users' swap counts increment and environmental counters update.
- Priya clicks **Leave Partner Review** -> Submits a 5-star rating with comment.

### Step 5: Admin Moderation
- Log in as `admin@rewear.org` (`Admin@123456`).
- Navigate to `/admin` -> Review real-time KPIs and Recharts category charts.
- Inspect Swapper management list and test suspension toggle.
- Review wardrobe listings and test moderation controls.
