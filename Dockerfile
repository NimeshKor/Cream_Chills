FROM node:20-slim

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend and frontend source
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend

# Cloud Run provides PORT at runtime; server.js already reads process.env.PORT
EXPOSE 8080

CMD ["node", "server.js"]
