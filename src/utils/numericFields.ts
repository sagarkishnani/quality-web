export const NUMERIC_FIELD_RULES = {
  tel: { minLength: 7, maxLength: 9, startsWith: null, message: "El teléfono debe tener entre 7 y 9 dígitos" },
  ruc: { minLength: 11, maxLength: 11, startsWith: null, message: "El RUC debe tener 11 dígitos" },
} as const;

export type NumericFieldType = keyof typeof NUMERIC_FIELD_RULES;

export function isNumericField(type: string): type is NumericFieldType {
  return type === "tel" || type === "ruc";
}

export function sanitizeNumeric(value: string, type: NumericFieldType): string {
  return value.replace(/\D/g, "").slice(0, NUMERIC_FIELD_RULES[type].maxLength);
}

export function isNumericValid(value: string, type: NumericFieldType): boolean {
  const rule = NUMERIC_FIELD_RULES[type];
  if (value.length < rule.minLength || value.length > rule.maxLength) return false;
  if (rule.startsWith && !value.startsWith(rule.startsWith)) return false;
  return true;
}
