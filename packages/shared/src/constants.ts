export const LOCALES = ["en", "hu"] as const;
export const SUPPORTED_CURRENCIES = ["HUF", "EUR", "USD"] as const;

export const PRODUCT_TYPES = ["pizza", "drink", "sauce"] as const;
export const PRODUCT_CATEGORIES = [
  "high_protein",
  "classic",
  "vegetarian",
  "spicy",
  "sides",
  "drinks",
] as const;

export const OPTION_GROUP_TYPES = ["size", "dough", "sauce", "protein_addon", "topping"] as const;
export const SELECTION_MODES = ["single", "multiple"] as const;

export const ALLERGENS = ["gluten", "milk", "egg", "soy", "mustard", "nuts"] as const;

export const DELIVERY_METHODS = ["delivery", "pickup"] as const;
export const PAYMENT_METHODS = ["cash", "card_on_delivery", "card_online"] as const;

export const ORDER_STATUSES = ["received", "prep", "delivery", "done"] as const;
