import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Calendar,
  IndianRupee,
  CheckCircle,
  RefreshCw,
  Clock,
  Plus,
  Trash2,
  HelpCircle,
  Info,
  ShoppingCart,
  Sparkles,
  Check,
  RotateCcw,
  ArrowLeftRight,
  Flame,
  ListTodo,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  UserPreferences,
  CookingPlanResponse,
  Ingredient,
  CookingToDoItem,
  MealDetail
} from "./types";

// Fallback high-quality initial meal plan that looks incredibly professional and balanced
const INITIAL_PLAN: CookingPlanResponse = {
  meals: {
    breakfast: {
      name: "Sunny Turmeric scrambled eggs with avocado toast",
      description: "A supercharged high-protein anti-inflammatory breakfast served on crisp whole grain sourdough with smooth avocado spread.",
      prepTimeMinutes: 5,
      cookTimeMinutes: 10,
      nutrition: {
        proteinGrams: 24,
        carbsGrams: 32,
        fiberGrams: 8,
        calories: 420
      },
      keySteps: [
        "Toast the rustic sourdough slices until deeply golden.",
        "Mash ripe avocado with a pinch of lemon juice, sea salt, and red pepper flakes.",
        "Whisk eggs with turmeric powder, black pepper, and cook gently in olive oil over low heat until soft pillowy curds form.",
        "Spread avocado onto toast, top with golden scrambled eggs, and drizzle with spicy oil."
      ]
    },
    lunch: {
      name: "Lemon Tahini Roasted Chickpea Bowl",
      description: "A high-fiber, robust grain bowl filled with spiced chickpeas, fresh cucumber, grape tomatoes, and a creamy, zesty lemon-tahini dressing.",
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      nutrition: {
        proteinGrams: 18,
        carbsGrams: 58,
        fiberGrams: 12,
        calories: 540
      },
      keySteps: [
        "In a dry pan, toss canned chickpeas with cumin, paprika, sea salt, and a dash of olive oil for 8-10 minutes until lightly crisped.",
        "Cook quick-oats or quinoa, or use pre-steamed brown rice as the core base.",
        "Finely chop fresh lettuce, crisp english cucumbers, and juicy grape tomatoes.",
        "Whisk sesame tahini paste, freshly squeezed lemon juice, warm water, and a finely minced garlic clove until it forms an elegant, smooth sauce.",
        "Assemble items side-by-side in a wide shallow bowl, then drizzle generously with lemon-tahini dressing."
      ]
    },
    dinner: {
      name: "Pan-Seared Garlic Salmon with Crushed Sweet Potatoes",
      description: "A gorgeous, Omega-3 dense dinner featuring crisp salmon side served on loaded roasted sweet potato mash and blanched broccoli greens.",
      prepTimeMinutes: 12,
      cookTimeMinutes: 20,
      nutrition: {
        proteinGrams: 36,
        carbsGrams: 42,
        fiberGrams: 9,
        calories: 620
      },
      keySteps: [
        "Pierce the sweet potatoes with a fork and microwave for 6-8 minutes, then mash with a hit of unsalted butter and orange zest.",
        "Pat salmon skin completely dry, season with kosher salt, black pepper, and skin-side down in a hot skillet with avocado oil for 4 minutes until crisp.",
        "Flip salmon, throw in crushed garlic cloves, fresh rosemary, and baste with melted butter for 3 minutes.",
        "Blanch baby broccoli inside a small pot of salted boiling water for 3 minutes until vibrant green.",
        "Garnish with toasted sesame seeds and fresh lemon cheeks."
      ]
    }
  },
  groceryList: [
    {
      name: "Organic Eggs",
      quantity: "1 carton (6 pcs)",
      category: "Dairy & Protein",
      isAvailableInPantry: true,
      estimatedCost: 240.0,
      substitution: {
        alternativeName: "Firm Silken Tofu",
        reason: "Budget-friendly vegan replacement that scrambles with turmeric similarly.",
        impactOnCost: "lower",
        approxSavings: 70.0
      }
    },
    {
      name: "Ripe Hass Avocado",
      quantity: "1 medium",
      category: "Produce",
      isAvailableInPantry: false,
      estimatedCost: 130.0,
      substitution: {
        alternativeName: "Organic Hummus Spread",
        reason: "Cost-friendly creaminess loaded with fiber.",
        impactOnCost: "lower",
        approxSavings: 40.0
      }
    },
    {
      name: "Sourdough Bread",
      quantity: "1 small loaf",
      category: "Bread & Bakery",
      isAvailableInPantry: false,
      estimatedCost: 380.0,
      substitution: {
        alternativeName: "Whole Wheat Pita",
        reason: "An economical, long-lasting pantry staple.",
        impactOnCost: "lower",
        approxSavings: 170.0
      }
    },
    {
      name: "Organic Sesame Tahini paste",
      quantity: "1 jar (10 oz)",
      category: "Pantry Staples",
      isAvailableInPantry: false,
      estimatedCost: 500.0,
      substitution: {
        alternativeName: "Creamy Peanut Butter",
        reason: "An innovative peanut sauce flavor profile at a fraction of the price.",
        impactOnCost: "lower",
        approxSavings: 300.0
      }
    },
    {
      name: "Greek Chickpeas",
      quantity: "2 cans (15 oz)",
      category: "Pantry Staples",
      isAvailableInPantry: true,
      estimatedCost: 160.0,
      substitution: {
        alternativeName: "Dried Green Lentils",
        reason: "Extremely cost-effective bulk protein pantry option.",
        impactOnCost: "lower",
        approxSavings: 80.0
      }
    },
    {
      name: "Fresh Cucumbers & Grape Tomatoes",
      quantity: "1 pack combo",
      category: "Produce",
      isAvailableInPantry: false,
      estimatedCost: 290.0,
      substitution: {
        alternativeName: "Shredded Cabbage Mix",
        reason: "Stays crisp longer and costs far less per pound.",
        impactOnCost: "lower",
        approxSavings: 150.0
      }
    },
    {
      name: "Fresh Atlantic Salmon Fillets",
      quantity: "2 portions",
      category: "Dairy & Protein",
      isAvailableInPantry: false,
      estimatedCost: 1230.0,
      substitution: {
        alternativeName: "Premium Canned Pink Salmon or Tofu Blocks",
        reason: "Provides same heart-healthy fats at 70% cost reduction.",
        impactOnCost: "lower",
        approxSavings: 800.0
      }
    },
    {
      name: "Organic Sweet Potatoes",
      quantity: "2 large",
      category: "Produce",
      isAvailableInPantry: true,
      estimatedCost: 150.0,
      substitution: {
        alternativeName: "Russet Baking Potatoes",
        reason: "Excellent carbohydrate base, lighter on the wallet.",
        impactOnCost: "lower",
        approxSavings: 60.0
      }
    },
    {
      name: "Fresh Baby Broccoli Bunch",
      quantity: "1 crown",
      category: "Produce",
      isAvailableInPantry: false,
      estimatedCost: 210.0,
      substitution: {
        alternativeName: "Frozen Chopped Spinach",
        reason: "High fiber and nutrient density, practically immortal in the freezer.",
        impactOnCost: "lower",
        approxSavings: 100.0
      }
    }
  ],
  cookingToDoList: [
    {
      id: "cook-1",
      mealType: "prep",
      title: "Morning Fresh Check",
      instruction: "Check what was pre-pantry flagged. Gather whole olive oil, spices, salt, and pepper grinders on the central counter.",
      durationMinutes: 3,
      isCompleted: false
    },
    {
      id: "cook-2",
      mealType: "breakfast",
      title: "Toast & Sourdough Prep",
      instruction: "Slice sourdough and drop in toaster. Mash fresh avocado lime mix.",
      durationMinutes: 4,
      isCompleted: false
    },
    {
      id: "cook-3",
      mealType: "breakfast",
      title: "Sunny Turmeric Egg Scramble",
      instruction: "Cook eggs inside low-heat pan with turmeric and swirl until soft pillowy curds appear.",
      durationMinutes: 6,
      isCompleted: false
    },
    {
      id: "cook-4",
      mealType: "lunch",
      title: "Spiced Chickpea Roasting",
      instruction: "Toss chickpeas in hot skillet with paprika, cumin, and sea salt for 8 minutes.",
      durationMinutes: 10,
      isCompleted: false
    },
    {
      id: "cook-5",
      mealType: "lunch",
      title: "Whisking Creamy Tahini Drizzle",
      instruction: "Mix lemon juice, water, minced garlic and sesame tahini paste until velvety.",
      durationMinutes: 5,
      isCompleted: false
    },
    {
      id: "cook-6",
      mealType: "dinner",
      title: "Sweet Potato Microwave Hack",
      instruction: "Prick sweet potatoes all over with fork and microwave on high for 7 minutes to speed up prep. Mash with butter.",
      durationMinutes: 8,
      isCompleted: false
    },
    {
      id: "cook-7",
      mealType: "dinner",
      title: "Crispy Salmon Pan-Searing",
      instruction: "Pat dry salmon skin. Cook skin-down for 4 minutes to achieve perfect crunch. Flip, baste with garlic butter for 3 minutes.",
      durationMinutes: 8,
      isCompleted: false
    },
    {
      id: "cook-8",
      mealType: "dinner",
      title: "Greens blanching",
      instruction: "Plunge broccoli leaves in boiling water for 3 minutes. Assemble the absolute feast!",
      durationMinutes: 4,
      isCompleted: false
    }
  ],
  budgetSummary: {
    estimatedTotalCost: 2740.0,
    pantrySavings: 550.0,
    budgetRecommendation: "Leverage standard table salt and household spices. Swapping out Fresh Atlantic Salmon for Frozen Salmon or Tofu block decreases total expenses immediately by ₹800.",
    tierBreakdowns: {
      economy: 1100.0,
      balanced: 2740.0,
      premium: 4900.0
    }
  }
};

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    availableTime: "balanced",
    dietaryPreferences: "none",
    pantryIngredients: "salt, pepper, olive oil, dried oregano",
    budgetTier: "balanced",
    culturalPreferences: "any",
    customNotes: ""
  });

  const [plan, setPlan] = useState<CookingPlanResponse>(INITIAL_PLAN);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter or interaction states
  const [activeTab, setActiveTab] = useState<"meals" | "todos" | "grocery" | "budget">("meals");
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});
  const [appliedSubstitutions, setAppliedSubstitutions] = useState<Record<string, boolean>>({});
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [expandedSubstitutions, setExpandedSubstitutions] = useState<Record<string, boolean>>({});

  // Loading indicator random messages
  const [loadingMessage, setLoadingMessage] = useState("Measuring the grains...");
  const tips = [
    "Sharpening the virtual chef knives...",
    "Estimating tomato prices in your region...",
    "Filtering calorie distributions (protein, carbs, fiber)...",
    "Optimizing budget-friendly ingredient alternatives...",
    "Stir-frying the to-do instruction blocks...",
    "Consulting the seasoning archives..."
  ];

  // Saved plan and checked states load/save
  useEffect(() => {
    const saved = localStorage.getItem("cooking_to_do_list_payload");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlan(parsed);
      } catch (e) {
        console.warn("Could not parse saved cooking plan layout");
      }
    }

    const savedCheck = localStorage.getItem("cooking_checked_groceries");
    if (savedCheck) {
      try {
        setCheckedGroceries(JSON.parse(savedCheck));
      } catch (e) {}
    }

    const savedSubs = localStorage.getItem("cooking_applied_subs");
    if (savedSubs) {
      try {
        setAppliedSubstitutions(JSON.parse(savedSubs));
      } catch (e) {}
    }

    const savedMeals = localStorage.getItem("cooking_completed_meals");
    if (savedMeals) {
      try {
        setCompletedMeals(JSON.parse(savedMeals));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cooking_checked_groceries", JSON.stringify(checkedGroceries));
  }, [checkedGroceries]);

  useEffect(() => {
    localStorage.setItem("cooking_applied_subs", JSON.stringify(appliedSubstitutions));
  }, [appliedSubstitutions]);

  useEffect(() => {
    localStorage.setItem("cooking_completed_meals", JSON.stringify(completedMeals));
  }, [completedMeals]);

  // Handle Loading Message changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % tips.length;
        setLoadingMessage(tips[index]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setLoadingMessage("Summoning the culinary wizard...");

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        const bodyText = await response.json().catch(() => ({}));
        throw new Error(bodyText.error || `Server returned error status ${response.status}`);
      }

      const data = (await response.json()) as CookingPlanResponse;
      setPlan(data);
      localStorage.setItem("cooking_to_do_list_payload", JSON.stringify(data));

      // Reset checked states when a new plan is generated
      setCheckedGroceries({});
      setAppliedSubstitutions({});
      setCompletedMeals({});
      setActiveTab("meals");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong while connecting with the planner backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your list to the original balanced meal plan?")) {
      setPlan(INITIAL_PLAN);
      localStorage.setItem("cooking_to_do_list_payload", JSON.stringify(INITIAL_PLAN));
      setCheckedGroceries({});
      setAppliedSubstitutions({});
      setCompletedMeals({});
      setPreferences({
        availableTime: "balanced",
        dietaryPreferences: "none",
        pantryIngredients: "salt, pepper, olive oil, dried oregano",
        budgetTier: "balanced",
        culturalPreferences: "any",
        customNotes: ""
      });
      setErrorMsg(null);
      setActiveTab("meals");
    }
  };

  // Toggle todo item completion state in raw plan object & load saving
  const handleToggleTodo = (id: string) => {
    const updatedList = plan.cookingToDoList.map(item => {
      if (item.id === id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    const updatedPlan = { ...plan, cookingToDoList: updatedList };
    setPlan(updatedPlan);
    localStorage.setItem("cooking_to_do_list_payload", JSON.stringify(updatedPlan));
  };

  // Grocery helper functions
  const toggleGroceryCheck = (name: string) => {
    setCheckedGroceries(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleSubstitution = (name: string) => {
    setAppliedSubstitutions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleSubAccordion = (name: string) => {
    setExpandedSubstitutions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleMealComplete = (mealKey: "breakfast" | "lunch" | "dinner") => {
    setCompletedMeals(prev => ({
      ...prev,
      [mealKey]: !prev[mealKey]
    }));
  };

  // Calculate real-time actual budget stats based on checked items and applied substitutions
  const getDynamicBudgetStats = () => {
    let baseTotal = 0;
    let actualSpentWithSubs = 0;
    let savingsFromSubs = 0;
    let originalPurchasedTotal = 0;

    plan.groceryList.forEach(item => {
      const isPantry = item.isAvailableInPantry;
      const cost = item.estimatedCost;
      const subApplied = appliedSubstitutions[item.name];
      const itemsSavings = item.substitution.approxSavings || 0;

      // Base total counts cost of everything needed that is NOT in pantry
      if (!isPantry) {
        baseTotal += cost;
        originalPurchasedTotal += cost;

        if (subApplied) {
          const finalCost = Math.max(0, cost - itemsSavings);
          actualSpentWithSubs += finalCost;
          savingsFromSubs += itemsSavings;
        } else {
          actualSpentWithSubs += cost;
        }
      }
    });

    return {
      originalTotal: originalPurchasedTotal,
      currentTotal: actualSpentWithSubs,
      substitutionSavings: savingsFromSubs,
      totalSavedOverall: plan.budgetSummary.pantrySavings + savingsFromSubs
    };
  };

  const { originalTotal, currentTotal, substitutionSavings, totalSavedOverall } = getDynamicBudgetStats();

  // Counting totals for metrics badges
  const totalTasks = plan.cookingToDoList.length;
  const completedTasks = plan.cookingToDoList.filter(t => t.isCompleted).length;
  const totalGroceries = plan.groceryList.filter(g => !g.isAvailableInPantry).length;
  const purchasedGroceriesCount = plan.groceryList.filter(g => !g.isAvailableInPantry && checkedGroceries[g.name]).length;

  return (
    <div className="min-h-screen bg-vibrant-bg text-[#1A1A1A] font-sans antialiased w-full max-w-7xl mx-auto flex flex-col shadow-lg border-x border-[#F0EBE8]" id="cooking-planner-root">
      
      {/* HEADER BANNER */}
      <header className="border-b border-vibrant-card-border bg-white/95 backdrop-blur px-6 py-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40" id="cooking-header">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-vibrant-orange text-white rounded-[18px] shadow-md shadow-vibrant-orange/20" id="brand-logo bg">
            <ChefHat className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tighter text-vibrant-dark uppercase leading-none" id="main-title">
              CHEFLOGIC<span className="text-vibrant-orange">.UI</span>
            </h1>
            <p className="text-[10px] text-vibrant-dark/70 font-black tracking-widest uppercase mt-1">
              Smart Kitchen Assistant & Daily Spend Optimizer
            </p>
          </div>
        </div>

        {/* STATUS SHIELD */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center font-display" id="status-metrics">
          <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-4 py-2 rounded-full text-xs font-bold tracking-tight shadow-2xs hover:border-vibrant-orange/45 transition-colors flex items-center gap-1.5" title="Completed Steps today">
            <ListTodo className="h-4 w-4 text-vibrant-orange" />
            <span>{completedTasks}/{totalTasks} Steps</span>
          </div>

          <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-4 py-2 rounded-full text-xs font-bold tracking-tight shadow-2xs hover:border-vibrant-orange/45 transition-colors flex items-center gap-1.5" title="Cart Purchased Ratio">
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
            <span>{purchasedGroceriesCount}/{totalGroceries} Cart</span>
          </div>

          <div className="bg-vibrant-orange text-white px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-md shadow-vibrant-orange/15 flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4" />
            <span>Total: ₹{currentTotal.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* BODY CONTENT GRID */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8" id="cooking-workspace">
        
        {/* LEFT COLUMN: CUSTOM RECIPE / DIETARY GENERATOR FORM */}
         <section className="lg:col-span-4 flex flex-col gap-6" id="preferences-scaffold">
          <div className="bg-white border border-vibrant-card-border rounded-[32px] p-6 sm:p-7 shadow-sm flex flex-col gap-5">
            
            <div className="flex items-center justify-between border-b border-vibrant-card-border pb-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-vibrant-orange animate-pulse" />
                <h3 className="font-display font-black text-vibrant-dark text-base tracking-tight uppercase">Plan Custom Day</h3>
              </div>
              <button 
                onClick={handleReset}
                className="text-[10px] text-vibrant-dark/60 hover:text-red-500 font-bold uppercase tracking-wider transition-colors flex items-center gap-1 px-2 py-1 hover:bg-vibrant-bg rounded-lg"
                title="Restore default meal layout"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Defaults
              </button>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4.5">
              
              {/* AVAILABLE TIME TILE */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-2">Available Cooking Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["quick", "balanced", "gourmet"] as const).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setPreferences(p => ({ ...p, availableTime: time }))}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all border text-center ${
                        preferences.availableTime === time
                          ? "bg-vibrant-orange text-white border-vibrant-orange shadow-sm"
                          : "bg-vibrant-bg text-vibrant-dark/80 border-vibrant-card-border hover:border-vibrant-orange/50"
                      }`}
                    >
                      {time === "quick" ? "⚡ Quick (<15)" : time === "balanced" ? "⌛ Balanced" : "✨ Gourmet"}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIETARY CHOICES */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  <span>Dietary Preference</span>
                  <span className="text-[9px] text-vibrant-dark/40 lowercase font-normal italic tracking-normal">respects substitutions</span>
                </label>
                <select
                  value={preferences.dietaryPreferences}
                  onChange={(e) => setPreferences(p => ({ ...p, dietaryPreferences: e.target.value }))}
                  className="w-full bg-vibrant-bg border border-vibrant-card-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-vibrant-orange focus:border-vibrant-orange text-vibrant-dark"
                >
                  <option value="none">No Restrictions (Omnivore)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="keto">Keto (Low-Carb High-Fat)</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>

              {/* PANTRY INVENTORY FLAGGER */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-1 flex items-center justify-between">
                  <span>My Pantry Inventory</span>
                  <span className="text-[10px] text-emerald-600 font-bold font-mono">Deducts cost!</span>
                </label>
                <textarea
                  value={preferences.pantryIngredients}
                  onChange={(e) => setPreferences(p => ({ ...p, pantryIngredients: e.target.value }))}
                  placeholder="E.g., garlic, salt, olive oil, sweet potato, lentils, butter..."
                  rows={2}
                  className="w-full bg-vibrant-bg border border-vibrant-card-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-vibrant-orange focus:border-vibrant-orange resize-none text-vibrant-dark"
                />
                <p className="text-[10px] text-vibrant-dark/50 mt-1 leading-relaxed">
                  Owned items bypass grocery purchasing and credit your real savings summary automatically.
                </p>
              </div>

              {/* BUDGET SCENARIO TIER */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-2">Target Budget Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["economy", "balanced", "premium"] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setPreferences(p => ({ ...p, budgetTier: tier }))}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all border text-center ${
                        preferences.budgetTier === tier
                          ? "bg-vibrant-orange text-white border-vibrant-orange shadow-sm"
                          : "bg-vibrant-bg text-vibrant-dark/80 border-vibrant-card-border hover:border-vibrant-orange/50"
                      }`}
                    >
                      {tier === "economy" ? "₹ Economy" : tier === "balanced" ? "₹₹ Balanced" : "₹₹₹ Premium"}
                    </button>
                  ))}
                </div>
              </div>

              {/* CULTURAL preference / FLAVOR THEME */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-1.5">Cultural Style / Flavor Theme</label>
                <input
                  type="text"
                  value={preferences.culturalPreferences}
                  onChange={(e) => setPreferences(p => ({ ...p, culturalPreferences: e.target.value }))}
                  placeholder="Mexican, Italian, Asian, Indian, Mediterranean..."
                  className="w-full bg-vibrant-bg border border-vibrant-card-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-vibrant-orange focus:border-vibrant-orange font-mono text-vibrant-dark"
                />
              </div>

              {/* SPECIAL FLAVORS OR CONSTRAINTS */}
              <div>
                <label className="block text-[10px] font-black text-vibrant-dark/60 uppercase tracking-widest mb-1">Additional Ingredient Notes</label>
                <input
                  type="text"
                  value={preferences.customNotes}
                  onChange={(e) => setPreferences(p => ({ ...p, customNotes: e.target.value }))}
                  placeholder="E.g., I don't love hot spices, high fiber lunch..."
                  className="w-full bg-vibrant-bg border border-vibrant-card-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-vibrant-orange focus:border-vibrant-orange text-vibrant-dark font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-vibrant-orange hover:bg-[#E04F12] text-white font-black uppercase tracking-widest text-[11px] py-3.5 px-4 rounded-full shadow-md shadow-vibrant-orange/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Please Wait...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Generate Custom Day</span>
                  </>
                )}
              </button>

            </form>

            {/* Error Banner */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-850" id="error-box">
                <p className="font-bold mb-1">Could not connect to generator:</p>
                <p className="leading-relaxed font-mono text-[11px]">{errorMsg}</p>
                <p className="mt-2 text-[10px] text-vibrant-dark/50">Note: Using our dynamic fallback database while keys are verified.</p>
              </div>
            )}

            {/* QUICK CHEF TIP */}
            <div className="bg-vibrant-bg border border-vibrant-card-border p-4 rounded-2xl flex items-start gap-3 mt-1">
              <Info className="h-4 w-4 text-vibrant-orange mt-0.5 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-vibrant-dark leading-tight">Smart Cook Tip:</h5>
                <p className="text-[11px] text-vibrant-dark/70 leading-normal mt-1 font-medium">
                  Toggling ingredient items as "applied substitution" recalculates actual cart pricing live in your budgeting board dynamically! Try it in the Grocery tab.
                </p>
              </div>
            </div>

          </div>
         </section>

        {/* RIGHT COLUMN: WORKSPACE DASHBOARD (TABBED WRAPPER) */}
        <section className="lg:col-span-8 flex flex-col gap-6" id="dashboard-scaffold">
          
          {/* TAB BAR */}
          <div className="border border-vibrant-card-border bg-white p-1.5 rounded-[24px] flex items-center shadow-xs" id="nav-tabs">
            <button
              onClick={() => setActiveTab("meals")}
              className={`flex-1 py-3 px-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "meals"
                  ? "bg-vibrant-orange text-white shadow-sm shadow-vibrant-orange/10"
                  : "text-vibrant-dark/70 hover:text-vibrant-dark hover:bg-vibrant-bg"
              }`}
            >
              <ChefHat className="h-4 w-4 shrink-0" />
              <span>1. Meal Plan</span>
            </button>
            <button
              onClick={() => setActiveTab("todos")}
              className={`flex-1 py-3 px-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "todos"
                  ? "bg-vibrant-orange text-white shadow-sm shadow-vibrant-orange/10"
                  : "text-vibrant-dark/70 hover:text-vibrant-dark hover:bg-vibrant-bg"
              }`}
            >
              <ListTodo className="h-4 w-4 shrink-0" />
              <span>2. Cooking List</span>
            </button>
            <button
              onClick={() => setActiveTab("grocery")}
              className={`flex-1 py-3 px-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "grocery"
                  ? "bg-vibrant-orange text-white shadow-sm shadow-vibrant-orange/10"
                  : "text-vibrant-dark/70 hover:text-vibrant-dark hover:bg-vibrant-bg"
              }`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span>3. Grocery & Subs</span>
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`flex-1 py-3 px-2 rounded-[18px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer ${
                activeTab === "budget"
                  ? "bg-vibrant-orange text-white shadow-sm shadow-vibrant-orange/10"
                  : "text-vibrant-dark/70 hover:text-vibrant-dark hover:bg-vibrant-bg"
              }`}
            >
              <IndianRupee className="h-4 w-4 shrink-0" />
              <span>4. Budget Tuning</span>
            </button>
          </div>

          {/* RENDERING INTERRUPTED LOADER STATS */}
          {loading ? (
            <div className="bg-white border border-zinc-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[400px]">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500">
                  <ChefHat className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-medium text-lg text-zinc-900">Tailoring your tailored gourmet list</h4>
                <p className="text-zinc-500 text-xs font-mono tracking-wide">{loadingMessage}</p>
              </div>
              <p className="text-[11px] text-zinc-400 max-w-sm mt-4">
                We're consulting the Gemini-3.5 model to optimize nutrient balance, design the steps in chronological cooking lanes, and map exact cost reductions.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: MEAL PLANNING SCREEN */}
              {activeTab === "meals" && (
                <div className="flex flex-col gap-6" id="view-meals">
                  
                  {/* Tab Title Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vibrant-card-border pb-3">
                    <div>
                      <h2 className="font-display font-black text-xl text-vibrant-dark uppercase tracking-tight">Today's Gourmet Blueprint</h2>
                      <span className="text-xs text-vibrant-dark/60 font-medium">Perfect carbs, high organic protein, and fiber blocks built dynamically to fit your budget targets</span>
                    </div>
                  </div>

                  {/* MEAL CHASSIS: Breakfast, Lunch, Dinner */}
                  {(["breakfast", "lunch", "dinner"] as const).map((mealKey) => {
                    const m: MealDetail = plan.meals[mealKey];
                    if (!m) return null;
                    const isMealCooked = completedMeals[mealKey];

                    return (
                      <div
                        key={mealKey}
                        className={`bg-white border transition-all rounded-[32px] overflow-hidden hover:shadow-md ${
                          isMealCooked 
                            ? "border-emerald-200 bg-emerald-50/10 shadow-xs" 
                            : "border-vibrant-card-border"
                        }`}
                        id={`meal-row-${mealKey}`}
                      >
                        {/* Meal Header */}
                        <div className="p-6 sm:p-7 border-b border-vibrant-card-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-start gap-4">
                            <span className="mt-1 px-3 py-1 bg-vibrant-orange text-white text-[9px] font-black uppercase rounded-md tracking-widest shadow-sm">
                              {mealKey}
                            </span>
                            <div>
                              <h3 className={`font-display font-black text-vibrant-dark text-lg sm:text-xl leading-snug tracking-tight ${isMealCooked ? "line-through text-vibrant-dark/40" : ""}`}>
                                {m.name}
                              </h3>
                              <p className="text-xs text-vibrant-dark/70 font-medium mt-1.5 leading-relaxed">{m.description}</p>
                            </div>
                          </div>

                          {/* Quick cook completion trigger */}
                          <button
                            onClick={() => toggleMealComplete(mealKey)}
                            className={`shrink-0 py-2 px-4 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              isMealCooked
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-vibrant-bg text-vibrant-dark hover:text-white hover:bg-vibrant-orange transition-colors border border-vibrant-card-border"
                            }`}
                          >
                            <Check className={`h-4 w-4 ${isMealCooked ? "text-emerald-700" : "text-vibrant-orange"}`} />
                            <span>{isMealCooked ? "Cooked & Enjoyed!" : "Mark Cooked"}</span>
                          </button>
                        </div>

                        {/* Nutrition & Timing Metrics block */}
                        <div className="bg-vibrant-bg px-6 py-4.5 border-b border-vibrant-card-border flex flex-wrap gap-4 justify-between items-center text-xs">
                          
                          {/* Timers */}
                          <div className="flex items-center gap-3 font-semibold text-vibrant-dark/80">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-vibrant-orange" />
                              <span>Prep: <span className="text-vibrant-dark font-black">{m.prepTimeMinutes}m</span></span>
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-vibrant-orange"></span>
                            <div className="flex items-center gap-1.5">
                              <Flame className="h-4 w-4 text-vibrant-orange animate-pulse" />
                              <span>Cook: <span className="text-vibrant-dark font-black">{m.cookTimeMinutes}m</span></span>
                            </div>
                          </div>

                          {/* Nutrition Stats badge stack */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold">
                              Cal: <strong className="font-extrabold text-vibrant-orange">{m.nutrition.calories} kcal</strong>
                            </div>
                            <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold">
                              Pro: <strong className="font-extrabold text-vibrant-dark">{m.nutrition.proteinGrams}g</strong>
                            </div>
                            <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold">
                              Carb: <strong className="font-extrabold text-vibrant-dark">{m.nutrition.carbsGrams}g</strong>
                            </div>
                            <div className="bg-white border border-vibrant-card-border text-vibrant-dark px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold">
                              Fiber: <strong className="font-extrabold text-[#0D9488]">{m.nutrition.fiberGrams}g</strong>
                            </div>
                          </div>

                        </div>

                        {/* Expandable Key Steps checklist inside the meal */}
                        <div className="p-6 sm:p-7 bg-white shrink">
                          <h4 className="text-[10px] font-bold text-vibrant-dark/40 uppercase tracking-widest mb-4">
                            Kitchen Prep & Searing Steps:
                          </h4>
                          <ol className="flex flex-col gap-3.5">
                            {m.keySteps.map((step, idx) => (
                              <li key={idx} className="flex gap-3 text-xs leading-relaxed text-vibrant-dark/80 align-top font-medium">
                                <span className="h-5 w-5 rounded-full bg-vibrant-orange/10 text-vibrant-orange flex items-center justify-center font-mono font-black shrink-0 text-[10px]">
                                  {idx + 1}
                                </span>
                                <span className={isMealCooked ? "text-vibrant-dark/40 italic font-mono" : ""}>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

              {/* TAB 2: STEP-BY-STEP COOKING TODO LIST */}
              {activeTab === "todos" && (
                <div className="bg-white border border-vibrant-card-border rounded-[32px] p-6 sm:p-7 shadow-xs flex flex-col gap-6" id="view-todos">
                  
                  <div className="border-b border-vibrant-card-border pb-3.5 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h2 className="font-display font-black text-xl text-vibrant-dark uppercase tracking-tight">Active Cooking Lanes</h2>
                      <p className="text-xs text-vibrant-dark/60 font-medium">Cross off chronological step blocks sequentially to streamline your cook space</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-vibrant-orange uppercase tracking-wider bg-vibrant-orange/10 px-3 py-1 rounded-full">
                        {completedTasks}/{totalTasks} Done
                      </span>
                    </div>
                  </div>

                  {/* Todo List Steps wrapper */}
                  <div className="flex flex-col gap-3.5">
                    {plan.cookingToDoList.map((item) => {
                      const isItemDone = item.isCompleted;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleToggleTodo(item.id)}
                          className={`group border rounded-[22px] p-4 sm:p-5 cursor-pointer transition-all flex items-start gap-4 ${
                            isItemDone
                              ? "bg-emerald-50/20 border-emerald-200"
                              : "bg-vibrant-bg hover:bg-white border-vibrant-card-border hover:border-vibrant-orange/30"
                          }`}
                        >
                          {/* Styled circular checkbox */}
                          <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            isItemDone
                              ? "bg-emerald-600 text-white"
                              : "border-2 border-vibrant-card-border bg-white group-hover:border-vibrant-orange"
                          }`}>
                            {isItemDone && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>

                          {/* Todo Text Details */}
                          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                                  item.mealType === "breakfast" ? "bg-orange-100 text-orange-900" :
                                  item.mealType === "lunch" ? "bg-amber-100 text-amber-900" :
                                  item.mealType === "dinner" ? "bg-purple-100 text-purple-900" :
                                  "bg-vibrant-bg text-vibrant-dark/80"
                                }`}>
                                  {item.mealType}
                                </span>
                                <h4 className={`text-sm font-bold tracking-tight ${isItemDone ? "line-through text-vibrant-dark/40" : "text-vibrant-dark"}`}>
                                  {item.title}
                                </h4>
                              </div>
                              <p className={`text-xs mt-1.5 leading-relaxed font-medium ${isItemDone ? "text-vibrant-dark/40 italic font-mono" : "text-vibrant-dark/80"}`}>
                                {item.instruction}
                              </p>
                            </div>

                            <span className="shrink-0 bg-white border border-vibrant-card-border rounded-xl px-2.5 py-1.5 text-[10px] font-bold font-mono text-vibrant-dark/70 flex items-center gap-1 shadow-2xs">
                              <Clock className="h-3.5 w-3.5 text-vibrant-orange" />
                              {item.durationMinutes}m
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Reset prompt indicator */}
                  <div className="border-t border-vibrant-card-border pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-vibrant-dark/60 font-medium gap-3">
                    <p>Cooking plans are saved locally. You can close your tab anytime.</p>
                    <button 
                      onClick={() => {
                        const allDone = plan.cookingToDoList.map(t => ({ ...t, isCompleted: true }));
                        const updated = { ...plan, cookingToDoList: allDone };
                        setPlan(updated);
                        localStorage.setItem("cooking_to_do_list_payload", JSON.stringify(updated));
                      }} 
                      className="text-vibrant-orange hover:text-[#E04F12] font-black uppercase tracking-widest text-[10px] underline cursor-pointer"
                    >
                      Complete all steps
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 3: GROCERY MARKET & SMART SUBSTITUTIONS */}
              {activeTab === "grocery" && (
                <div className="bg-white border border-vibrant-card-border rounded-[32px] p-6 sm:p-7 shadow-xs flex flex-col gap-6" id="view-grocery">
                  
                  <div className="border-b border-vibrant-card-border pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display font-black text-xl text-vibrant-dark uppercase tracking-tight">Market Grocery Checklist</h2>
                      <p className="text-xs text-vibrant-dark/60 font-medium">Cross off purchased items. Items you own in your pantry are credited free!</p>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-xs text-emerald-800 flex items-center gap-1.5 self-start font-bold shadow-2xs">
                      <HelpCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>Pantry saved you <strong className="font-extrabold text-emerald-700">₹{plan.budgetSummary.pantrySavings.toFixed(2)}</strong> today!</span>
                    </div>
                  </div>

                  {/* GROCERY CHECKLIST ITEMS */}
                  <div className="flex flex-col gap-4">
                    {plan.groceryList.map((item, index) => {
                      const isChecked = checkedGroceries[item.name] || false;
                      const hasSub = appliedSubstitutions[item.name] || false;
                      const isExpanded = expandedSubstitutions[item.name] || false;

                      // Calculate cost values
                      const displayPrice = hasSub 
                      ? Math.max(0, item.estimatedCost - (item.substitution.approxSavings || 0))
                      : item.estimatedCost;

                      return (
                        <div
                          key={index}
                          className={`border rounded-[22px] overflow-hidden transition-all ${
                            isChecked
                              ? "bg-vibrant-bg/40 border-vibrant-card-border opacity-70"
                              : item.isAvailableInPantry
                              ? "bg-vibrant-orange/[0.02] border-vibrant-orange/15 shadow-3xs"
                              : "bg-white border-vibrant-card-border hover:border-vibrant-orange/20"
                          }`}
                        >
                          {/* Inner row element */}
                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            
                            {/* Checkbox trigger block */}
                            <div className="flex items-start gap-4">
                              {item.isAvailableInPantry ? (
                                <div className="h-5 w-5 rounded-full bg-vibrant-orange text-white flex items-center justify-center text-xs shrink-0 font-black h-5 w-5 shadow-sm shadow-vibrant-orange/20" title="Available in pantry, no purchase required">
                                  ✓
                                </div>
                              ) : (
                                <button
                                  onClick={() => toggleGroceryCheck(item.name)}
                                  className={`h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                                    isChecked
                                      ? "bg-emerald-600 text-white"
                                      : "border-2 border-vibrant-card-border hover:border-vibrant-orange bg-white"
                                  }`}
                                >
                                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>
                              )}

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`text-sm font-bold tracking-tight transition-all ${
                                    isChecked ? "line-through text-vibrant-dark/40" : "text-vibrant-dark"
                                  }`}>
                                    {item.name}
                                  </h4>
                                  <span className="text-[9px] text-vibrant-dark/65 bg-vibrant-bg border border-vibrant-card-border/80 rounded-md px-2 py-0.5 font-bold uppercase tracking-wider">
                                    {item.category}
                                  </span>

                                  {item.isAvailableInPantry && (
                                    <span className="text-[9px] font-black text-vibrant-orange bg-vibrant-orange/10 uppercase rounded px-2 py-0.5">
                                      Pantry Owned (₹0.0)
                                    </span>
                                  )}

                                  {hasSub && (
                                    <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 uppercase rounded px-2 py-0.5" title="Custom substitution applied!">
                                      Sub Applied
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-vibrant-dark/60 mt-1 font-semibold">
                                  Required amount: <strong className="font-extrabold text-vibrant-dark">{item.quantity}</strong>
                                </p>
                              </div>
                            </div>

                            {/* Cost metrics and Substitution accordion togglers */}
                            <div className="flex items-center gap-3.5 ml-9 sm:ml-0 self-end sm:self-center font-display">
                              <div className="text-right">
                                {item.isAvailableInPantry ? (
                                  <span className="text-xs font-bold font-mono line-through text-vibrant-dark/30" title="Owned beforehand">₹{item.estimatedCost.toFixed(2)}</span>
                                ) : (
                                  <div className="flex flex-col">
                                    <span className={`text-sm font-black font-mono tracking-tight ${hasSub ? "text-emerald-700" : "text-vibrant-dark"}`}>
                                      ₹{displayPrice.toFixed(2)}
                                    </span>
                                    {hasSub && (
                                      <span className="text-[9px] text-vibrant-dark/40 line-through font-mono">Original: ₹{item.estimatedCost.toFixed(2)}</span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => toggleSubAccordion(item.name)}
                                className="p-1 px-3 bg-vibrant-bg border border-vibrant-card-border hover:border-vibrant-orange/50 rounded-full text-[10px] font-black text-vibrant-dark flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider"
                                title="Optimize substitution choices"
                              >
                                <ArrowLeftRight className="h-3 w-3 text-vibrant-orange" />
                                <span>Alternatives</span>
                                {isExpanded ? <ChevronUp className="h-3 w-3 text-vibrant-orange" /> : <ChevronDown className="h-3 w-3 text-vibrant-orange" />}
                              </button>
                            </div>

                          </div>

                          {/* COLLAPSIBLE ACCORDION PANEL: HEALTHY / BUDGET SUBSTITUTIONS INLINE */}
                          {isExpanded && (
                            <div className="bg-vibrant-bg px-5 py-5 border-t border-vibrant-card-border flex flex-col gap-4">
                              
                              <div className="flex items-start gap-3">
                                <Info className="h-4.5 w-4.5 text-vibrant-orange shrink-0 mt-0.5" />
                                <div className="text-xs">
                                  <p className="font-bold text-vibrant-dark">
                                    Upgrade/Alternative Choice: <span className="text-vibrant-orange font-mono font-black">{item.substitution.alternativeName}</span>
                                  </p>
                                  <p className="text-vibrant-dark/70 mt-1 leading-relaxed font-semibold">
                                    {item.substitution.reason}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-white rounded-2xl p-4 border border-vibrant-card-border shadow-2xs">
                                <div className="flex items-center gap-3 font-semibold text-vibrant-dark/80">
                                  <span className="text-[10px] uppercase font-bold tracking-wide">
                                    Budget Impact: 
                                    <strong className={`ml-1 capitalize font-black ${
                                      item.substitution.impactOnCost === "lower" ? "text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded" : "text-vibrant-orange bg-vibrant-orange/5 px-1.5 py-0.5 rounded"
                                    }`}>
                                      {item.substitution.impactOnCost} Cost
                                    </strong>
                                  </span>

                                  {item.substitution.approxSavings ? (
                                    <>
                                      <span className="h-1.5 w-1.5 rounded-full bg-vibrant-card-border"></span>
                                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-black tracking-wide">
                                        Saves you ₹{item.substitution.approxSavings.toFixed(2)}
                                      </span>
                                    </>
                                  ) : null}
                                </div>

                                {!item.isAvailableInPantry && (
                                  <button
                                    onClick={() => toggleSubstitution(item.name)}
                                    className={`py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                      hasSub
                                        ? "bg-vibrant-dark text-white hover:bg-black"
                                        : "bg-vibrant-orange text-white hover:bg-[#E04F12] shadow-sm shadow-vibrant-orange/10"
                                    }`}
                                  >
                                    {hasSub ? "Revoke Swap" : "Swap to Substitution"}
                                  </button>
                                )}
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* TAB 4: BUDGET FEASIBILITY & RECOMMENDATOR */}
              {activeTab === "budget" && (
                <div className="bg-white border border-vibrant-card-border rounded-[32px] p-6 sm:p-7 shadow-xs flex flex-col gap-6" id="view-budget">
                  
                  <div className="border-b border-vibrant-card-border pb-3.5">
                    <h2 className="font-display font-black text-xl text-vibrant-dark uppercase tracking-tight">Budget Feasibility Dashboard</h2>
                    <p className="text-xs text-vibrant-dark/60 font-medium font-sans">Smart cost analysis and dynamic tuning to match local grocery projections</p>
                  </div>

                  {/* CORE STATISTICS BENTO BLOCK */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="budget-bento-grid">
                    
                    <div className="bg-vibrant-dark text-white p-5 rounded-[22px] flex flex-col justify-between shadow-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#F0EBE8]/70">Total Purchase Spent</span>
                      <div className="my-3">
                        <span className="text-3xl font-display font-black font-mono tracking-tight text-vibrant-orange">₹{currentTotal.toFixed(2)}</span>
                        {substitutionSavings > 0 && (
                          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                            With ₹{substitutionSavings.toFixed(2)} savings active
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-[#F0EBE8]/60 font-sans leading-relaxed">
                        Based on local average prices for ingredients not owned.
                      </span>
                    </div>

                    <div className="bg-[#FEF9F6] text-vibrant-dark p-5 rounded-[22px] flex flex-col justify-between border border-vibrant-card-border shadow-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-vibrant-dark/60">Pantry optimization</span>
                      <div className="my-3">
                        <span className="text-3xl font-display font-black font-mono tracking-tight text-vibrant-dark">₹{plan.budgetSummary.pantrySavings.toFixed(2)}</span>
                        <p className="text-[10px] text-emerald-700 mt-1 font-semibold">
                          Calculated from owned items!
                        </p>
                      </div>
                      <span className="text-[10px] text-vibrant-dark/70 font-sans leading-relaxed">
                        You didn't have to buy these since they were labeled as household items.
                      </span>
                    </div>

                    <div className="bg-vibrant-orange/10 text-vibrant-dark p-5 rounded-[22px] flex flex-col justify-between border border-vibrant-orange/15 shadow-xs">
                      <span className="text-[10px] uppercase font-black tracking-widest text-vibrant-orange/70">Cumulative Savings</span>
                      <div className="my-3">
                        <span className="text-3xl font-display font-black font-mono tracking-tight text-vibrant-orange">₹{totalSavedOverall.toFixed(2)}</span>
                        <p className="text-[10px] text-vibrant-dark/60 mt-1 font-semibold">
                          Total pocket money retained
                        </p>
                      </div>
                      <span className="text-[10px] text-vibrant-dark/70 font-sans leading-relaxed">
                        Combined savings from your preexisting pantry ingredients + active substitution swapping.
                      </span>
                    </div>

                  </div>

                  {/* PRICE SENSITIVITY INDEX (BUDGET TIER BAR GRAPH) */}
                  <div className="bg-vibrant-bg border border-vibrant-card-border rounded-[22px] p-5 sm:p-6 flex flex-col gap-4">
                    
                    <div>
                      <h4 className="text-xs font-black text-vibrant-dark uppercase tracking-wider mb-1">
                        Alternative Tier Scenario Benchmarks
                      </h4>
                      <p className="text-xs text-vibrant-dark/60 font-medium">
                        Estimated day-to-day ranges representing local marketplace grocery deviations:
                      </p>
                    </div>

                    <div className="flex flex-col gap-4.5 mt-2">
                      
                      {/* Economy Tier */}
                      <div className="flex items-center gap-4">
                        <span className="w-24 text-xs font-bold text-vibrant-dark/70">Economy:</span>
                        <div className="flex-1 bg-white h-7 rounded-xl overflow-hidden relative border border-vibrant-card-border shadow-2xs">
                          <div 
                            className="bg-emerald-600/10 h-full flex items-center justify-end px-3 transition-all"
                            style={{ width: `${Math.min(100, (plan.budgetSummary.tierBreakdowns.economy / Math.max(1, plan.budgetSummary.tierBreakdowns.premium)) * 100)}%` }}
                          >
                            <span className="text-[11px] font-black font-mono text-emerald-800 absolute left-3">
                              ₹{plan.budgetSummary.tierBreakdowns.economy.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-lg">
                          Best Budget
                        </span>
                      </div>

                      {/* Balanced Tier */}
                      <div className="flex items-center gap-4">
                        <span className="w-24 text-xs font-bold text-vibrant-dark/70">Balanced:</span>
                        <div className="flex-1 bg-white h-7 rounded-xl overflow-hidden relative border border-vibrant-card-border shadow-2xs">
                          <div 
                            className="bg-vibrant-orange/20 h-full flex items-center justify-end px-3 transition-all"
                            style={{ width: `${Math.min(100, (plan.budgetSummary.tierBreakdowns.balanced / Math.max(1, plan.budgetSummary.tierBreakdowns.premium)) * 100)}%` }}
                          >
                            <span className="text-[11px] font-black font-mono text-vibrant-orange absolute left-3">
                              ₹{plan.budgetSummary.tierBreakdowns.balanced.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-vibrant-orange font-extrabold bg-vibrant-orange/10 px-2.5 py-1 rounded-lg">
                          Typical Case
                        </span>
                      </div>

                      {/* Premium Tier */}
                      <div className="flex items-center gap-4">
                        <span className="w-24 text-xs font-bold text-vibrant-dark/70">Premium:</span>
                        <div className="flex-1 bg-white h-7 rounded-xl overflow-hidden relative border border-vibrant-card-border shadow-2xs">
                          <div 
                            className="bg-vibrant-dark/10 h-full flex items-center justify-end px-3 transition-all"
                            style={{ width: `${Math.min(100, (plan.budgetSummary.tierBreakdowns.premium / Math.max(1, plan.budgetSummary.tierBreakdowns.premium)) * 100)}%` }}
                          >
                            <span className="text-[11px] font-black font-mono text-vibrant-dark absolute left-3">
                              ₹{plan.budgetSummary.tierBreakdowns.premium.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-vibrant-dark/60 font-bold bg-vibrant-bg border border-vibrant-card-border px-2.5 py-1 rounded-lg">
                          Spurge / Organic
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* AI RECOMMENDATION BOX */}
                  <div className="border border-vibrant-card-border bg-vibrant-orange/[0.04] p-5 sm:p-6 rounded-[24px] flex items-start gap-4" id="ai-recommends">
                    <div className="p-3 bg-vibrant-orange text-white rounded-2xl shadow-sm shadow-vibrant-orange/20">
                      <ChefHat className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-vibrant-orange uppercase tracking-wider">
                        Smart Kitchen Assistant Recommendation
                      </h4>
                      <p className="text-xs text-vibrant-dark/95 leading-relaxed mt-2 font-medium">
                        {plan.budgetSummary.budgetRecommendation}
                      </p>
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-white border border-vibrant-card-border text-vibrant-dark/80 font-mono px-2.5 py-1 rounded-lg shadow-2xs">
                          Available: {plan.groceryList.length} options
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-white border border-vibrant-card-border text-emerald-800 font-mono px-2.5 py-1 rounded-lg shadow-2xs">
                          Substitution savings accrued: ₹{substitutionSavings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 px-4 py-6 text-center text-xs text-zinc-400 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-white" id="app-footer">
        <p>© 2026 Cooking To-Do List & Meal Planner. Built dynamically utilizing server-side Gemini models.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCheckedGroceries({});
              setAppliedSubstitutions({});
              setCompletedMeals({});
            }}
            className="hover:text-zinc-650 hover:underline transition-colors font-mono"
          >
            Clear Checked States
          </button>
          <span>•</span>
          <p className="text-amber-600 font-mono">ajayvarma02626@gmail.com</p>
        </div>
      </footer>

    </div>
  );
}
