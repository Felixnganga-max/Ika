// cartRouter.js - Updated routes

import express from "express";
import {
  getCart,
  removeItems,
  addToCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

// All routes now consistently use authMiddleware
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.delete("/remove/:itemId", authMiddleware, removeItems); // Changed to DELETE method
cartRouter.get("/get", authMiddleware, getCart); // Changed to GET method

export default cartRouter;
