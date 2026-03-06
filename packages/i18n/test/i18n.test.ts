import { describe, expect, it } from "vitest";

import { assertDictionaryParity } from "../src/checks";
import { listTranslationKeys, resolveLocale, t, translate } from "../src/messages";
import type { TranslationMap } from "../src/types";

describe("locale resolution", () => {
  it("falls back to default locale for unknown input", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("hu")).toBe("hu");
    expect(resolveLocale("de")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
  });
});

describe("translation helper", () => {
  it("translates known keys and interpolates params", () => {
    expect(t("en", "tracking.etaHint", { etaMinutes: 24 })).toBe("Estimated arrival: 24 min");
    expect(t("hu", "tracking.etaHint", { etaMinutes: 24 })).toBe("Várható érkezés: 24 perc");
  });

  it("supports string locale input via translate()", () => {
    expect(translate("hu", "common.actions.placeOrder")).toBe("Rendelés leadása");
    expect(translate("de", "common.actions.placeOrder")).toBe("Place order");
  });
});

describe("dictionary checks", () => {
  it("lists leaf translation keys", () => {
    const keys = listTranslationKeys();
    expect(keys).toContain("common.actions.add");
    expect(keys).toContain("emails.orderConfirmed.subject");
  });

  it("throws when dictionary keys are out of sync", () => {
    const base: TranslationMap = {
      section: {
        a: "A",
        b: "B",
      },
    };
    const broken: TranslationMap = {
      section: {
        a: "A",
        c: "C",
      },
    };

    expect(() => assertDictionaryParity(base, broken, "base", "broken")).toThrow(
      "Translation dictionaries are out of sync."
    );
  });
});
