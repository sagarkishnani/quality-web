import type { TinaField } from "tinacms";

export const seoField: TinaField = {
  type: "object",
  name: "seo",
  label: "SEO",
  fields: [
    { name: "title", label: "Título", type: "string" },
    { name: "description", label: "Descripción", type: "string", ui: { component: "textarea" } },
  ],
};

export function textField(name: string, label: string): TinaField {
  return { name, label, type: "string" };
}

export function longTextField(name: string, label: string): TinaField {
  return { name, label, type: "string", ui: { component: "textarea" } };
}

export function buttonFields(prefix = "button"): TinaField[] {
  return [
    { name: `${prefix}Label`, label: "Texto del botón", type: "string" },
    { name: `${prefix}Url`, label: "URL del botón", type: "string" },
  ];
}

export const statsField: TinaField = {
  type: "object",
  name: "stats",
  label: "Cifras",
  list: true,
  ui: { itemProps: (item) => ({ label: item?.value ? `${item.value} ${item.label || ""}` : "Cifra" }) },
  fields: [
    { name: "value", label: "Valor (ej. +1000)", type: "string" },
    { name: "label", label: "Descripción", type: "string" },
  ],
};

export function titledItemsField(name: string, label: string): TinaField {
  return {
    type: "object",
    name,
    label,
    list: true,
    ui: { itemProps: (item) => ({ label: item?.title || "Elemento" }) },
    fields: [
      { name: "title", label: "Título", type: "string" },
      { name: "text", label: "Texto", type: "string", ui: { component: "textarea" } },
    ],
  };
}

export function stringListField(name: string, label: string): TinaField {
  return { name, label, type: "string", list: true };
}

export function ctaBlockField(name = "cta", label = "Llamada a la acción final"): TinaField {
  return {
    type: "object",
    name,
    label,
    fields: [
      textField("title", "Título"),
      longTextField("text", "Texto"),
      ...buttonFields(),
    ],
  };
}

export const singleDocumentUi = { allowedActions: { create: false, delete: false } };
