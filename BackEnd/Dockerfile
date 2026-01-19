# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose NestJS port
EXPOSE 5000

# Start the production server
CMD ["node", "dist/main.js"]

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose NestJS port
EXPOSE 5000

# Start the dev server with hot reload
CMD ["npm", "run", "start:dev"]

