
# ReWear — Clothing Exchange & Swap Marketplace

A sustainable fashion barter marketplace where users exchange wearable clothes directly with other users instead of buying and selling them.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-sky.svg)](https://tailwindcss.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black.svg)](https://socket.io)

---

## 🌿 Project Overview

ReWear is a sustainable fashion exchange platform designed to encourage clothing reuse and reduce textile waste.

Fast fashion has accelerated textile waste and natural resource depletion. ReWear promotes a circular economy by enabling users to exchange wearable clothing directly with one another.

The platform follows an **exchange-first barter model**, rather than a traditional e-commerce approach.

### Core Principles

- No traditional shopping cart or checkout system.
- No online product purchasing.
- Direct clothing swaps between users.
- Transparent clothing valuation.
- Offer and counter-proposal functionality.
- Peer-to-peer negotiation.
- Community-based clothing exchange.

**Reuse → Exchange → Reduce Waste → Sustainable Fashion**

---

## 🎯 Project Objectives

- Encourage sustainable fashion practices.
- Reduce clothing waste through reuse.
- Enable direct peer-to-peer clothing exchanges.
- Provide transparent clothing valuation.
- Support secure communication between users.
- Build a community-driven circular fashion marketplace.

---

## 🚀 Key Features

### 1. User Authentication and Management

- User registration and login.
- Secure authentication.
- User profile management.
- Role-based access control.
- Admin account management.

### 2. Clothing Listings

- Create clothing listings.
- Browse available clothing.
- View detailed clothing information.
- Edit and manage personal listings.
- Upload clothing images.
- Organize clothing by categories.

### 3. Peer-to-Peer Clothing Barter

- Exchange clothing items directly.
- Send swap proposals.
- Submit counter-offers.
- Compare items side by side.
- Calculate estimated value differences.
- Track swap progress.

### 4. Swap Workflow Management

The platform supports server-enforced swap state transitions:

PENDING → NEGOTIATING → ACCEPTED → SHIPPING / READY_FOR_EXCHANGE → COMPLETED

Additional states include:

- REJECTED
- CANCELLED
- DISPUTED

### 5. Transparent Algorithmic Valuation

The platform estimates clothing value using factors such as:

- Clothing category.
- Brand.
- Condition.
- Purchase age.
- Material.

The valuation engine categorizes proposals into:

- Close Match
- Moderate Difference
- Large Difference

These estimates help users make informed exchange decisions.

### 6. Real-Time Negotiation Chat

- Real-time communication using Socket.IO.
- REST polling fallback.
- In-chat counter-offers.
- Swap-related discussions.
- Real-time status updates.
- Participant privacy controls.

### 7. Wishlist and Saved Items

- Save preferred clothing items.
- Manage wishlist items.
- Quickly revisit interesting listings.

### 8. Reviews and Ratings

- Submit reviews after completed exchanges.
- Share user experiences.
- Support trust within the marketplace.

### 9. Sustainability Impact Tracker

The platform estimates environmental impact based on completed trades, including:

- Garments diverted from potential landfill disposal.
- Estimated freshwater conservation.
- Estimated carbon emissions avoided.

### 10. Admin Dashboard

The admin console provides:

- Total user statistics.
- Active listing statistics.
- Completed swap statistics.
- Pending dispute tracking.
- Clothing category visualizations.
- User management.
- User suspension and activation.
- Listing moderation.
- Dispute resolution.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Tailwind CSS
- Vite
- JavaScript

### Backend

- Node.js
- Express.js
- Socket.IO

### Database

- SQLite
- Prisma ORM

### Development and Deployment Tools

- Git
- GitHub
- Docker
- Docker Compose
- npm

---

## 🏗️ System Architecture

ReWear follows a full-stack architecture consisting of:

1. React frontend for user interaction.
2. Node.js and Express backend for business logic.
3. Prisma ORM for database operations.
4. SQLite database for data persistence.
5. Socket.IO for real-time communication.
6. Authentication and authorization middleware.
7. Admin dashboard for moderation and analytics.

---

## 📂 Project Structure

```text
ReWear/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── index.js
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
│
├── tests/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

- Node.js v18 or higher.
- npm v9 or higher.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/lasyamajeti0801/Clothing-Exchange-Swap-Marketplace.git
```

Navigate into the project:

```bash
cd Clothing-Exchange-Swap-Marketplace
```

### 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

Alternatively, install dependencies separately:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure Environment Variables

Create the required environment files based on the provided environment templates.

Do not commit real secrets, passwords, API keys, or production credentials.

### 4. Set Up the Database

Navigate to the server directory:

```bash
cd server
npm run db:setup
```

This command generates the Prisma Client, creates the SQLite database, and seeds development data if configured by the project.

### 5. Start the Backend Server

Open a terminal:

```bash
cd server
npm run dev
```

Backend server:

```text
http://localhost:5000
```

### 6. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## 👥 Demo Accounts

The following accounts are intended for local development and demonstration, provided they exist in your seeded database.

| Persona | Email | Role |
|---|---|---|
| Priya Sharma | priya@rewear.org | Regular User |
| Rahul Verma | rahul@rewear.org | Regular User |
| Ananya Patel | ananya@rewear.org | Regular User |
| ReWear Admin | admin@rewear.org | Administrator |

**Note:** Demo credentials should only be used in local development environments. Never use development passwords in production.

---

## 🧪 Automated Testing

Run the test suite from the server directory:

```bash
cd server
npm test
```

The project includes automated tests covering areas such as:

- Valuation calculations.
- Swap fairness logic.
- State machine transitions.
- Participant authorization.
- REST API endpoints.

Refer to the testing documentation for detailed test coverage.

---

## 📚 Documentation

Detailed project documentation is available in the `docs/` directory.

| Document | Description |
|---|---|
| [PRD](./docs/PRD.md) | Product Requirements Document and User Personas |
| [Architecture](./docs/ARCHITECTURE.md) | System Architecture and Component Flow |
| [API Documentation](./docs/API_DOCUMENTATION.md) | REST API Catalog and Request/Response Samples |
| [Database Schema](./docs/DATABASE_SCHEMA.md) | Prisma Models, Relationships and Indexes |
| [Security](./docs/SECURITY.md) | Authentication, Data Isolation and Privacy |
| [Testing](./docs/TESTING.md) | Automated Test Suite and Verification |
| [Deployment](./docs/DEPLOYMENT.md) | Production Deployment and Infrastructure |

---

## 🔐 Security Considerations

- Authentication and authorization controls.
- Role-based access management.
- Protected API endpoints.
- User data isolation.
- Input validation.
- Secure environment variable handling.
- Privacy-aware communication features.

Refer to [SECURITY.md](./docs/SECURITY.md) for additional details.

---

## 🌍 Sustainability Impact

ReWear aims to support sustainable fashion by making clothing exchange accessible and convenient.

By encouraging users to reuse existing garments, the platform promotes:

- Reduced textile waste.
- Extended clothing lifecycles.
- Community participation.
- Circular fashion practices.

Environmental impact estimates are illustrative and depend on the assumptions used by the application.

---

## 🔮 Future Enhancements

Potential future improvements include:

- AI-powered clothing recommendations.
- Image-based clothing categorization.
- Advanced sustainability analytics.
- Location-based exchange discovery.
- Mobile application support.
- Enhanced fraud detection.
- Multi-language support.

---

## 👩‍💻 Author

**Mounika Lasya Majeti**

GitHub: [@lasyamajeti0801](https://github.com/lasyamajeti0801)

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

Add an appropriate open-source license if you decide to distribute the project under one.