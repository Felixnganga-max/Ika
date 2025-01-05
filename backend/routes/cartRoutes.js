import express from 'express'
import { getCart, removeItems, addToCart } from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js';


const cartRouter = express.Router();

cartRouter.post("add", authMiddleware, addToCart)
cartRouter.post("remove", authMiddleware, removeItems)
cartRouter.post("get",authMiddleware, getCart)

export default cartRouter;
