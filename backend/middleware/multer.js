import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Set up Cloudinary storage for multiple images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "food_images", // Cloudinary folder
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique file name
  },
});

const upload = multer({ storage });

export default upload;
