import type { Collection } from "tinacms";
import { seoField, singleDocumentUi, textField } from "./fields";

export const contactPageCollection: Collection = {
  name: "contactPage",
  label: "Contacto",
  path: "src/content/contact-page",
  format: "json",
  ui: { ...singleDocumentUi, router: () => "/contacto" },
  fields: [
    textField("title", "Título"),
    textField("question", "Pregunta"),
    textField("highlight", "Texto destacado"),
    textField("highlightSuffix", "Texto después del destacado"),
    textField("emailLabel", "Etiqueta del correo"),
    textField("phoneLabel", "Etiqueta del teléfono"),
    textField("addressLabel", "Etiqueta de la dirección"),
    textField("requiredNote", "Nota de campos obligatorios"),
    seoField,
  ],
};
