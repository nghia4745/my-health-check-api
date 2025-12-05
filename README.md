# my-health-check-api
A barebones Express application that exposes a single endpoint, like /status or /health.

# Install Node.js and Express on local development machine
1. sudo apt update && sudo apt install npm
2. npm init -y
3. npm install express

# Building and Running Container Image
1. docker build -t my-health-check-api:v1.0.0 .
2. docker run -p 8080:3000 my-health-check-api:v1.0.0
