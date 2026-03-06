export const tracking = {
  title: "Track order",
  etaHint: "Estimated arrival: {etaMinutes} min",
  statuses: {
    received: "Order received",
    prep: "Preparing",
    bake: "Baking",
    delivery: "Out for delivery",
    done: "Delivered",
  },
} as const;
