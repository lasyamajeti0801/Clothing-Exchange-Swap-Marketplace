# REST API Documentation
## ReWear — Clothing Exchange & Swap Marketplace

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Priya Sharma",
    "email": "priya@rewear.org",
    "password": "Password@123",
    "confirmPassword": "Password@123",
    "city": "Hyderabad",
    "state": "Telangana"
  }
  ```
- **Response** `(201 Created)`: Returns `{ success: true, data: { user, token } }`

### Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "priya@rewear.org",
    "password": "Password@123"
  }
  ```
- **Response** `(200 OK)`: Returns `{ success: true, data: { user, token } }`

### Current User Profile
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** `(200 OK)`: Returns `{ success: true, data: { user } }`

---

## 2. Clothing Listings Endpoints

### List / Search Clothes
- **GET** `/clothes?search=Denim&category=Jackets&city=Hyderabad&sort=newest&page=1&limit=12`
- **Response** `(200 OK)`:
  ```json
  {
    "success": true,
    "data": {
      "items": [...],
      "pagination": { "total": 52, "page": 1, "totalPages": 5, "limit": 12 }
    }
  }
  ```

### Get Clothing Detail
- **GET** `/clothes/:id`
- **Response** `(200 OK)`: Returns `{ success: true, data: { item, isSaved, recommendations } }`

### Create Listing
- **POST** `/clothes`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Fields**: `title`, `brand`, `category`, `size`, `condition`, `material`, `purchaseAge`, `estimatedValue`, `description`, `images` (up to 5 files)

### Update Listing
- **PUT** `/clothes/:id`
- **Headers**: `Authorization: Bearer <token>`

### Delete Listing
- **DELETE** `/clothes/:id`
- **Headers**: `Authorization: Bearer <token>`

---

## 3. Swap Exchange Endpoints

### Create Swap Proposal
- **POST** `/swaps`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "offeredItemId": "<uuid>",
    "requestedItemId": "<uuid>",
    "message": "Would love to swap my jacket for your hoodie!",
    "exchangeMethod": "LOCAL_MEETUP"
  }
  ```

### Get User Swaps
- **GET** `/swaps?tab=incoming` (tabs: `incoming`, `outgoing`, `active`, `completed`, `rejected`, `all`)
- **Headers**: `Authorization: Bearer <token>`

### Update Swap Status
- **PUT** `/swaps/:id/status`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "status": "ACCEPTED"
  }
  ```

### Propose Counter-Offer
- **POST** `/swaps/:id/counter-offer`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "newOfferedItemId": "<uuid>",
    "note": "Proposing alternative item from my closet"
  }
  ```

### Confirm Exchange Readiness
- **POST** `/swaps/:id/ready`
- **Headers**: `Authorization: Bearer <token>`

---

## 4. Negotiation Chat Endpoints

### Get Messages
- **GET** `/chat/:swapId/messages`
- **Headers**: `Authorization: Bearer <token>`

### Send Message
- **POST** `/chat/:swapId/messages`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "content": "Can we meet Saturday at Inorbit Mall?"
  }
  ```

---

## 5. Valuation Engine Endpoints

### Calculate Valuation Benchmark
- **POST** `/valuation/estimate`
- **Body**:
  ```json
  {
    "category": "Jackets",
    "brand": "Levi's",
    "condition": "LIKE_NEW",
    "purchaseAge": "< 6 months",
    "material": "Denim"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "estimatedValue": 2400,
      "suggestedRange": { "min": 2100, "max": 2700 }
    }
  }
  ```

### Compare Swap Fairness
- **POST** `/valuation/compare`
- **Body**: `{ "offeredItem": { ... }, "requestedItem": { ... } }`

---

## 6. Admin Endpoints

- **GET** `/admin/dashboard`: Returns platform KPIs, Recharts data, and environmental diversion telemetry.
- **GET** `/admin/users`: Search, paginate, and list all users.
- **PUT** `/admin/users/:id/status`: Suspend or activate a user account.
- **GET** `/admin/listings`: Review all wardrobe listings and report flags.
- **PUT** `/admin/listings/:id/status`: Moderate or remove inappropriate listings.
