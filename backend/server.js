import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoute.js";

// Load environment variables
dotenv.config();

// Database connection
connectDB();

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// ✅ Fix: Correct CORS configuration
// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow these HTTP methods
    credentials: true, // Allow cookies and credentials
  })
);

// Serve static images
app.use("/images", express.static("uploads"));

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
