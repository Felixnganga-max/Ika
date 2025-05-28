import express from "express";
import {
  getCart,
  removeItems,
  addToCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

// Fixed: Added missing "/" before "remove"
cartRouter.post("/add", addToCart);
cartRouter.post("/remove", removeItems); // This was missing the "/"
cartRouter.post("/get", getCart);

export default cartRouter;
