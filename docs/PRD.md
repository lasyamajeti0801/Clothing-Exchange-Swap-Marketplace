# Product Requirements Document (PRD)
## ReWear — Clothing Exchange & Swap Marketplace

---

## 1. Problem Statement
Fast fashion consumption has exploded globally, resulting in massive textile waste, depleted water tables, and immense carbon footprints. Millions of individuals possess wearable, high-quality garments that they have outgrown, no longer wear, or wish to replace. However:
- Resale platforms enforce steep commission cuts, complex shipping fees, and price bargaining.
- Traditional donation chains frequently result in clothes ending up in landfills overseas.
- Online peer-to-peer bartering platforms lack structured valuation benchmarks, leading to mismatched expectations and negotiation deadlocks.

**ReWear** solves this by establishing a dedicated, zero-cash barter marketplace where clothing is exchanged peer-to-peer through verified swaps, transparent valuation algorithms, and localized community handovers.

---

## 2. Objectives & Principles
- **Core Principle**: Swap, Offer, Negotiate, Match, Accept, Complete. **100% Cashless in Phase 1.**
- **Environmental Impact**: Divert wearable textiles from landfills while saving estimated freshwater and carbon emissions with each completed trade.
- **Fairness & Transparency**: Transparent rule-based valuation suggestions to ensure both parties negotiate with mutual confidence.
- **Privacy & Trust**: Neighborhood-level location matching without exposing exact residential addresses.

---

## 3. User Personas
### Persona 1: The Mindful Vintage Enthusiast (e.g., Priya Sharma)
- **Goal**: Trade retro denim jackets, corduroys, and curated indie pieces with fellow fashion lovers.
- **Needs**: High-resolution image galleries, accurate condition tags, and in-chat negotiation.

### Persona 2: The Sustainable Student / Streetwear Swapper (e.g., Rahul Verma)
- **Goal**: Refresh wardrobe of oversized hoodies, graphic tees, and sneakers without buying virgin fast-fashion.
- **Needs**: Local city hub meetups (Vijayawada, Hyderabad), instant mobile browsing, and fast proposal workflows.

### Persona 3: The Handloom & Heritage Advocate (e.g., Ananya Patel)
- **Goal**: Exchange authentic Mangalagiri handloom sarees, Chanderi kurtas, and organic cottons.
- **Needs**: Material specification filters, verified user ratings, and courier shipping support.

---

## 4. Complete User Journey (Lifecycle)
```
1. Registration & Wardrobe Setup
   User creates account -> sets city hub -> uploads clothing items with photos & condition.
   
2. Discovery & Match Finding
   User explores marketplace -> filters by size/city/condition -> inspects item detail & valuation range.

3. Proposal & Algorithmic Comparison
   User clicks "Request Swap" -> picks own item from closet -> system displays side-by-side value comparison.

4. Negotiation & Counter-Offers
   Recipient receives notification -> enters dedicated chat -> discusses meetup or proposes alternative item.

5. Acceptance & Handover
   Both parties agree -> choose Local Meetup or Shipping -> mark exchange ready -> exchange garments.

6. Completion & Reputation
   Swap is marked COMPLETED -> environmental statistics update -> mutual reviews are recorded.
```

---

## 5. Functional Requirements
1. **Authentication & Identity**: JWT-based session management, bcrypt password hashing, secure profile management.
2. **Wardrobe Management**: Multi-image uploads, category/brand/material tagging, automated valuation estimation with override.
3. **Marketplace Discovery**: Debounced full-text search, multi-faceted filtering (category, condition, size, brand, value range, city), sorting, pagination.
4. **Swap Request Engine**: Multi-state transition machine (`PENDING`, `NEGOTIATING`, `ACCEPTED`, `SHIPPING`, `READY_FOR_EXCHANGE`, `COMPLETED`, `REJECTED`, `CANCELLED`, `DISPUTED`).
5. **Negotiation Chat**: Socket.IO real-time communication, persistent history, in-chat counter-offers, participant authorization guards.
6. **Valuation Engine**: Rule-based calculation factoring category base rates, brand multipliers, condition grades, and material bonuses.
7. **Reputation & Safety**: 1-5 star review system with comments, listing report mechanisms, and administrative dispute resolution.
8. **Admin Operations**: User moderation, listing status management, platform-wide analytics, and environmental diversion telemetry.

---

## 6. Key Performance Indicators (KPIs)
- **Completed Swaps**: Primary indicator of circular platform velocity.
- **Garments Kept in Circulation**: Metric calculating direct textile diversion.
- **Freshwater & CO2 Avoided**: Algorithmic telemetry ($1\text{ garment} \approx 2,700\text{L water}, 2.5\text{kg CO}_2$).
- **Negotiation Conversion Rate**: Percentage of `PENDING` proposals advancing to `COMPLETED`.
