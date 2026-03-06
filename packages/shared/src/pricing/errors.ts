export const PRICING_ERROR_CODES = [
  "PRODUCT_NOT_FOUND",
  "CURRENCY_MISMATCH",
  "GROUP_NOT_FOUND",
  "OPTION_NOT_FOUND",
  "SELECTION_TOO_FEW",
  "SELECTION_TOO_MANY",
  "DUPLICATE_GROUP_SELECTION",
  "DUPLICATE_OPTION_SELECTION",
] as const;

export type PricingErrorCode = (typeof PRICING_ERROR_CODES)[number];

export interface PricingIssue {
  code: PricingErrorCode;
  message: string;
  productId?: string;
  groupId?: string;
  optionId?: string;
}

export class PricingValidationError extends Error {
  readonly issues: PricingIssue[];

  constructor(issues: PricingIssue[]) {
    super(`Pricing validation failed with ${issues.length} issue(s).`);
    this.name = "PricingValidationError";
    this.issues = issues;
  }
}
