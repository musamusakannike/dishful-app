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

// DELETE a saved recipe by ID
const deleteSavedItem = async (req, res) => {
  try {
    const userId = req.user.userId; // Ensure the user is authenticated
    const recipeId = req.params.id;

    // Find the recipe and verify ownership
    const recipe = await Recipe.findOne({ _id: recipeId, user: userId });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }

    // Delete the recipe
    await Recipe.deleteOne({ _id: recipeId });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe", error });
  }
};

module.exports = {
  getSavedItems,
  saveItem,
  deleteSavedItem
};
