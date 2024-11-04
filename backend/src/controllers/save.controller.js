const Recipe = require("../models/recipe.model");

// GET saved recipes for the authenticated user
const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.userId; // Get user ID from authenticate middleware
    const savedRecipes = await Recipe.find({ user: userId }); // Find recipes saved by the user
    res.status(200).json(savedRecipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved recipes", error });
  }
};

// POST a new recipe for the authenticated user
const saveItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, recipe } = req.body;

    const newRecipe = new Recipe({
      title,
      recipe,
      user: userId,
    });

    const savedRecipe = await newRecipe.save(); // Save the new recipe to the database
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to save recipe", error });
  }
};

module.exports = {
  getSavedItems,
  saveItem,
};
