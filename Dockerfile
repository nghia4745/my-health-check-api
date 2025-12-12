# --- Stage 1: Builder Stage ---
# Use a specific, stable Node version for building
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
# This step is cached, speeding up subsequent builds
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# --- Stage 2: Production Stage ---
# Use a lean base image for the final production image
FROM node:20-alpine
WORKDIR /app

# COPY the crucial package.json for the 'npm start' command to work
COPY package.json ./

# Copy only the necessary files from the builder stage
# (This excludes the development tools and build artifacts)
COPY --from=builder /app/node_modules ./node_modules
COPY src/ ./src/

# Expose the port the app listens on
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]
