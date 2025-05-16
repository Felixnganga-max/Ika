import express from "express";
import {
  addFood,
  listFood,
  updateFood,
  removeFood,
  toggleOffer,
  updateRecipe,
} from "../controllers/foodController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Route to add a new food item (with image upload)
router.post("/", upload.array("images", 5), addFood);

// Route to get all food items (sorted by latest)
router.get("/", listFood);

// Route to update an existing food item (with potential image upload)
router.put("/:id", upload.array("images", 5), updateFood);

// Route to delete a food item
router.delete("/", removeFood);

// Route to toggle the offer status of a food item
router.patch("/toggle-offer/:id", toggleOffer);

// Route to update only the recipe of a food item
router.patch("/update-recipe/:id", updateRecipe);

export default router;
