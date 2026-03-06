import { describe, expect, it } from "vitest";

import type { CartItemInput } from "../src/schemas/cart";
import type { Product } from "../src/schemas/catalog";
import {
  PricingValidationError,
  calculateConfiguredItem,
  calculateOrderSummary,
  createProductLookup,
} from "../src/pricing";

const proteinPizza: Product = {
  id: "pizza-protein-blast",
  slug: "protein-blast",
  type: "pizza",
  category: "high_protein",
  name: {
    en: "Protein Blast",
    hu: "Feherje bomba",
  },
  description: {
    en: "High protein pizza with lean toppings.",
    hu: "Magas feherjetartalmu pizza sovany feltetekkel.",
  },
  currency: "HUF",
  basePriceMinor: 3490,
  baseMacros: {
    calories: 700,
    protein: 42,
    carbs: 70,
    fat: 22,
  },
  allergens: ["gluten", "milk"],
  badges: ["high-protein"],
  optionGroups: [
    {
      id: "size",
      type: "size",
      name: {
        en: "Size",
        hu: "Meret",
      },
      selectionMode: "single",
      minSelections: 1,
      maxSelections: 1,
      options: [
        {
          id: "medium",
          name: {
            en: "Medium",
            hu: "Kozepes",
          },
          priceDeltaMinor: 0,
          macrosDelta: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          isDefault: true,
        },
        {
          id: "large",
          name: {
            en: "Large",
            hu: "Nagy",
          },
          priceDeltaMinor: 800,
          macrosDelta: {
            calories: 220,
            protein: 12,
            carbs: 20,
            fat: 8,
          },
          isDefault: false,
        },
      ],
    },
    {
      id: "protein_addons",
      type: "protein_addon",
      name: {
        en: "Protein Add-ons",
        hu: "Extra feherje",
      },
      selectionMode: "multiple",
      minSelections: 0,
      maxSelections: 2,
      options: [
        {
          id: "chicken",
          name: {
            en: "Chicken",
            hu: "Csirke",
          },
          priceDeltaMinor: 490,
          macrosDelta: {
            calories: 130,
            protein: 24,
            carbs: 0,
            fat: 2,
          },
          isDefault: false,
        },
        {
          id: "turkey",
          name: {
            en: "Turkey",
            hu: "Pulyka",
          },
          priceDeltaMinor: 550,
          macrosDelta: {
            calories: 150,
            protein: 26,
            carbs: 0,
            fat: 3,
          },
          isDefault: false,
        },
      ],
    },
  ],
  isActive: true,
};

describe("calculateConfiguredItem", () => {
  it("calculates unit and line totals from selected options", () => {
    const input: CartItemInput = {
      productId: proteinPizza.id,
      quantity: 2,
      selections: [
        {
          groupId: "size",
          optionIds: ["large"],
        },
        {
          groupId: "protein_addons",
          optionIds: ["chicken"],
        },
      ],
    };

    const result = calculateConfiguredItem(proteinPizza, input);

    expect(result.currency).toBe("HUF");
    expect(result.unitPriceMinor).toBe(4780);
    expect(result.linePriceMinor).toBe(9560);
    expect(result.unitMacros).toEqual({
      calories: 1050,
      protein: 78,
      carbs: 90,
      fat: 32,
    });
    expect(result.lineMacros).toEqual({
      calories: 2100,
      protein: 156,
      carbs: 180,
      fat: 64,
    });
  });

  it("throws when required group selection is missing", () => {
    const input: CartItemInput = {
      productId: proteinPizza.id,
      quantity: 1,
      selections: [],
    };

    expect(() => calculateConfiguredItem(proteinPizza, input)).toThrow(PricingValidationError);

    try {
      calculateConfiguredItem(proteinPizza, input);
    } catch (error) {
      expect(error).toBeInstanceOf(PricingValidationError);
      if (error instanceof PricingValidationError) {
        expect(error.issues.some((issue) => issue.code === "SELECTION_TOO_FEW")).toBe(true);
      }
    }
  });

  it("throws when option id is unknown", () => {
    const input: CartItemInput = {
      productId: proteinPizza.id,
      quantity: 1,
      selections: [
        {
          groupId: "size",
          optionIds: ["giant"],
        },
      ],
    };

    expect(() => calculateConfiguredItem(proteinPizza, input)).toThrow(PricingValidationError);
  });
});

describe("calculateOrderSummary", () => {
  it("calculates summary over multiple items", () => {
    const lookup = createProductLookup([proteinPizza]);
    const items: CartItemInput[] = [
      {
        productId: proteinPizza.id,
        quantity: 1,
        selections: [
          {
            groupId: "size",
            optionIds: ["medium"],
          },
        ],
      },
      {
        productId: proteinPizza.id,
        quantity: 1,
        selections: [
          {
            groupId: "size",
            optionIds: ["large"],
          },
          {
            groupId: "protein_addons",
            optionIds: ["turkey"],
          },
        ],
      },
    ];

    const summary = calculateOrderSummary(lookup, items);
    expect(summary.currency).toBe("HUF");
    expect(summary.subtotalMinor).toBe(8330);
    expect(summary.totalMacros.protein).toBe(122);
  });

  it("throws when product is missing from lookup", () => {
    expect(() =>
      calculateOrderSummary({}, [{ productId: "missing", quantity: 1, selections: [] }])
    ).toThrow(PricingValidationError);
  });
});
