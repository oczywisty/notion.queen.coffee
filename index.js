// Import required libraries
require('dotenv').config();

const express = require("express");
const setupRoutes = require("./routes");

const app = express();
app.use(express.json());

// Setup routes
setupRoutes(app);

// Setup port
const port = 3000;

// Serve the frontend files
app.use(express.static("public"));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
