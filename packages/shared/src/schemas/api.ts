import { z } from "zod";

import { cartItemInputSchema, cartSnapshotItemSchema } from "./cart";
import { menuSchema, productSchema } from "./catalog";
import { currencySchema, idSchema, moneyMinorSchema, orderStatusSchema } from "./common";
import { checkoutPayloadSchema, orderSchema, orderStatusEventSchema } from "./order";

export const getMenuResponseSchema = menuSchema;
export const getProductResponseSchema = productSchema;

export const createOrderRequestSchema = z.object({
  items: z.array(cartItemInputSchema).min(1),
  checkout: checkoutPayloadSchema,
});

export const createOrderResponseSchema = z.object({
  orderId: idSchema,
  orderNumber: z.string().trim().min(1),
  acceptedAt: z.string().datetime({ offset: true }),
  currency: currencySchema,
  items: z.array(cartSnapshotItemSchema),
  totalMinor: moneyMinorSchema,
});

export const getOrderResponseSchema = orderSchema;

export const getOrderEventsResponseSchema = z.object({
  orderId: idSchema,
  events: z.array(orderStatusEventSchema),
});

export const getAdminOrdersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

export const updateAdminOrderStatusRequestSchema = z.object({
  status: orderStatusSchema,
  note: z.string().trim().max(280).optional(),
});

export const updateAdminOrderStatusResponseSchema = z.object({
  orderId: idSchema,
  status: orderStatusSchema,
  updatedAt: z.string().datetime({ offset: true }),
});

export type GetMenuResponse = z.infer<typeof getMenuResponseSchema>;
export type GetProductResponse = z.infer<typeof getProductResponseSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
export type GetOrderResponse = z.infer<typeof getOrderResponseSchema>;
export type GetOrderEventsResponse = z.infer<typeof getOrderEventsResponseSchema>;
export type GetAdminOrdersResponse = z.infer<typeof getAdminOrdersResponseSchema>;
export type UpdateAdminOrderStatusRequest = z.infer<typeof updateAdminOrderStatusRequestSchema>;
export type UpdateAdminOrderStatusResponse = z.infer<typeof updateAdminOrderStatusResponseSchema>;
