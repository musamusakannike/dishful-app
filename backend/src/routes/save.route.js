const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { saveItem, getSavedItems } = require("../controllers/save.controller");
const router = express.Router();

// GET SAVED RECIPES
router.get("/", authenticate, getSavedItems);

// POST RECIPE TO SAVE
router.post("/", authenticate, saveItem);

module.exports = router;