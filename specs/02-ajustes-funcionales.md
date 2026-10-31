# SPEC 02 — Ajustes funcionales

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-31
> **Objetivo:** Corregir la cotización de las tarjetas y traer de la referencia los comportamientos de WhatsApp, filtros, galería y formulario de contacto.

## Por qué existe esta spec

Sagar definió que el sitio actual se queda y que de la referencia solo se trae lo que funcione o se vea mejor. El inventario funcional encontró que casi todas las interacciones ya existen.

Esta spec reúne los cinco ajustes que no requieren datos nuevos de WooCommerce ni cambios de estructura. El botón "Ver cotización" de las tarjetas es un error real: promete una cotización, pero abre la ficha.

## Alcance

**Entra:**

- "Ver cotización" de `ProductTile` como enlace propio a `/contacto?requerimiento=`, con el producto precargado.
- Botón de WhatsApp que sube y oculta su burbuja mientras se ve la barra fija de la ficha, en desktop y mobile.
- Filtros de `/productos` y galería de la ficha fijos a 96 px del borde superior, desde el breakpoint `lg`.
- Teléfono del formulario: de 7 a 9 dígitos, sin exigir que empiece en 9.
- Pantalla de éxito del formulario de contacto con saludo por nombre y botón "Enviar otra consulta".
- Campo nuevo de Tina en `dynamicForms` para el texto de ese botón.

**Qué no entra (para specs futuras):**

- Heroes fijos con foto y parallax (spec 03).
- Botón "Descargar ficha técnica" (spec 04).
- Línea animada de Medioambiente (spec 05).
- Contenido, redes sociales y QA final (spec 06).
- Mostrar "Ver cotización" en pantallas táctiles: sigue apareciendo solo con hover o foco.
- Validar el teléfono en `send-email.php`.
- Cambios visuales de tarjetas, banners, bundle y otros elementos.

## Modelo de datos

### Tina: colección `dynamicForms`

| Campo | Tipo | Cambio |
|---|---|---|
| `successButtonText` | `string` | Nuevo. Texto del botón que reinicia el formulario. |
| `successButtonText_en` | `string` | Nuevo. Versión en inglés, como los demás campos. |
| `successTitle` | `string` | Acepta `{nombre}`, reemplazado por la primera palabra del campo `nombre`. |

Contenido de `src/content/dynamic-forms/contacto.json`:

| Campo | Valor |
|---|---|
| `successTitle` | `¡Gracias, {nombre}!` |
| `successButtonText` | `Enviar otra consulta` |

Si `successButtonText` está vacío, el botón no se muestra.

### Reglas de `src/utils/numericFields.ts`

`length` se reemplaza por `minLength` y `maxLength`:

| Tipo | `minLength` | `maxLength` | `startsWith` | Mensaje |
|---|---|---|---|---|
| `tel` | 7 | 9 | `null` | El teléfono debe tener entre 7 y 9 dígitos |
| `ruc` | 11 | 11 | `null` | El RUC debe tener 11 dígitos |

### Prop nueva de `ProductTile`

| Prop | Tipo | Uso |
|---|---|---|
| `quoteMessage` | `string` opcional | Plantilla de `shop.product.quoteMessage`, con `{cantidad}` en 1 y `{producto}` con marca y nombre. |

Sin `quoteMessage`, el botón no se muestra.

### Señal de la barra fija

`QuoteBoxReact` escribe `data-quote-bar="visible"` en `<html>` mientras la barra está visible, y lo retira al ocultarse o desmontarse. `src/styles/global.css` usa ese atributo sobre la clase `.whatsapp-button`, que ya existe en el botón.

## Plan de implementación

1. **Regla del teléfono.** Cambiar `src/utils/numericFields.ts` a `minLength` y `maxLength`, y ajustar sus usos en `DynamicFormReact.tsx`.
2. **Campo de Tina.** Agregar `successButtonText` y `successButtonText_en` a `tina/collections/dynamicForms.ts`, y actualizar `successTitle` y `successButtonText` en `contacto.json`.
3. **Pantalla de éxito.** En `DynamicFormReact.tsx`, mostrar en la variante de contacto el título con `{nombre}`, el mensaje y el botón.
4. **Reinicio del formulario.** El botón vuelve al formulario vacío y limpia errores, correlativo y estado de envío. Turnstile queda listo para un envío nuevo.
5. **Enlace de cotización.** En `ProductTile.tsx`, convertir el `span` en un enlace por encima del enlace de la tarjeta. Solo recibe clics cuando está visible, y también aparece con foco de teclado.
6. **Datos de la tarjeta.** Pasar `quoteMessage` desde `HomeSections.tsx`, `ProductCatalogReact.tsx`, `productos/categoria/[slug].astro` y `productos/[slug].astro`, con `shop.product.quoteMessage` desde sus páginas.
7. **WhatsApp.** Escribir `data-quote-bar` desde `QuoteBoxReact.tsx` y agregar las reglas en `src/styles/global.css`: el botón sube a 108 px y la burbuja se oculta, con transición.
8. **Filtros fijos.** En `ProductCatalogReact.tsx`, aplicar a la columna `aside` `lg:sticky lg:top-24 lg:self-start`, con scroll propio si supera el alto de la ventana.
9. **Galería fija.** En `productos/[slug].astro`, envolver la galería con las mismas clases fijas.
10. **Documentación.** Actualizar en `CLAUDE.md` la sección de formularios con `{nombre}` y `successButtonText`.

## Criterios de aceptación

**Cotización en tarjetas**

- [ ] En Inicio, `/productos`, categoría y "Te puede interesar", el clic en "Ver cotización" abre `/contacto` con `requerimiento` precargado con la marca, el nombre del producto y cantidad 1.
- [ ] El clic en cualquier otra parte de la tarjeta sigue abriendo la ficha.
- [ ] Con teclado, "Ver cotización" recibe foco, se hace visible y se activa con Enter.
- [ ] En pantalla táctil, el botón invisible no intercepta toques: tocar la tarjeta abre la ficha.

**WhatsApp**

- [ ] Al aparecer la barra fija de la ficha, el botón sube a 108 px del borde inferior y la burbuja se oculta.
- [ ] Al ocultarse la barra, el botón y la burbuja vuelven a su estado inicial.
- [ ] En 375 px y 1440 px, el botón no se superpone con la barra.
- [ ] Fuera de la ficha, `data-quote-bar` no existe y el botón no cambia.

**Filtros y galería**

- [ ] Desde `lg`, los filtros de `/productos` quedan a 96 px del borde superior al hacer scroll.
- [ ] Desde `lg`, la galería de la ficha queda a 96 px del borde superior hasta el final de su columna.
- [ ] Si los filtros superan el alto de la ventana, tienen scroll propio y se puede llegar a la última opción.
- [ ] Por debajo de `lg`, ninguno de los dos queda fijo.

**Formulario**

- [ ] Se aceptan teléfonos de 7, 8 y 9 dígitos, empiecen o no en 9.
- [ ] Con 6 dígitos, el formulario muestra "El teléfono debe tener entre 7 y 9 dígitos" y no envía.
- [ ] El campo no admite más de 9 dígitos ni caracteres que no sean números.
- [ ] El RUC sigue exigiendo exactamente 11 dígitos.
- [ ] Tras enviar "Ana María Pérez", el título dice "¡Gracias, Ana!".
- [ ] "Enviar otra consulta" muestra el formulario vacío y sin errores, incluso si llegó con `requerimiento` precargado.
- [ ] Se puede enviar una segunda consulta sin recargar, con Turnstile activo.
- [ ] Con `successButtonText` vacío, el botón no se muestra.
- [ ] Desde `/admin` se puede editar `successButtonText`.

**Sin regresiones**

- [ ] A 375 px, ninguna de las 8 pantallas presenta scroll horizontal ni texto cortado o superpuesto.
- [ ] Con `prefers-reduced-motion`, el cambio de WhatsApp ocurre sin transición.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run check:standard` termina sin errores, sin el catálogo de muestra.
- [ ] `npm run build` termina sin errores.
- [ ] `CLAUDE.md` documenta `{nombre}` y `successButtonText`.
- [ ] La spec incluye "Notas de implementación" y "QA realizada".

## Decisiones

**Tomadas:**

- **El sitio actual se queda como base.** Decisión de Sagar del 2026-10-31: de la referencia solo se trae lo que funcione o se vea mejor.
- **Sagar aprobó los nueve puntos del inventario funcional.** Esta spec cubre cinco; los demás van en las specs 03 a 05.
- **"Ver cotización" va a `/contacto?requerimiento=`, no a Contacto sin datos como en la referencia.** Es el comportamiento del resto del sitio y evita que el cliente repita el producto.
- **La tarjeta cotiza una unidad.** La cantidad solo se elige en la ficha.
- **El mensaje sale de `shop.product.quoteMessage`.** Se reutiliza la plantilla de la ficha para no mantener dos textos.
- **El teléfono acepta de 7 a 9 dígitos.** Cubre celulares, fijos de Lima y fijos con código.
- **El teléfono se valida solo en el navegador.** `send-email.php` no lo valida hoy, y agregarlo queda fuera de esta spec.
- **El saludo usa la primera palabra de `nombre`.** Igual que la referencia.
- **`{nombre}` se resuelve solo en `successTitle`.** No hace falta un sistema general de plantillas para un formulario.
- **El texto del botón va en Tina.** Es contenido visible y el equipo debe poder editarlo sin tocar código.
- **El reinicio borra también el `requerimiento` precargado.** La segunda consulta puede ser sobre otro producto.
- **La señal de la barra va como atributo en `<html>`.** `WhatsAppButton.astro` no es una isla de React, así que no comparte estado con `QuoteBoxReact`.
- **Los elementos fijos aplican desde `lg`.** Por debajo de ese ancho los filtros y la galería van en una sola columna.

**Descartadas:**

- **Quitar el botón "Ver cotización" de las tarjetas.** Corrige el error, pero pierde un acceso directo a la cotización.
- **Cambiar su texto a "Ver producto".** Toda la tarjeta ya lleva a la ficha, así que el botón no aportaría nada.
- **Mostrar el botón siempre en pantallas táctiles.** Cambia el diseño de la tarjeta y queda fuera de esta spec.
- **Mantener solo celulares.** Rechaza teléfonos fijos válidos de empresas.
- **7 dígitos o más, sin máximo.** Admite números mal escritos.
- **Texto del botón fijo en el código.** Obligaría a un cambio de código para editar un texto.
- **Convertir WhatsApp en isla de React.** Agrega JavaScript en todas las páginas para resolver un caso de la ficha.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El campo nuevo cambia el schema, y TinaCloud indexa por rama: compilar contra un índice sin ese campo falla. | Confirmar que la rama esté indexada antes de `npm run build`. Si no hay credenciales, correr `npm run build:local` y anotarlo en "QA realizada". |
| El widget de Turnstile desaparece con el formulario y puede no volver a renderizarse al reiniciar. | Probar un segundo envío sin recargar, con la clave real o de prueba. |
| El enlace de cotización puede quedar debajo del enlace que cubre la tarjeta. | Probar el clic en las cuatro ubicaciones de la tarjeta. |
| Una galería más alta que la ventana queda cortada mientras está fija. | Probar a 1440 × 900 y en una ventana más baja. |
| El alto de la barra fija cambia entre desktop y mobile. | Comprobar los 108 px en 375 px y 1440 px. |
| Cambiar `length` puede romper otros usos de la regla. | `DynamicFormReact.tsx` es su único consumidor; el criterio del RUC lo verifica. |

## Qué no entra en esta spec

- Heroes fijos con foto y parallax (spec 03).
- Botón "Descargar ficha técnica" (spec 04).
- Línea animada de Medioambiente (spec 05).
- Contenido, redes sociales y QA final (spec 06).
- "Ver cotización" visible en pantallas táctiles.
- Validación del teléfono en `send-email.php`.
- Cambios visuales de tarjetas, banners y bundle.

Si alguno de estos entra, va en su propia spec.
