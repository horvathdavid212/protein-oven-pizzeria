import { LOCALES as SHARED_LOCALES } from "../../shared/src/constants";
import { assertDictionaryParity, collectLeafKeys } from "./checks";
import { en } from "./locales/en";
import { hu } from "./locales/hu";
import type { LeafKeyPaths, TranslationMap, TranslationParams, TranslationShape, TranslationValue, } from "./types";

export const LOCALES = SHARED_LOCALES;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const FALLBACK_LOCALE: Locale = "en";

export type MessageDictionary = TranslationShape<typeof en>;
export type TranslationKey = LeafKeyPaths<MessageDictionary>;

const dictionaries: Record<Locale, MessageDictionary> = {
  en,
  hu,
};

assertDictionaryParity(
  dictionaries.en as TranslationMap,
  dictionaries.hu as TranslationMap,
  "en",
  "hu"
);

const getByPath = (dictionary: TranslationMap, key: string): string | undefined => {
  let current: TranslationValue | undefined = dictionary;

  for (const segment of key.split(".")) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
};

const interpolate = (template: string, params: TranslationParams | undefined): string => {
  if (!params) {
    return template;
  }

  return template.replace(/\{([^}]+)\}/g, (_match, token) => {
    const value = params[token];
    return value === undefined ? `{${token}}` : String(value);
  });
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const resolveLocale = (value: string | null | undefined): Locale => {
  if (typeof value !== "string") {
    return DEFAULT_LOCALE;
  }

  return isLocale(value) ? value : DEFAULT_LOCALE;
};

export const getDictionary = (locale: Locale): MessageDictionary => dictionaries[locale];

export const listTranslationKeys = (): TranslationKey[] =>
  collectLeafKeys(dictionaries.en as TranslationMap) as TranslationKey[];

export const t = (locale: Locale, key: TranslationKey, params?: TranslationParams): string => {
  const template =
    getByPath(dictionaries[locale] as TranslationMap, key) ??
    getByPath(dictionaries[FALLBACK_LOCALE] as TranslationMap, key);

  if (!template) {
    return key;
  }

  return interpolate(template, params);
};

export const translate = (
  localeInput: string | null | undefined,
  key: TranslationKey,
  params?: TranslationParams
): string => t(resolveLocale(localeInput), key, params);
