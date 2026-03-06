export const menu = {
  title: "Menu",
  searchPlaceholder: "Search pizzas, toppings, drinks...",
  filters: {
    highProtein: "High protein",
    vegetarian: "Vegetarian",
    spicy: "Spicy",
    allergenFree: "Allergen aware",
  },
  states: {
    loading: "Loading menu...",
    empty: "No products match your filters.",
    error: "Failed to load menu.",
  },
} as const;
