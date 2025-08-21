require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Import routes
const publicationsRoutes = require("./routes/publications");

// Set up routes
app.use("/publications", publicationsRoutes); // All routes under /publications

const userRoutes = require("./routes/user");
app.use("/users", userRoutes);
// Default route for API health check
app.get("/", (req, res) => {
  res.send("Publication System API is running!");
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Start the server only when NOT in test mode
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Export the app instance for testing
module.exports = app;
