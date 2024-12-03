const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { saveItem, getSavedItems, deleteSavedItem } = require("../controllers/save.controller");
const router = express.Router();

// GET SAVED RECIPES
router.get("/", authenticate, getSavedItems);

// POST RECIPE TO SAVE
router.post("/", authenticate, saveItem);

// DELETE SAVED RECIPE
router.delete("/:id", authenticate, deleteSavedItem);

module.exports = router;
