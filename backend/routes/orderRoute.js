import express from "express";
import {
  placeOrder,
  verifyOrder,
  listOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  mpesaCallback,
  getPaymentConfirmations,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Public routes (no authentication required)
orderRouter.post("/mpesa-callback", mpesaCallback); // M-Pesa payment callback
orderRouter.post("/verify", verifyOrder); // M-Pesa payment verification

// Protected routes - Customer (require authentication)
orderRouter.post("/place", authMiddleware, placeOrder); // Customer: Place new order
orderRouter.get("/user", authMiddleware, userOrders); // Customer: Get user's orders
orderRouter.post("/cancel", authMiddleware, cancelOrder); // Customer: Cancel order

// Protected routes - Admin (require authentication)
orderRouter.get("/list", authMiddleware, listOrders); // Admin: Get all orders
orderRouter.post("/status", authMiddleware, updateStatus); // Admin: Update order status
orderRouter.get("/payments", authMiddleware, getPaymentConfirmations); // Admin: Get payment confirmations

export default orderRouter;
