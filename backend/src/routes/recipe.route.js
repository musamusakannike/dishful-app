const express = require('express');
const authenticate = require("../middlewares/auth.middleware")
const {genTextTextRecipe} = require("../controllers/recipe.controller")

const router = express.Router();

router.post("/text-text-recipe", authenticate, genTextTextRecipe);

module.exports = router;