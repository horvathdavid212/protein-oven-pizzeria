import { z } from "zod";

import {
  OPTION_GROUP_TYPES,
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
  SELECTION_MODES,
} from "../constants";
import {
  allergenSchema,
  currencySchema,
  idSchema,
  localizedTextSchema,
  macrosSchema,
  moneyMinorSchema,
  slugSchema,
} from "./common";

export const productTypeSchema = z.enum(PRODUCT_TYPES);
export const productCategorySchema = z.enum(PRODUCT_CATEGORIES);
export const optionGroupTypeSchema = z.enum(OPTION_GROUP_TYPES);
export const selectionModeSchema = z.enum(SELECTION_MODES);

export const productOptionSchema = z.object({
  id: idSchema,
  name: localizedTextSchema,
  priceDeltaMinor: moneyMinorSchema.default(0),
  macrosDelta: macrosSchema.default({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  }),
  isDefault: z.boolean().default(false),
});

export const optionGroupSchema = z
  .object({
    id: idSchema,
    type: optionGroupTypeSchema,
    name: localizedTextSchema,
    selectionMode: selectionModeSchema,
    minSelections: z.number().int().nonnegative().default(0),
    maxSelections: z.number().int().positive().default(1),
    options: z.array(productOptionSchema).min(1),
  })
  .superRefine((group, ctx) => {
    if (group.maxSelections < group.minSelections) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maxSelections must be greater than or equal to minSelections",
        path: ["maxSelections"],
      });
    }

    if (group.selectionMode === "single" && group.maxSelections > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "single selection groups cannot allow more than one option",
        path: ["maxSelections"],
      });
    }

    const optionIds = new Set<string>();
    let defaultCount = 0;

    for (const option of group.options) {
      if (optionIds.has(option.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate option id: ${option.id}`,
          path: ["options"],
        });
      }
      optionIds.add(option.id);
      if (option.isDefault) {
        defaultCount += 1;
      }
    }

    if (defaultCount > group.maxSelections) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "defaults exceed maxSelections",
        path: ["options"],
      });
    }
  });

export const productSchema = z
  .object({
    id: idSchema,
    slug: slugSchema,
    type: productTypeSchema,
    category: productCategorySchema,
    name: localizedTextSchema,
    description: localizedTextSchema.optional(),
    imageUrl: z.string().trim().url().optional(),
    currency: currencySchema.default("HUF"),
    basePriceMinor: moneyMinorSchema,
    baseMacros: macrosSchema,
    allergens: z.array(allergenSchema).default([]),
    badges: z.array(z.string().trim().min(1)).default([]),
    optionGroups: z.array(optionGroupSchema).default([]),
    isActive: z.boolean().default(true),
  })
  .superRefine((product, ctx) => {
    const groupIds = new Set<string>();
    for (const group of product.optionGroups) {
      if (groupIds.has(group.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate option group id: ${group.id}`,
          path: ["optionGroups"],
        });
      }
      groupIds.add(group.id);
    }
  });

export const menuSchema = z.object({
  products: z.array(productSchema),
  fetchedAt: z.string().datetime({ offset: true }).optional(),
});

export type ProductType = z.infer<typeof productTypeSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type OptionGroupType = z.infer<typeof optionGroupTypeSchema>;
export type SelectionMode = z.infer<typeof selectionModeSchema>;
export type ProductOption = z.infer<typeof productOptionSchema>;
export type OptionGroup = z.infer<typeof optionGroupSchema>;
export type Product = z.infer<typeof productSchema>;
export type Menu = z.infer<typeof menuSchema>;
