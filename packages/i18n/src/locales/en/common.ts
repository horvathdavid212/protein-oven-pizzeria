export const common = {
  appName: "Protein Oven Pizzeria",
  actions: {
    add: "Add",
    remove: "Remove",
    retry: "Retry",
    close: "Close",
    save: "Save",
    continue: "Continue",
    back: "Back",
    placeOrder: "Place order",
  },
  labels: {
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    subtotal: "Subtotal",
    total: "Total",
    quantity: "Quantity",
  },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    viewCart: "View cart",
    itemCount: "{count} item(s)",
  },
} as const;
