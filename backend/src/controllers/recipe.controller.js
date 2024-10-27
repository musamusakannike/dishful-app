const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Define the recipe schema
const recipeSchema = {
  description: "Complete recipe structure",
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
  },
  required: ["title", "ingredients", "steps"],
};

const genTextRecipe = async (req, res) => {
  const { food } = req.body;

  if (!food) {
    return res
      .status(400)
      .json({ error: "Food is required in the request body" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    // Generate the recipe
    const prompt = `Provide a complete recipe for ${food} including title, ingredients, steps, recipe source, food location, and other necessary details.`;
    const result = await model.generateContent(prompt);

    const recipe = JSON.parse(result.response.text());
    return res.json(recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate the recipe" });
  }
};
const genIngredientsRecipe = async (req, res) => {
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json({ error: "Ingredients list is required and cannot be empty" });
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

    // Generate recipe(s) based on the given ingredients
    const prompt = `Based on the following ingredients: ${ingredients.join(
      ", "
    )}, provide a suitable recipe. If no matching recipe exists, respond with a message saying 'No recipe available'. If multiple foods match, provide the first recipe and add others under 'otherRecipes'.`;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    // Handle the response from the model
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

module.exports = {
  genTextRecipe,
  genIngredientsRecipe,
};
