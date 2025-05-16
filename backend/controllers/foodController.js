import foodModel from "../models/foodModel.js";
import { cloudinary } from "../config/cloudinary.js";

const addFood = async (req, res) => {
  try {
    // Check if images are uploaded; if not, set images to an empty array
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    // Create a new food item with all the new fields
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      images: imageUrls.reverse(), // Last uploaded image should be at index 0, or an empty array if no images
      isOnOffer:
        req.body.isOnOffer === "true" || req.body.isOnOffer === true
          ? true
          : false,
      offerPrice: req.body.offerPrice || null,
      recipe: req.body.recipe || "",
    });

    // Save the food item to the database
    const savedFood = await food.save();

    // Respond with the saved food item
    res.status(201).json({ success: true, data: savedFood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding food item" });
  }
};

// ✅ List Food (Sorted by Latest)
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error listing food items" });
  }
};

// ✅ Update Food Item (Modify Images & Keep Last Upload at Index 0)
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    let food = await foodModel.findById(id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // Process image uploads if new images are provided
    let updatedImages = food.images;
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map((file) => file.path);
      updatedImages = [...newImageUrls.reverse(), ...updatedImages]; // Newest images first
    }

    // Update food details including the new fields
    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;
    food.images = updatedImages.slice(0, 5); // Keep only the last 5 images

    // Handle new fields
    if (req.body.isOnOffer !== undefined) {
      food.isOnOffer =
        req.body.isOnOffer === "true" || req.body.isOnOffer === true
          ? true
          : false;
    }

    if (req.body.offerPrice !== undefined) {
      food.offerPrice = req.body.offerPrice;
    }

    if (req.body.recipe !== undefined) {
      food.recipe = req.body.recipe;
    }

    const updatedFood = await food.save();
    res.status(200).json({ success: true, data: updatedFood });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating food item" });
  }
};

// ✅ Remove Food Item (Deletes Images from Cloudinary)
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // Extract public_id from Cloudinary URLs and delete images
    const imagePublicIds = food.images.map(
      (url) => url.split("/").pop().split(".")[0]
    );
    await Promise.all(
      imagePublicIds.map((id) =>
        cloudinary.uploader.destroy(`food_images/${id}`)
      )
    );

    // Remove food item from database
    await foodModel.findByIdAndDelete(req.body.id);

    res.status(200).json({ success: true, message: "Food removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Toggle Offer Status
const toggleOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    // Toggle the offer status
    food.isOnOffer = !food.isOnOffer;

    // If setting to offer with no price, calculate a default offer price (e.g., 20% off)
    if (food.isOnOffer && (!food.offerPrice || food.offerPrice >= food.price)) {
      food.offerPrice = (food.price * 0.8).toFixed(2);
    }

    // If removing from offer, can optionally set offerPrice to null
    if (!food.isOnOffer) {
      food.offerPrice = null;
    }

    const updatedFood = await food.save();
    res.status(200).json({ success: true, data: updatedFood });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error toggling offer status" });
  }
};

// ✅ Update Recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    food.recipe = req.body.recipe;
    const updatedFood = await food.save();

    res.status(200).json({ success: true, data: updatedFood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating recipe" });
  }
};

export { addFood, listFood, updateFood, removeFood, toggleOffer, updateRecipe };
