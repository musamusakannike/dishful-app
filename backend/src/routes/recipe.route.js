const express = require('express');
const authenticate = require("../middlewares/auth.middleware")
const {genTextRecipe, genIngredientsRecipe} = require("../controllers/recipe.controller")

const router = express.Router();

router.post("/text-recipe", authenticate, genTextRecipe);
router.post("/ingredients-recipe", authenticate, genIngredientsRecipe);

module.exports = router;