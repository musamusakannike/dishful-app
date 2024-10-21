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

const genTextTextRecipe = async (req, res) => {
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

const saveRecipes = async (req, res) => {};

const deleteRecipe = async (req, res) => {};

module.exports = { genTextTextRecipe, saveRecipes, deleteRecipe };
