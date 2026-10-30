export function contactPath(): string {
  return `${(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")}contacto`;
}

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(String(value)), template);
}

export function quoteUrl(message: string): string {
  return `${contactPath()}?requerimiento=${encodeURIComponent(message)}`;
}
