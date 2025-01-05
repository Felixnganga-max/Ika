import mongoose from "mongoose";

// Create Food Schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Required
    description: { type: String, required: false }, // Make this optional
    price: { type: Number, required: true}, // Required
    image: { type: String }, // Not required
    category: { type: String, required: true } // Required
});

// Correctly create the model
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
