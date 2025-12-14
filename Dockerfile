# Multi-stage build: build client with Vite, then serve with Node/Express

FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:18-alpine AS server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
# Copy built client assets into a path the server serves in production
COPY --from=client-build /app/client/dist ../client/dist
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "index.js"]