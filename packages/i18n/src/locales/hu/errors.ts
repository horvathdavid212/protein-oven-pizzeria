export const errors = {
  generic: {
    unknown: "Hiba történt. Próbáld újra.",
    network: "Hálózati hiba. Ellenőrizd a kapcsolatot.",
  },
  validation: {
    invalidPhone: "Adj meg érvényes telefonszámot.",
    requiredField: "Ez a mező kötelező.",
    invalidEmail: "Adj meg érvényes email címet.",
  },
  order: {
    notFound: "A rendelés nem található.",
    pricingMismatch: "A kosár változott. Ellenőrizd a fizetés előtt.",
    couponInvalid: "Érvénytelen kuponkód.",
  },
} as const;
