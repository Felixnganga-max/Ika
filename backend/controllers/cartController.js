import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId || !req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Item ID are required",
      });
    }

    // Find the user by ID
    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure cartData exists and is an object
    let cartData = userData.cartData || {};

    // Check if the item exists in the cart, if not add it, otherwise increment the quantity
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1; // First time adding item
    } else {
      cartData[req.body.itemId] += 1; // Incrementing the quantity
    }

    // Update the user with the new cart data
    await userModel.findByIdAndUpdate(
      req.body.userId,
      { cartData },
      { new: true }
    );

    // Send a success response
    res.json({
      success: true,
      message: "Added to Cart",
      cartData: cartData, // Optional: return updated cart data
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
    // Validate required fields
    if (!req.body.userId || !req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Item ID are required",
      });
    }

    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Removed unnecessary await

    if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;

      // Optional: Remove item completely if quantity becomes 0
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId];
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log("Error removing from cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing from cart" });
  }
};

// Fetch user cart data
const getCart = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the user by ID
    let userData = await userModel.findById(req.body.userId);

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
