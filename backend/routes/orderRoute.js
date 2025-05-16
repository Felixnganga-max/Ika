import express from "express";
import {
  placeOrder,
  verifyOrder,
  listOrders,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Define routes with proper HTTP methods and leading slashes
orderRouter.post("/place", authMiddleware, placeOrder); // Requires authentication
orderRouter.post("/verify", verifyOrder); // Public endpoint
// orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders); // Retrieves all orders (admin functionality)
// orderRouter.post("/status", updateStatus);

export default orderRouter;
