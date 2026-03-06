export const emails = {
  orderConfirmed: {
    subject: "#{orderNumber} rendelés megerősítve",
    greeting: "Szia {name},",
    body: "Köszönjük a rendelésed. Itt tudod követni: {trackingUrl}",
  },
} as const;
