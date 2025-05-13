import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const foodRouter = express.Router();

// Cloudinary storage setup
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "food_images", // Cloudinary folder
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique file name
  },
});

// Multer setup for handling file uploads
const upload = multer({ storage: cloudinaryStorage });

// Routes
foodRouter.post("/add", upload.array("images", 5), addFood); // Support multiple image uploads
foodRouter.get("/list", listFood);
foodRouter.delete("/remove", removeFood);
foodRouter.post("/delete", removeFood);

export default foodRouter;
