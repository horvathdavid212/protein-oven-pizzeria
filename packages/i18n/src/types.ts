export type TranslationValue = string | TranslationMap;

export interface TranslationMap {
  readonly [key: string]: TranslationValue;
}

type DotJoin<Left extends string, Right extends string> = `${Left}.${Right}`;

export type LeafKeyPaths<T> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Key
    : T[Key] extends TranslationMap
      ? DotJoin<Key, LeafKeyPaths<T[Key]>>
      : never;
}[keyof T & string];

export type TranslationShape<T> = {
  readonly [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends TranslationMap
      ? TranslationShape<T[Key]>
      : never;
};

export type TranslationParams = Record<string, string | number>;
