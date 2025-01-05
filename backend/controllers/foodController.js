import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    const savedFood = await food.save();
    res.status(201).json({ success: true, data: savedFood });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding food item" });
  }
};

//List Food
const listFood = async (req, res) => {
  try {
    // Sort the foods by createdAt in descending order to get the latest items first
    const foods = await foodModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: foods }); // Return sorted data
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" }); // Added status code
  }
};

// REMOVE FOOD ITEMS
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    await foodModel.findByIdAndDelete(req.body.id);
    await fs.unlink(`uploads/${food.image}`, () => {});
    res.status(200).json({ success: true, message: "Food removed" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export { addFood, listFood, removeFood };
