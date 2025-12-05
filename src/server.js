// server.js

// --- 1. Import Required Modules ---
// Express is a minimal and flexible Node.js web application framework.
const express = require('express');
// The 'os' module provides utilities for operating system-related information,
// which is useful for the health check.
const os = require('os');

// --- 2. Initialize the Application ---
// Create an instance of the Express application.
const app = express();
// Define the port the server will listen on.
// It uses an environment variable (process.env.PORT) if set, otherwise defaults to 3000.
const PORT = process.env.PORT || 3000;


// --- 3. Define Routes (API Endpoints) ---

// Root Endpoint ('/')
// This defines the handler for a GET request to the application's root URL.
app.get('/', (req, res) => {
  // Sends a simple text response to confirm the server is running.
  res.send('Health Check API is Running!');
});

// Health-Check Endpoint ('/health')
// This defines the handler for a GET request to the /health URL.
app.get('/health', (req, res) => {
  // Collect system-level data to include in the health report.
  const data = {
    status: 'ok', // Standard status indicator for a successful check
    timestamp: new Date().toISOString(), // The exact time the check was performed
    hostname: os.hostname(), // The network name of the server/container
    platform: os.platform(), // The operating system platform (e.g., 'linux')
    arch: os.arch(), // The operating system architecture (e.g., 'x64')
  };
  // Send the collected data as a JSON response with a standard 200 OK status.
  res.status(200).json(data);
});


// --- 4. Start the Server ---
// Bind the application to the specified PORT and put the server into a listening state.
app.listen(PORT, () => {
  // Log a confirmation message to the console when the server successfully starts.
  console.log(`🚀 Health Check API listening on port ${PORT}`);
});
