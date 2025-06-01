import express from "express";
import {
  placeOrder,
  verifyOrder,
  listOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Public routes
orderRouter.post("/verify", verifyOrder); // M-Pesa callback verification
orderRouter.get("/list", listOrders); // Admin: Get all orders

// Protected routes (require authentication)
orderRouter.post("/place", placeOrder); // Customer: Place new order
orderRouter.get("/user", userOrders); // Customer: Get user's orders
orderRouter.post("/status", updateStatus); // Admin: Update order status

export default orderRouter;
