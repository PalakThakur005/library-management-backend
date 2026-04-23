import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron"
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import  cardRoutes from "./routes/cardRoutes.js"
import departmentRoutes from "./routes/deparmentRoutes.js"
import issueRoutes from "./routes/issueRoutes.js";
import "./cron/remainder.js";
import dashboardRoutes from "./routes/dashboardRoutes.js"
import myissuebook from "./routes/users/myissuebook.js"

dotenv.config();

const app = express();
// cron.schedule("*/10 * * * * *", function() {
//     console.log("running a task every 10 second");
// });



app.use(cors({
  origin: "https://library-management-frontend-puce-three.vercel.app"
 
})); 
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log("DB Error:", err));
connectDb();

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// connect Route
app.use("/api/auth",authRoutes)
app.use("/api/book" , bookRoutes)
app.use("/api/card" , cardRoutes)
app.use("/api/dept" , departmentRoutes)
app.use("/api/issue", issueRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mybooks", myissuebook);

// Start Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});