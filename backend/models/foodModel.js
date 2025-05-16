import mongoose from "mongoose";

// Create Food Schema
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Required
    description: { type: String, required: false }, // Optional
    price: { type: Number, required: true }, // Required
    images: { type: [String], default: [] }, // Store multiple image URLs (Cloudinary)
    category: { type: String, required: true }, // Required
    isOnOffer: { type: Boolean, default: false }, // Whether product is on sale
    offerPrice: { type: Number, required: false }, // Sale price (when isOnOffer is true)
    recipe: { type: String, required: false }, // Recipe instructions for staff training
  },
  { timestamps: true } // Auto-generate createdAt & updatedAt
);

// Correctly create the model
const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;
