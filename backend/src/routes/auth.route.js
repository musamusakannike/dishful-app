const express = require("express");
const { registerUser, loginUser, getCurrentUser } = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current-user", authenticate, getCurrentUser);

module.exports = router;
