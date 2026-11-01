import type { Collection } from "tinacms";
import { seoField, singleDocumentUi, textField, longTextField, buttonFields, stringListField } from "./fields";

export const shopCollection: Collection = {
  name: "shop",
  label: "Productos (catálogo)",
  path: "src/content/shop",
  format: "json",
  ui: { ...singleDocumentUi, router: () => "/productos" },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Cabecera",
      fields: [textField("title", "Título"), longTextField("description", "Descripción")],
    },
    {
      type: "object",
      name: "catalog",
      label: "Catálogo",
      fields: [
        textField("allLabel", "Pestaña “todos”"),
        textField("searchPlaceholder", "Texto del buscador"),
        textField("categoryTitle", "Título del filtro de categoría"),
        textField("brandTitle", "Título del filtro de marca"),
        textField("emptyMessage", "Mensaje sin resultados"),
        {
          name: "brandAttribute",
          label: "Atributo de WooCommerce para la marca",
          type: "string",
          description: "Nombre exacto del atributo en WooCommerce (Productos → Atributos).",
        },
        {
          name: "segmentAttribute",
          label: "Atributo de WooCommerce para el segmento",
          type: "string",
          description: "Define las pestañas (Home & Home Office, Small Business, Enterprise…).",
        },
        {
          ...stringListField("segmentOrder", "Orden de las pestañas de segmento"),
          description: "Valores del atributo de segmento en el orden en que se muestran. Los que no estén aquí van al final.",
        },
        textField("cardButtonLabel", "Botón de la tarjeta"),
      ],
    },
    {
      type: "object",
      name: "promos",
      label: "Banners promocionales",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Banner" }) },
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        longTextField("text", "Texto"),
        { name: "image", label: "Imagen", type: "image" },
        ...buttonFields(),
        {
          name: "tone",
          label: "Estilo",
          type: "string",
          options: [
            { value: "dark", label: "Oscuro" },
            { value: "light", label: "Claro" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "product",
      label: "Ficha de producto",
      fields: [
        textField("specsTitle", "Título de especificaciones"),
        textField("quantityLabel", "Pregunta de cantidad"),
        textField("quoteLabel", "Botón de cotización"),
        textField("quoteMessage", "Mensaje precargado (usa {cantidad} y {producto})"),
        textField("datasheetLabel", "Botón de ficha técnica"),
        textField("advisorTitle", "Título del asesor"),
        textField("advisorText", "Texto del asesor"),
        textField("descriptionTab", "Pestaña de descripción"),
        textField("featuresTab", "Pestaña de características"),
        textField("bundleEyebrow", "Antetítulo de complementos"),
        textField("bundleTitle", "Título de complementos"),
        textField("bundleNote", "Nota de complementos"),
        textField("relatedTitle", "Título de relacionados"),
      ],
    },
    seoField,
  ],
};
