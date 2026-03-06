export const checkout = {
  title: "Pénztár",
  steps: {
    details: "Adatok",
    deliveryAndPayment: "Szállítás és fizetés",
    review: "Áttekintés",
  },
  fields: {
    fullName: "Teljes név",
    email: "Email",
    phone: "Telefonszám",
    city: "Város",
    postalCode: "Irányítószám",
    addressLine1: "Cím 1",
    addressLine2: "Cím 2",
    note: "Megjegyzés",
    paymentMethod: "Fizetési mód",
  },
} as const;
