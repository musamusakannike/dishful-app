const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    recipe: {
      type: Object,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
