import express from "express";
import { placeOrder, verifyOrder } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Define routes with proper HTTP methods and leading slashes
orderRouter.post("/place", authMiddleware, placeOrder); // Requires authentication
orderRouter.post("/verify", verifyOrder); // Public endpoint
// orderRouter.post("/userorders", authMiddleware, userOrders); // Requires authentication
// orderRouter.get("/list", listOrders); // Retrieves all orders (admin functionality)
// orderRouter.post("/status", updateStatus); // Updates order status

export default orderRouter;
