export const errors = {
  generic: {
    unknown: "Something went wrong. Please try again.",
    network: "Network error. Check your connection.",
  },
  validation: {
    invalidPhone: "Please enter a valid phone number.",
    requiredField: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
  },
  order: {
    notFound: "Order not found.",
    pricingMismatch: "Your cart changed. Please review before checkout.",
    couponInvalid: "Coupon code is invalid.",
  },
} as const;
