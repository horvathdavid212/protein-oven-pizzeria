import type { MacroNutrients } from "../schemas/common";

export const zeroMacros = (): MacroNutrients => ({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
});

export const addMacros = (a: MacroNutrients, b: MacroNutrients): MacroNutrients => ({
  calories: a.calories + b.calories,
  protein: a.protein + b.protein,
  carbs: a.carbs + b.carbs,
  fat: a.fat + b.fat,
});

export const multiplyMacros = (macros: MacroNutrients, multiplier: number): MacroNutrients => ({
  calories: macros.calories * multiplier,
  protein: macros.protein * multiplier,
  carbs: macros.carbs * multiplier,
  fat: macros.fat * multiplier,
});

export const roundMacros = (macros: MacroNutrients, fractionDigits = 2): MacroNutrients => {
  const scale = 10 ** fractionDigits;
  return {
    calories: Math.round(macros.calories * scale) / scale,
    protein: Math.round(macros.protein * scale) / scale,
    carbs: Math.round(macros.carbs * scale) / scale,
    fat: Math.round(macros.fat * scale) / scale,
  };
};
