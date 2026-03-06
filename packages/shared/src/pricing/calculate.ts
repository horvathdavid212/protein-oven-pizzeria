import type { CartItemInput, SelectionInput } from "../schemas/cart";
import { cartItemInputSchema } from "../schemas/cart";
import type { Product, ProductOption } from "../schemas/catalog";
import { productSchema } from "../schemas/catalog";
import type { Currency, MacroNutrients } from "../schemas/common";
import { addMacros, multiplyMacros, roundMacros, zeroMacros } from "../utils/macros";
import { type PricingIssue, PricingValidationError } from "./errors";

export interface CalculatedSelection {
  groupId: string;
  optionIds: string[];
  priceDeltaMinor: number;
  macrosDelta: MacroNutrients;
}

export interface CalculatedCartItem {
  productId: string;
  quantity: number;
  selectedOptions: SelectionInput[];
  currency: Currency;
  unitPriceMinor: number;
  linePriceMinor: number;
  unitMacros: MacroNutrients;
  lineMacros: MacroNutrients;
  resolvedSelections: CalculatedSelection[];
}

export interface CalculatedOrderSummary {
  items: CalculatedCartItem[];
  currency: Currency;
  subtotalMinor: number;
  totalMacros: MacroNutrients;
}

const findOption = (groupOptions: ProductOption[], optionId: string): ProductOption | undefined =>
  groupOptions.find((option) => option.id === optionId);

export const calculateConfiguredItem = (
  rawProduct: Product,
  rawCartItem: CartItemInput
): CalculatedCartItem => {
  const product = productSchema.parse(rawProduct);
  const cartItem = cartItemInputSchema.parse(rawCartItem);

  const issues: PricingIssue[] = [];
  const groupById = new Map(product.optionGroups.map((group) => [group.id, group]));
  const selectionMap = new Map<string, string[]>();

  for (const selection of cartItem.selections) {
    const group = groupById.get(selection.groupId);

    if (!group) {
      issues.push({
        code: "GROUP_NOT_FOUND",
        productId: product.id,
        groupId: selection.groupId,
        message: `Option group "${selection.groupId}" does not exist on product "${product.id}".`,
      });
      continue;
    }

    if (selectionMap.has(selection.groupId)) {
      issues.push({
        code: "DUPLICATE_GROUP_SELECTION",
        productId: product.id,
        groupId: selection.groupId,
        message: `Group "${selection.groupId}" was selected multiple times.`,
      });
      continue;
    }

    const uniqueOptionIds = new Set<string>();
    for (const optionId of selection.optionIds) {
      if (uniqueOptionIds.has(optionId)) {
        issues.push({
          code: "DUPLICATE_OPTION_SELECTION",
          productId: product.id,
          groupId: selection.groupId,
          optionId,
          message: `Option "${optionId}" was selected multiple times in group "${selection.groupId}".`,
        });
      }
      uniqueOptionIds.add(optionId);

      if (!findOption(group.options, optionId)) {
        issues.push({
          code: "OPTION_NOT_FOUND",
          productId: product.id,
          groupId: selection.groupId,
          optionId,
          message: `Option "${optionId}" does not exist in group "${selection.groupId}".`,
        });
      }
    }

    selectionMap.set(selection.groupId, [...uniqueOptionIds]);
  }

  for (const group of product.optionGroups) {
    const selectedOptionIds = selectionMap.get(group.id) ?? [];
    const selectedCount = selectedOptionIds.length;

    if (selectedCount < group.minSelections) {
      issues.push({
        code: "SELECTION_TOO_FEW",
        productId: product.id,
        groupId: group.id,
        message: `Group "${group.id}" requires at least ${group.minSelections} selections.`,
      });
    }

    if (selectedCount > group.maxSelections) {
      issues.push({
        code: "SELECTION_TOO_MANY",
        productId: product.id,
        groupId: group.id,
        message: `Group "${group.id}" allows at most ${group.maxSelections} selections.`,
      });
    }
  }

  if (issues.length > 0) {
    throw new PricingValidationError(issues);
  }

  let unitPriceMinor = product.basePriceMinor;
  let unitMacros = roundMacros(product.baseMacros);
  const resolvedSelections: CalculatedSelection[] = [];

  for (const group of product.optionGroups) {
    const selectedOptionIds = selectionMap.get(group.id) ?? [];
    if (selectedOptionIds.length === 0) {
      continue;
    }

    let groupPriceDeltaMinor = 0;
    let groupMacrosDelta = zeroMacros();

    for (const optionId of selectedOptionIds) {
      const option = findOption(group.options, optionId);
      if (!option) {
        continue;
      }
      groupPriceDeltaMinor += option.priceDeltaMinor;
      groupMacrosDelta = addMacros(groupMacrosDelta, option.macrosDelta);
    }

    unitPriceMinor += groupPriceDeltaMinor;
    unitMacros = roundMacros(addMacros(unitMacros, groupMacrosDelta));

    resolvedSelections.push({
      groupId: group.id,
      optionIds: selectedOptionIds,
      priceDeltaMinor: groupPriceDeltaMinor,
      macrosDelta: roundMacros(groupMacrosDelta),
    });
  }

  const linePriceMinor = unitPriceMinor * cartItem.quantity;
  const lineMacros = roundMacros(multiplyMacros(unitMacros, cartItem.quantity));

  return {
    productId: product.id,
    quantity: cartItem.quantity,
    selectedOptions: cartItem.selections,
    currency: product.currency,
    unitPriceMinor,
    linePriceMinor,
    unitMacros,
    lineMacros,
    resolvedSelections,
  };
};

export const createProductLookup = (products: Product[]): Map<string, Product> =>
  new Map(products.map((product) => [product.id, product]));

export const calculateOrderSummary = (
  rawProducts: Map<string, Product> | Record<string, Product>,
  rawItems: CartItemInput[]
): CalculatedOrderSummary => {
  const items = rawItems.map((item) => cartItemInputSchema.parse(item));
  const products = rawProducts instanceof Map ? rawProducts : new Map(Object.entries(rawProducts));
  const issues: PricingIssue[] = [];

  const calculatedItems: CalculatedCartItem[] = [];
  let currency: Currency | null = null;

  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      issues.push({
        code: "PRODUCT_NOT_FOUND",
        productId: item.productId,
        message: `Product "${item.productId}" was not found in pricing lookup.`,
      });
      continue;
    }

    if (currency && product.currency !== currency) {
      issues.push({
        code: "CURRENCY_MISMATCH",
        productId: item.productId,
        message: `Product "${item.productId}" has currency "${product.currency}" but expected "${currency}".`,
      });
      continue;
    }

    currency = currency ?? product.currency;

    try {
      calculatedItems.push(calculateConfiguredItem(product, item));
    } catch (error) {
      if (error instanceof PricingValidationError) {
        issues.push(...error.issues);
      } else {
        throw error;
      }
    }
  }

  if (issues.length > 0) {
    throw new PricingValidationError(issues);
  }

  let subtotalMinor = 0;
  let totalMacros = zeroMacros();

  for (const item of calculatedItems) {
    subtotalMinor += item.linePriceMinor;
    totalMacros = addMacros(totalMacros, item.lineMacros);
  }

  return {
    items: calculatedItems,
    currency: currency ?? "HUF",
    subtotalMinor,
    totalMacros: roundMacros(totalMacros),
  };
};
