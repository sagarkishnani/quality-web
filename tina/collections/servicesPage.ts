import type { Collection } from "tinacms";
import { seoField, singleDocumentUi, textField, longTextField, buttonFields, titledItemsField, ctaBlockField } from "./fields";

export const servicesPageCollection: Collection = {
  name: "servicesPage",
  label: "Página de servicios",
  path: "src/content/services-page",
  format: "json",
  ui: { ...singleDocumentUi, router: () => "/servicios" },
  fields: [
    {
      type: "object",
      name: "hero",
      label: "Cabecera",
      fields: [
        { name: "image", label: "Imagen de fondo", type: "image" },
        textField("eyebrow", "Antetítulo"),
        textField("title", "Título"),
        longTextField("text", "Texto"),
        ...buttonFields(),
      ],
    },
    {
      type: "object",
      name: "list",
      label: "Listado de servicios",
      fields: [textField("title", "Título"), longTextField("description", "Descripción"), textField("linkLabel", "Texto del enlace")],
    },
    {
      type: "object",
      name: "reasons",
      label: "¿Por qué elegirnos?",
      fields: [
        textField("titleLight", "Título (parte suave)"),
        textField("titleStrong", "Título (parte destacada)"),
        longTextField("text", "Texto"),
        titledItemsField("items", "Razones"),
      ],
    },
    {
      type: "object",
      name: "detail",
      label: "Textos del detalle de servicio",
      fields: [
        textField("heroButtonLabel", "Botón de la cabecera"),
        textField("consistsEyebrow", "Antetítulo de la descripción"),
        textField("includesTitle", "Título de “qué incluye”"),
        textField("requestLabel", "Botón de solicitud"),
        textField("othersTitle", "Título de otros servicios"),
        textField("othersLinkLabel", "Enlace de otros servicios"),
        textField("requestMessage", "Mensaje precargado (usa {servicio})"),
      ],
    },
    ctaBlockField(),
    seoField,
  ],
};
