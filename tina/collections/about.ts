import type { Collection } from "tinacms";
import {
  seoField, singleDocumentUi, textField, longTextField, buttonFields, statsField, titledItemsField, stringListField, ctaBlockField,
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
    titledItemsField("values", "Misión y visión"),
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
    {
      type: "object",
      name: "solution",
      label: "Solución integral",
      fields: [
        { name: "image", label: "Imagen", type: "image" },
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        titledItemsField("items", "Pilares"),
        ...buttonFields("link"),
      ],
    },
    ctaBlockField(),
    seoField,
  ],
};
