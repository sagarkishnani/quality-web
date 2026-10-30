import type { Collection } from "tinacms";
import { seoField, singleDocumentUi, textField, longTextField, buttonFields, statsField } from "./fields";

export const homeCollection: Collection = {
  name: "home",
  label: "Inicio",
  path: "src/content/home",
  format: "json",
  ui: singleDocumentUi,
  fields: [
    {
      type: "object",
      name: "slides",
      label: "Diapositivas del hero",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Diapositiva" }) },
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        longTextField("text", "Texto"),
        { name: "image", label: "Imagen de fondo", type: "image" },
        ...buttonFields(),
      ],
    },
    {
      type: "object",
      name: "heroSecondary",
      label: "Botón secundario del hero",
      fields: buttonFields(),
    },
    {
      type: "object",
      name: "products",
      label: "Productos destacados",
      description: "Los productos salen de WooCommerce: los marcados como destacados, o los primeros del catálogo.",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        ...buttonFields("link"),
      ],
    },
    {
      type: "object",
      name: "services",
      label: "Servicios",
      description: "Muestra los servicios marcados como “Mostrar en el inicio”.",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        longTextField("description", "Descripción"),
        ...buttonFields("link"),
      ],
    },
    {
      type: "object",
      name: "experience",
      label: "Experiencia",
      fields: [
        textField("titleLight", "Título (parte suave)"),
        textField("titleStrong", "Título (parte destacada)"),
        longTextField("text", "Texto"),
        statsField,
      ],
    },
    {
      type: "object",
      name: "ecoBanner",
      label: "Banner de medioambiente",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        { name: "image", label: "Imagen de fondo", type: "image" },
        ...buttonFields(),
      ],
    },
    {
      type: "object",
      name: "testimonials",
      label: "Testimonios",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        {
          type: "object",
          name: "items",
          label: "Testimonios",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.name || "Testimonio" }) },
          fields: [
            longTextField("quote", "Testimonio"),
            textField("name", "Nombre"),
            textField("organization", "Empresa"),
          ],
        },
      ],
    },
    seoField,
  ],
};
