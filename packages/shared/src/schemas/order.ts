import { z } from "zod";

import { cartSnapshotItemSchema } from "./cart";
import {
  currencySchema,
  deliveryMethodSchema,
  idSchema,
  isoDateTimeSchema,
  macrosSchema,
  moneyMinorSchema,
  orderStatusSchema,
  paymentMethodSchema,
} from "./common";

export const customerDetailsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().min(6).max(40),
});

export const addressSchema = z.object({
  city: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().min(1).max(20),
  line1: z.string().trim().min(1).max(160),
  line2: z.string().trim().max(160).optional(),
  floor: z.string().trim().max(40).optional(),
  note: z.string().trim().max(280).optional(),
});

export const checkoutPayloadSchema = z.object({
  customer: customerDetailsSchema,
  deliveryMethod: deliveryMethodSchema,
  address: addressSchema.optional(),
  paymentMethod: paymentMethodSchema,
  note: z.string().trim().max(280).optional(),
});

export const orderStatusEventSchema = z.object({
  id: idSchema,
  orderId: idSchema,
  status: orderStatusSchema,
  createdAt: isoDateTimeSchema,
  note: z.string().trim().max(280).optional(),
});

export const orderSchema = z.object({
  id: idSchema,
  orderNumber: z.string().trim().min(1),
  status: orderStatusSchema,
  items: z.array(cartSnapshotItemSchema),
  currency: currencySchema,
  subtotalMinor: moneyMinorSchema,
  deliveryFeeMinor: moneyMinorSchema,
  totalMinor: moneyMinorSchema,
  totalMacros: macrosSchema,
  checkout: checkoutPayloadSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
export type OrderStatusEvent = z.infer<typeof orderStatusEventSchema>;
export type Order = z.infer<typeof orderSchema>;
