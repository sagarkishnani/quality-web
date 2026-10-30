import type { Collection } from "tinacms";
import { singleDocumentUi, textField, longTextField } from "./fields";

export const globalCollection: Collection = {
  name: "global",
  label: "Global (nav / contacto / footer / SEO)",
  path: "src/content/global",
  format: "json",
  ui: singleDocumentUi,
  fields: [
    {
      type: "object",
      name: "nav",
      label: "Navegación",
      fields: [
        { name: "logo", label: "Logo", type: "image" },
        { name: "logoAlt", label: "Texto alternativo del logo", type: "string" },
        {
          type: "object",
          name: "links",
          label: "Enlaces",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.label || "Enlace" }) },
          fields: [
            { name: "label", label: "Texto", type: "string" },
            { name: "url", label: "URL", type: "string" },
            { name: "external", label: "Abre en otra pestaña", type: "boolean" },
            {
              name: "menu",
              label: "Menú desplegable",
              type: "string",
              options: [
                { value: "none", label: "Sin menú" },
                { value: "services", label: "Servicios" },
                { value: "products", label: "Productos" },
              ],
            },
          ],
        },
        {
          type: "object",
          name: "cta",
          label: "Botón principal",
          fields: [
            { name: "label", label: "Texto", type: "string" },
            { name: "url", label: "URL", type: "string" },
          ],
        },
        {
          type: "object",
          name: "servicesMenu",
          label: "Menú de servicios",
          fields: [
            textField("title", "Título de la lista"),
            {
              type: "object",
              name: "quickLinks",
              label: "Enlaces rápidos",
              list: true,
              ui: { itemProps: (item) => ({ label: item?.label || "Enlace" }) },
              fields: [textField("label", "Texto"), textField("url", "URL")],
            },
            textField("promoTitle", "Título destacado"),
            longTextField("promoText", "Texto destacado"),
            textField("promoUrl", "URL destacada"),
            { name: "promoImage", label: "Imagen destacada", type: "image" },
          ],
        },
        {
          type: "object",
          name: "productsMenu",
          label: "Menú de productos",
          fields: [
            textField("title", "Título"),
            textField("segmentsTitle", "Título de segmentos"),
            textField("categoriesTitle", "Título de tipos"),
            textField("brandsTitle", "Título de marcas"),
          ],
        },
        {
          type: "object",
          name: "search",
          label: "Buscador",
          fields: [
            textField("placeholder", "Texto de ayuda"),
            textField("popularTitle", "Título de productos populares"),
          ],
        },
      ],
    },
    {
      type: "object",
      name: "contact",
      label: "Datos de contacto",
      fields: [
        textField("email", "Correo"),
        textField("phone", "Teléfono (como se muestra)"),
        textField("phoneHref", "Teléfono para marcar (ej. +51940294820)"),
        textField("address", "Dirección"),
        textField("mapsUrl", "Enlace a Google Maps"),
        textField("whatsappNumber", "WhatsApp (solo dígitos con código de país)"),
        textField("whatsappMessage", "Mensaje inicial de WhatsApp"),
        textField("whatsappLabel", "Texto de la burbuja de WhatsApp"),
      ],
    },
    {
      type: "object",
      name: "partners",
      label: "Proveedores y aliados",
      fields: [
        textField("title", "Título"),
        {
          type: "object",
          name: "logos",
          label: "Logos",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.name || "Logo" }) },
          fields: [textField("name", "Marca"), { name: "image", label: "Logo", type: "image" }],
        },
      ],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        { name: "tagline", label: "Frase", type: "string" },
        {
          type: "object",
          name: "columns",
          label: "Columnas",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.title || "Columna" }) },
          fields: [
            { name: "title", label: "Título", type: "string" },
            {
              type: "object",
              name: "links",
              label: "Enlaces",
              list: true,
              ui: { itemProps: (item) => ({ label: item?.label || "Enlace" }) },
              fields: [
                { name: "label", label: "Texto", type: "string" },
                { name: "url", label: "URL", type: "string" },
              ],
            },
          ],
        },
        {
          type: "object",
          name: "social",
          label: "Redes sociales",
          list: true,
          ui: { itemProps: (item) => ({ label: item?.network || "Red" }) },
          fields: [
            {
              name: "network",
              label: "Red",
              type: "string",
              options: ["linkedin", "instagram", "facebook", "x", "youtube", "tiktok", "whatsapp"],
            },
            { name: "url", label: "URL", type: "string" },
          ],
        },
        { name: "legal", label: "Línea legal", type: "string" },
        textField("creditLabel", "Crédito"),
        textField("creditUrl", "URL del crédito"),
      ],
    },
    {
      type: "object",
      name: "seo",
      label: "SEO por defecto",
      fields: [
        { name: "title", label: "Título por defecto", type: "string" },
        { name: "description", label: "Descripción por defecto", type: "string", ui: { component: "textarea" } },
        { name: "ogImage", label: "Imagen para compartir (1200×630)", type: "image" },
      ],
    },
    {
      type: "object",
      name: "codeInjection",
      label: "Código inyectado (analytics, píxeles)",
      description: "HTML crudo. Se inserta tal cual; un error aquí puede romper el sitio.",
      fields: [
        { name: "head", label: "Antes de </head>", type: "string", ui: { component: "textarea" } },
        { name: "bodyEnd", label: "Antes de </body>", type: "string", ui: { component: "textarea" } },
      ],
    },
  ],
};
