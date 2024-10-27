const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Extended Recipe Schema with new properties
const recipeSchema = {
  description: "Complete recipe structure with additional information",
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "The name of the recipe",
      nullable: false,
    },
    ingredients: {
      type: SchemaType.ARRAY,
      description: "List of ingredients required",
      items: { type: SchemaType.STRING },
    },
    steps: {
      type: SchemaType.ARRAY,
      description: "List of steps to prepare the dish",
      items: { type: SchemaType.STRING },
    },
    recipeSource: {
      type: SchemaType.STRING,
      description: "Where the recipe originates from",
    },
    foodLocation: {
      type: SchemaType.STRING,
      description: "Where the food is consumed majorly",
    },
    additionalInfo: {
      type: SchemaType.STRING,
      description: "Any additional information about the recipe",
    },
    nutritionalInfo: {
      type: SchemaType.OBJECT,
      description: "Nutritional information about the recipe",
      properties: {
        calories: {
          type: SchemaType.STRING,
          description: "Calories per serving",
        },
        protein: { type: SchemaType.STRING, description: "Protein content" },
        fat: { type: SchemaType.STRING, description: "Fat content" },
        carbs: {
          type: SchemaType.STRING,
          description: "Carbohydrates content",
        },
      },
    },
    difficulty: {
      type: SchemaType.STRING,
      description: "Recipe difficulty level (easy, medium, hard)",
    },
    timeEstimate: {
      type: SchemaType.STRING,
      description: "Estimated time required to make the dish",
    },
    pairings: {
      type: SchemaType.ARRAY,
      description: "Suggested pairings with the recipe",
      items: { type: SchemaType.STRING },
    },
    substitutions: {
      type: SchemaType.ARRAY, // Corrected to ARRAY to avoid additionalProperties usage
      description: "Possible ingredient substitutions",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          ingredient: {
            type: SchemaType.STRING,
            description: "Original ingredient",
          },
          substitute: {
            type: SchemaType.STRING,
            description: "Suggested substitute",
          },
        },
      },
    },
  },
  required: ["title", "ingredients", "steps"],
};

// Generate Recipe by Food Name
const genTextRecipe = async (req, res) => {
  const { food, additionalText } = req.body;

  if (!food) {
    return res
      .status(400)
      .json({ error: "Food is required in the request body" });
  }

  if (additionalText && typeof additionalText !== "string") {
    return res.status(400).json({ error: "Additional text must be a string" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const prompt = `Provide a complete recipe for ${food}. ${
      additionalText ? `${additionalText}.` : ""
    } Include the title, ingredients, steps, source, location, nutritional information, difficulty, time estimate, pairings, and substitutions.`;
    const result = await model.generateContent(prompt);

    const recipe = JSON.parse(result.response.text());
    return res.json(recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate the recipe" });
  }
};

// Generate Recipe by Ingredients
const genIngredientsRecipe = async (req, res) => {
  const { ingredients, additionalText } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json({ error: "Ingredients list is required and cannot be empty" });
  }

  if (additionalText && typeof additionalText !== "string") {
    return res.status(400).json({ error: "Additional text must be a string" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          description: "Recipe or message response",
          properties: {
            recipe: recipeSchema,
            message: {
              type: SchemaType.STRING,
              description: "Message indicating if no recipe is available",
            },
            otherRecipes: {
              type: SchemaType.ARRAY,
              description: "List of additional food recipes, if available",
              items: recipeSchema,
            },
          },
        },
      },
    });

    const prompt = `Based on the following ingredients: ${ingredients.join(
      ", "
    )}. ${
      additionalText ? `${additionalText}.` : ""
    } Provide a suitable recipe. If no matching recipe exists, respond with 'No recipe available'. If multiple foods match, provide the first recipe and include others under 'otherRecipes'. Include nutritional information, difficulty, time estimate, pairings, and substitutions.`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    if (response.message && response.message.includes("No recipe available")) {
      return res.status(404).json({ message: response.message });
    }

    const { recipe, otherRecipes = [] } = response;
    return res.json({ recipe, otherRecipes });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate the recipe" });
  }
};

const genRandomRecipe = async (req, res) => {
  const { additionalText } = req.body;

  if (additionalText && typeof additionalText !== "string") {
    return res.status(400).json({ error: "Additional text must be a string" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const prompt = `Generate a random recipe. ${
      additionalText ? `${additionalText}.` : ""
    } Include the title, ingredients, steps, recipe source, food location, nutritional information, difficulty level, time estimate, pairings, and substitutions.`;

    const result = await model.generateContent(prompt);
    const recipe = JSON.parse(result.response.text());

    return res.json(recipe);
  } catch (error) {
    console.error("Error generating random recipe:", error);
    res.status(500).json({ error: "Failed to generate the random recipe" });
  }
};

const genLeftoversRecipe = async (req, res) => {
  const { leftovers, additionalText = "" } = req.body;

  // Validate that leftovers are provided and it's a non-empty array
  if (!Array.isArray(leftovers) || leftovers.length === 0) {
    return res
      .status(400)
      .json({ error: "Leftover ingredients are required and cannot be empty" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const prompt = `Create a recipe using the following leftover ingredients: ${leftovers.join(
      ", "
    )}. ${
      additionalText ? `${additionalText}.` : ""
    } Include the title, ingredients, steps, source, location, nutrition, difficulty level, time estimate, pairings, and possible substitutions.`;

    const result = await model.generateContent(prompt);
    const recipe = JSON.parse(result.response.text());

    return res.json(recipe);
  } catch (error) {
    console.error("Error generating leftovers recipe:", error);
    res.status(500).json({ error: "Failed to generate the leftovers recipe" });
  }
};

module.exports = {
  genTextRecipe,
  genIngredientsRecipe,
  genRandomRecipe,
  genLeftoversRecipe, // Export the new controller
};
