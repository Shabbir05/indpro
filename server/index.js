const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Task Manager API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, _next) => {
  console.error("Server error:", err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message,
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
