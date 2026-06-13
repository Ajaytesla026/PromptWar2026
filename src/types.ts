export interface SubstitutionDetails {
  alternativeName: string;
  reason: string; // e.g. "budget option", "healthy alternative"
  impactOnCost: "lower" | "similar" | "higher" | string;
  approxSavings?: number;
}

export interface Ingredient {
  name: string;
  quantity: string;
  category: string; // e.g., "Produce", "Dairy", "Pantry"
  isAvailableInPantry: boolean;
  estimatedCost: number;
  substitution: SubstitutionDetails;
}

export interface NutritionInfo {
  proteinGrams: number;
  carbsGrams: number;
  fiberGrams: number;
  calories: number;
}

export interface MealDetail {
  name: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  nutrition: NutritionInfo;
  keySteps: string[];
}

export interface Meals {
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
}

export interface CookingToDoItem {
  id: string;
  mealType: "breakfast" | "lunch" | "dinner" | "prep";
  title: string;
  instruction: string;
  durationMinutes: number;
  isCompleted: boolean;
}

export interface BudgetSummary {
  estimatedTotalCost: number;
  pantrySavings: number;
  budgetRecommendation: string;
  tierBreakdowns: {
    economy: number;
    balanced: number;
    premium: number;
  };
}

export interface CookingPlanResponse {
  meals: Meals;
  groceryList: Ingredient[];
  cookingToDoList: CookingToDoItem[];
  budgetSummary: BudgetSummary;
}

export interface UserPreferences {
  availableTime: "quick" | "balanced" | "gourmet";
  dietaryPreferences: string;
  pantryIngredients: string;
  budgetTier: "economy" | "balanced" | "premium";
  culturalPreferences: string;
  customNotes: string;
}
