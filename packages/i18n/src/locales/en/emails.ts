export const emails = {
  orderConfirmed: {
    subject: "Order #{orderNumber} confirmed",
    greeting: "Hi {name},",
    body: "Thanks for your order. You can track it with this link: {trackingUrl}",
  },
} as const;
