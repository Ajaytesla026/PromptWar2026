import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with aistudio-build header
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in the app workspace.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Cooking Plan Generation API Endpoint
app.post("/api/generate-plan", async (req, res) => {
  try {
    const {
      availableTime = "balanced", // "quick" | "balanced" | "gourmet"
      dietaryPreferences = "none", // Vegan, Vegetarian, Gluten-Free, Keto, etc.
      pantryIngredients = "", // text or array of items already at home
      budgetTier = "balanced", // economy, balanced, premium
      culturalPreferences = "any", // Indian, Italian, Mexican, casual, etc.
      customNotes = "",
    } = req.body;

    const ai = getGeminiClient();

    // Custom crafted instructional prompt for the model
    const prompt = `
You are an expert AI chef, budget organizer, and meal planner.
Provide a complete, personalized cooking guide for a user's day based on:
- Combined preparation & cooking time preference: ${availableTime}
- Dietary restrictions or preferences: ${dietaryPreferences}
- Ingredients already available in user's pantry/fridge: ${pantryIngredients}
- Target budget tier: ${budgetTier}
- Cultural flavor choice/style: ${culturalPreferences}
- Additional user requests: ${customNotes}

Your task:
1. DESIGN MEALS:
   Create Breakfast, Lunch, and Dinner options. Ensure they are balanced (protein, carbs, fiber) and respect dietary guidelines. Make them realistic cooking items.
2. GROCERY LIST:
   List exact quantities of ingredients needed.
   Group ingredients by categorization ("Produce", "Dairy", "Pantry", "Spices", "Meat/Protein", "Other").
   If an ingredient is already in the pantry (matches the pantry ingredients list), set "isAvailableInPantry" to true; otherwise false.
   Estimate cost in INR (Indian Rupee, ₹) on a realistic local Indian scale (e.g., ₹40 for veggies, ₹150 for paneer/tofu/chicken, etc.). Do not use USD.
   Specify dynamic and tailored healthy / budget-friendly alternatives under "substitution" with approxSavings in INR.
3. COOKING TO-DO LIST:
   Provide sequentially chronological step-by-step preparation and cooking items for the day. Categorize by "mealType": "breakfast", "lunch", "dinner", or general "prep".
4. BUDGET SUMMARY:
   Provide estimated total cost of required groceries in INR (not counting pantry ones under estimated total cost of purchase).
   Provide pantry savings (the sum of estimated cost of ingredients that are already in the pantry) in INR.
   Provide realistic estimated cost limits for the day in INR under tiers: "economy", "balanced", and "premium".
   Include custom recommendations: e.g. "To stay within budget, make sure to replace X with Y" specifying costs in INR (₹).

Return the result as a strictly compliant JSON matching the requested schema. Make descriptions enticing, clear, and actionable. Time limits should map accurately to ${availableTime}.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meals: {
              type: Type.OBJECT,
              properties: {
                breakfast: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    prepTimeMinutes: { type: Type.INTEGER },
                    cookTimeMinutes: { type: Type.INTEGER },
                    nutrition: {
                      type: Type.OBJECT,
                      properties: {
                        proteinGrams: { type: Type.INTEGER },
                        carbsGrams: { type: Type.INTEGER },
                        fiberGrams: { type: Type.INTEGER },
                        calories: { type: Type.INTEGER },
                      },
                      required: ["proteinGrams", "carbsGrams", "fiberGrams", "calories"],
                    },
                    keySteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["name", "description", "prepTimeMinutes", "cookTimeMinutes", "nutrition", "keySteps"],
                },
                lunch: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    prepTimeMinutes: { type: Type.INTEGER },
                    cookTimeMinutes: { type: Type.INTEGER },
                    nutrition: {
                      type: Type.OBJECT,
                      properties: {
                        proteinGrams: { type: Type.INTEGER },
                        carbsGrams: { type: Type.INTEGER },
                        fiberGrams: { type: Type.INTEGER },
                        calories: { type: Type.INTEGER },
                      },
                      required: ["proteinGrams", "carbsGrams", "fiberGrams", "calories"],
                    },
                    keySteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["name", "description", "prepTimeMinutes", "cookTimeMinutes", "nutrition", "keySteps"],
                },
                dinner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    prepTimeMinutes: { type: Type.INTEGER },
                    cookTimeMinutes: { type: Type.INTEGER },
                    nutrition: {
                      type: Type.OBJECT,
                      properties: {
                        proteinGrams: { type: Type.INTEGER },
                        carbsGrams: { type: Type.INTEGER },
                        fiberGrams: { type: Type.INTEGER },
                        calories: { type: Type.INTEGER },
                      },
                      required: ["proteinGrams", "carbsGrams", "fiberGrams", "calories"],
                    },
                    keySteps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["name", "description", "prepTimeMinutes", "cookTimeMinutes", "nutrition", "keySteps"],
                },
              },
              required: ["breakfast", "lunch", "dinner"],
            },
            groceryList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  category: { type: Type.STRING },
                  isAvailableInPantry: { type: Type.BOOLEAN },
                  estimatedCost: { type: Type.NUMBER },
                  substitution: {
                    type: Type.OBJECT,
                    properties: {
                      alternativeName: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      impactOnCost: { type: Type.STRING },
                      approxSavings: { type: Type.NUMBER },
                    },
                    required: ["alternativeName", "reason", "impactOnCost"],
                  },
                },
                required: [
                  "name",
                  "quantity",
                  "category",
                  "isAvailableInPantry",
                  "estimatedCost",
                  "substitution",
                ],
              },
            },
            cookingToDoList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  mealType: { type: Type.STRING },
                  title: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  durationMinutes: { type: Type.INTEGER },
                  isCompleted: { type: Type.BOOLEAN },
                },
                required: ["id", "mealType", "title", "instruction", "durationMinutes", "isCompleted"],
              },
            },
            budgetSummary: {
              type: Type.OBJECT,
              properties: {
                estimatedTotalCost: { type: Type.NUMBER },
                pantrySavings: { type: Type.NUMBER },
                budgetRecommendation: { type: Type.STRING },
                tierBreakdowns: {
                  type: Type.OBJECT,
                  properties: {
                    economy: { type: Type.NUMBER },
                    balanced: { type: Type.NUMBER },
                    premium: { type: Type.NUMBER },
                  },
                  required: ["economy", "balanced", "premium"],
                },
              },
              required: ["estimatedTotalCost", "pantrySavings", "budgetRecommendation", "tierBreakdowns"],
            },
          },
          required: ["meals", "groceryList", "cookingToDoList", "budgetSummary"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response output from Gemini model.");
    }

    const payload = JSON.parse(text.trim());
    res.json(payload);
  } catch (error: any) {
    console.error("Gemini meal planning generation failure:", error);
    res.status(500).json({
      error: error.message || "An error occurred while generating cooking steps & budget summary.",
    });
  }
});

// Setup Vite Dev Server / Static Hosting Middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cooking To-Do List backend server running on http://0.0.0.0:${PORT}`);
  });
}

start();
