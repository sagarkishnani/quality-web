import type { Collection } from "tinacms";
import {
  seoField, singleDocumentUi, textField, longTextField, buttonFields, statsField, stringListField, ctaBlockField,
} from "./fields";

export const aboutCollection: Collection = {
  name: "about",
  label: "Nosotros",
  path: "src/content/about",
  format: "json",
  ui: { ...singleDocumentUi, router: () => "/nosotros" },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Cabecera",
      fields: [
        { name: "image", label: "Imagen de fondo", type: "image" },
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        textField("highlight", "Parte del título en verde"),
        longTextField("text", "Texto"),
        ...buttonFields(),
      ],
    },
    {
      type: "object",
      name: "intro",
      label: "Quiénes somos",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("titleLight", "Título (parte suave)"),
        textField("titleStrong", "Título (parte destacada)"),
        stringListField("paragraphs", "Párrafos"),
        statsField,
      ],
    },
    {
      type: "object",
      name: "values",
      label: "Misión y visión",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Elemento" }) },
      fields: [
        { name: "icon", label: "Ícono (sin él, la hoja)", type: "image" },
        textField("title", "Título"),
        longTextField("text", "Texto"),
      ],
    },
    {
      type: "object",
      name: "compare",
      label: "Comprar vs. alquilar",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        longTextField("description", "Descripción"),
        textField("beforeLabel", "Título de “antes”"),
        stringListField("before", "Antes"),
        textField("afterLabel", "Título de “después”"),
        stringListField("after", "Después"),
      ],
    },
    ctaBlockField(),
    seoField,
  ],
};
