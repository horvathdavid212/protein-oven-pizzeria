import { z } from "zod";

import { currencySchema, idSchema, macrosSchema, moneyMinorSchema } from "./common";

export const selectionInputSchema = z
  .object({
    groupId: idSchema,
    optionIds: z.array(idSchema).min(1),
  })
  .superRefine((selection, ctx) => {
    const unique = new Set(selection.optionIds);
    if (unique.size !== selection.optionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "optionIds must not contain duplicates",
        path: ["optionIds"],
      });
    }
  });

export const cartItemInputSchema = z
  .object({
    productId: idSchema,
    quantity: z.number().int().min(1).max(99).default(1),
    selections: z.array(selectionInputSchema).default([]),
  })
  .superRefine((item, ctx) => {
    const uniqueGroups = new Set(item.selections.map((selection) => selection.groupId));
    if (uniqueGroups.size !== item.selections.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "selections must not contain duplicate groupId values",
        path: ["selections"],
      });
    }
  });

export const cartSnapshotItemSchema = z.object({
  productId: idSchema,
  quantity: z.number().int().positive(),
  selectedOptions: z.array(selectionInputSchema),
  currency: currencySchema,
  unitPriceMinor: moneyMinorSchema,
  linePriceMinor: moneyMinorSchema,
  unitMacros: macrosSchema,
  lineMacros: macrosSchema,
});

export type SelectionInput = z.infer<typeof selectionInputSchema>;
export type CartItemInput = z.infer<typeof cartItemInputSchema>;
export type CartSnapshotItem = z.infer<typeof cartSnapshotItemSchema>;
