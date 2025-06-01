// cartController.js - Updated to use auth middleware consistently

import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware instead of req.body
    const { itemId } = req.body;

    // Validate required fields
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Find the user by ID
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure cartData exists and is an object
    let cartData = userData.cartData || {};

    // Check if the item exists in the cart, if not add it, otherwise increment the quantity
    if (!cartData[itemId]) {
      cartData[itemId] = 1; // First time adding item
    } else {
      cartData[itemId] += 1; // Incrementing the quantity
    }

    // Update the user with the new cart data
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    // Send a success response
    res.json({
      success: true,
      message: "Added to Cart",
      cartData: cartData,
    });
  } catch (error) {
    console.log("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding to cart",
    });
  }
};

// Remove items from user Cart
const removeItems = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const itemId = req.params.itemId; // from URL

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Get from auth middleware instead of req.body

    // Find the user by ID
    let userData = await userModel.findById(userId);

    // Check if user exists
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Retrieve the user's cartData
    let cartData = userData.cartData || {}; // Default to empty object if no cartData

    // Return the cart data in the response
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the cart",
    });
  }
};

export { addToCart, removeItems, getCart };
