import type { Collection } from "tinacms";
import { seoField, singleDocumentUi, textField, longTextField, buttonFields } from "./fields";

export const environmentCollection: Collection = {
  name: "environment",
  label: "Medioambiente",
  path: "src/content/environment",
  format: "json",
  ui: { ...singleDocumentUi, router: () => "/medioambiente" },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Cabecera",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        textField("video", "Video de fondo (ruta en /videos)"),
        { name: "poster", label: "Imagen mientras carga el video", type: "image" },
        ...buttonFields(),
      ],
    },
    {
      type: "object",
      name: "commitment",
      label: "Compromiso",
      fields: [textField("eyebrow", "Antetítulo"), textField("title", "Título"), longTextField("text", "Texto")],
    },
    {
      type: "object",
      name: "pillars",
      label: "Pilares",
      list: true,
      ui: { itemProps: (item) => ({ label: item?.title || "Pilar" }) },
      fields: [
        textField("title", "Título"),
        longTextField("text", "Texto"),
        { name: "image", label: "Imagen", type: "image" },
        textField("video", "Video (opcional, ruta en /videos)"),
        ...buttonFields("link"),
      ],
    },
    {
      type: "object",
      name: "banner",
      label: "Banner final",
      fields: [
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        { name: "image", label: "Imagen de fondo", type: "image" },
        ...buttonFields(),
      ],
    },
    seoField,
  ],
};
