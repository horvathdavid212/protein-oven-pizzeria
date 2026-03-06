import { z } from "zod";

import {
  ALLERGENS,
  DELIVERY_METHODS,
  LOCALES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  SUPPORTED_CURRENCIES,
} from "../constants";

const textSchema = z.string().trim().min(1);
export const idSchema = z.string().trim().min(1);
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9-]+$/);
export const moneyMinorSchema = z.number().int().nonnegative();

export const localeSchema = z.enum(LOCALES);
export const currencySchema = z.enum(SUPPORTED_CURRENCIES);
export const localizedTextSchema = z
  .object(
    Object.fromEntries(LOCALES.map((l) => [l, textSchema])) as Record<
      (typeof LOCALES)[number],
      typeof textSchema
    >
  )
  .strict();

export const macrosSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
  fat: z.number().nonnegative(),
});

export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const allergenSchema = z.enum(ALLERGENS);
export const deliveryMethodSchema = z.enum(DELIVERY_METHODS);
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);
export const orderStatusSchema = z.enum(ORDER_STATUSES);

export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type MacroNutrients = z.infer<typeof macrosSchema>;
export type Locale = z.infer<typeof localeSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Allergen = z.infer<typeof allergenSchema>;
export type DeliveryMethod = z.infer<typeof deliveryMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
