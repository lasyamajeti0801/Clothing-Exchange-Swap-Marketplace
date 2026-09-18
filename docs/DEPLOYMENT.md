# Production Deployment Guide
## ReWear — Clothing Exchange & Swap Marketplace

This guide outlines deployment configurations for cloud environments (Vercel, Render/Railway, Supabase/Neon, and Cloudinary).

---

## 1. Cloud Database Setup (PostgreSQL)
For production, use a managed cloud PostgreSQL instance (Neon, Supabase, or AWS RDS):

1. Create a database named `rewear_prod`.
2. Retrieve the connection string:
   ```
   DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/rewear_prod?sslmode=require"
   ```
3. In `server/prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Push migrations to the database:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

---

## 2. Backend Deployment (Render or Railway)
1. Link your GitHub repository to Render / Railway.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install && npx prisma generate`
4. Set Start Command: `node src/index.js`
5. Configure Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `<Your PostgreSQL Connection String>`
   - `JWT_SECRET`: `<Generate a random 64-char string>`
   - `CLIENT_URL`: `https://rewear.vercel.app`
   - `CLOUDINARY_CLOUD_NAME`: `<optional>`
   - `CLOUDINARY_API_KEY`: `<optional>`
   - `CLOUDINARY_API_SECRET`: `<optional>`

---

## 3. Frontend Deployment (Vercel)
1. Import the project repository on Vercel.
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: `https://rewear-api.onrender.com`

---

## 4. Docker Deployment
A pre-configured `docker-compose.yml` is provided at the repository root:
```bash
docker-compose up --build -d
```
This automatically launches:
- PostgreSQL 16 on port `5432`
- ReWear Express API Server on port `5000`
- ReWear Frontend on port `5173`
