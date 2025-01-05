import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from './routes/foodRoute.js';
import 'dotenv/config';
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoute.js";

const port = process.env.PORT || 4000;

// App config
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://platter-pal-frondend.vercel.app/'
  ]
}));

// db connection 
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter); // Corrected path

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
