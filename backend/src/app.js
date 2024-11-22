const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db.config");

require("dotenv").config();

const middlewares = require("./middlewares");

const authRoutes = require("./routes/auth.route");
const recipeRoutes = require("./routes/recipe.route");
const saveRoutes = require("./routes/save.route");

connectDB();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SERVER IS RUNNING....",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipe", recipeRoutes);
app.use("/api/v1/save", saveRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
