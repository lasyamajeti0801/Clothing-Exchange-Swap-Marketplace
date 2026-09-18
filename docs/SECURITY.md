# Security Architecture & Policies
## ReWear — Clothing Exchange & Swap Marketplace

---

## 1. Authentication & Session Management
- **Password Hashing**: Stored using `bcryptjs` with salt work factor 10. Plaintext passwords are never logged or stored.
- **JWT Protection**: Signed using `HS256` with strong 256-bit entropy secrets (`JWT_SECRET`). Tokens expire in 7 days.
- **Header Transmission**: Tokens are transmitted via the standard `Authorization: Bearer <token>` header and validated per route via `authMiddleware`.
- **Role Verification**: Admin routes enforce strict `ADMIN` role checks on the server (`adminMiddleware`). The backend never trusts client-side role claims.

---

## 2. Authorization & Data Isolation
- **Resource Ownership**: Users can modify or delete only their own wardrobe listings (`clothingItem.ownerId === req.user.id`).
- **Swap & Chat Isolation**: Only participants in a swap proposal (`senderId` or `receiverId`) or an authorized administrator can view swap negotiation messages or trigger status transitions.
- **Suspension Enforcement**: Suspended users are immediately denied access across all protected endpoints upon authentication verification.

---

## 3. Privacy-First Location Design
- **No Street Address Exposure**: Exact residential street addresses or house numbers are never stored in public listing models.
- **Hub Proximity**: Only city/regional hub (e.g. Hyderabad, Vijayawada, Mangalagiri, Guntur) is displayed to prevent stalking or physical privacy breaches.
- **In-Person Exchange Safety**: Direct local meetups are advised to take place in well-lit public community areas (malls, metro stations, campus hubs).

---

## 4. Input Sanitization & Attack Mitigation
- **SQL Injection**: Prevented via parameterized queries enforced strictly by the Prisma ORM.
- **Cross-Site Scripting (XSS)**: React inherently escapes dynamic string expressions during JSX rendering.
- **HTTP Headers**: Helmet middleware secures headers against clickjacking (`X-Frame-Options`), MIME sniffing (`X-Content-Type-Options`), and cross-origin resource isolation.
- **Rate Limiting**: `express-rate-limit` throttles requests to 300 per 15 minutes per IP to guard against denial-of-service and credential brute-forcing.
- **File Upload Protection**: Multer limits image uploads strictly to JPEG, PNG, and WebP formats with a 5MB per file maximum size restriction.
