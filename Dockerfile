# Multi-stage production Dockerfile for ReWear
# Stage 1: Build client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Server & Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose port
EXPOSE 5000

CMD ["node", "src/index.js"]
