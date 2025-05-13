import mongoose from "mongoose";

// Create Food Schema
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Required
    description: { type: String, required: false }, // Optional
    price: { type: Number, required: true }, // Required
    images: { type: [String], default: [] }, // Store multiple image URLs (Cloudinary)
    category: { type: String, required: true }, // Required
  },
  { timestamps: true } // Auto-generate createdAt & updatedAt
);

// Correctly create the model
const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;
