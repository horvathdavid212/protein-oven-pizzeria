export const menu = {
  title: "Menü",
  searchPlaceholder: "Keress pizzát, feltétet, italt...",
  filters: {
    highProtein: "Magas fehérje",
    vegetarian: "Vega",
    spicy: "Csípős",
    allergenFree: "Allergénbarát",
  },
  states: {
    loading: "Menü betöltése...",
    empty: "Nincs találat a szűrőkre.",
    error: "Nem sikerült betölteni a menüt.",
  },
} as const;
