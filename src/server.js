import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import departmentRoutes from "./routes/deparmentRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import "./cron/remainder.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import myissuebook from "./routes/users/myissuebook.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://library-management-frontend-puce-three.vercel.app"
];

// ✅ CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("/{*path}", cors());

// Middleware
app.use(express.json());

// DB
connectDb();

// Routes
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/dept", departmentRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mybooks", myissuebook);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});