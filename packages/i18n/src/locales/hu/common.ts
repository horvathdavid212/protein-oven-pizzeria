export const common = {
  appName: "Protein Oven Pizzeria",
  actions: {
    add: "Hozzáad",
    remove: "Töröl",
    retry: "Újrapróbál",
    close: "Bezár",
    save: "Mentés",
    continue: "Tovább",
    back: "Vissza",
    placeOrder: "Rendelés leadása",
  },
  labels: {
    calories: "Kalória",
    protein: "Fehérje",
    carbs: "Szénhidrát",
    fat: "Zsír",
    subtotal: "Részösszeg",
    total: "Végösszeg",
    quantity: "Mennyiség",
  },
  cart: {
    title: "Kosarad",
    empty: "A kosarad üres.",
    viewCart: "Kosár megtekintése",
    itemCount: "{count} tétel",
  },
} as const;
