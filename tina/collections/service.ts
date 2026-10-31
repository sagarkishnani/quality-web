import type { Collection } from "tinacms";
import { textField, longTextField, stringListField } from "./fields";

export const serviceCollection: Collection = {
  name: "service",
  label: "Servicios",
  path: "src/content/services",
  format: "json",
  ui: {
    filename: {
      slugify: (values) =>
        (values?.name || "servicio")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
    },
    router: ({ document }) => `/servicios/${document._sys.filename}`,
  },
  fields: [
    { name: "name", label: "Nombre", type: "string", required: true, isTitle: true },
    textField("shortName", "Nombre corto (footer)"),
    longTextField("summary", "Resumen"),
    longTextField("description", "Descripción"),
    stringListField("includes", "¿Qué incluye?"),
    { name: "image", label: "Imagen principal", type: "image" },
    { name: "detailImage", label: "Imagen del detalle", type: "image" },
    { name: "order", label: "Orden", type: "number" },
    { name: "showOnHome", label: "Mostrar en el inicio", type: "boolean" },
  ],
};
