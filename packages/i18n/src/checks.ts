import type { TranslationMap, TranslationValue } from "./types";

const isTranslationMap = (value: TranslationValue): value is TranslationMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const collectLeafKeysInternal = (dictionary: TranslationMap, prefix = ""): string[] => {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(dictionary)) {
    const nextPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      keys.push(nextPath);
      continue;
    }

    if (isTranslationMap(value)) {
      keys.push(...collectLeafKeysInternal(value, nextPath));
    }
  }

  return keys;
};

export const collectLeafKeys = (dictionary: TranslationMap): string[] =>
  collectLeafKeysInternal(dictionary).sort();

export const assertDictionaryParity = (
  baseDictionary: TranslationMap,
  targetDictionary: TranslationMap,
  baseName: string,
  targetName: string
): void => {
  const baseKeys = new Set(collectLeafKeys(baseDictionary));
  const targetKeys = new Set(collectLeafKeys(targetDictionary));

  const missingInTarget: string[] = [];
  const extraInTarget: string[] = [];

  for (const key of baseKeys) {
    if (!targetKeys.has(key)) {
      missingInTarget.push(key);
    }
  }

  for (const key of targetKeys) {
    if (!baseKeys.has(key)) {
      extraInTarget.push(key);
    }
  }

  if (missingInTarget.length === 0 && extraInTarget.length === 0) {
    return;
  }

  const parts: string[] = [];
  if (missingInTarget.length > 0) {
    parts.push(`${targetName} is missing keys from ${baseName}: ${missingInTarget.join(", ")}`);
  }

  if (extraInTarget.length > 0) {
    parts.push(
      `${targetName} has extra keys not present in ${baseName}: ${extraInTarget.join(", ")}`
    );
  }

  throw new Error(`Translation dictionaries are out of sync. ${parts.join(" | ")}`);
};
