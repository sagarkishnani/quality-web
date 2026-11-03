# SPEC 06 — Contenido y QA final

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03, SPEC 04, SPEC 05
> **Fecha:** 2026-11-01
> **Objetivo:** Validar las 8 pantallas a 1440 px contra la referencia y corregir los errores claros antes de publicar.

## Alcance

**Entra:**

- QA a 1440 px de Inicio, Nosotros, Productos, Detalle de producto, Servicios, Detalle de servicio, Medioambiente y Contacto.
- Corrección de errores claros: desbordes, enlaces rotos, y textos o imágenes equivocados.
- Lista de diferencias de diseño en el PR, para que decida Sagar.
- Pasar a "Implementado" la hoja de ruta de esta spec y registrar las diferencias aceptadas.

**No entra:**

- Cambiar `order` de los servicios: el bento conserva el orden de `/servicios`.
- Quitar `15038` de la dirección del footer: `contact.address` es un solo dato.
- URLs de redes sociales: quedan como dato pendiente del cliente y se cargan desde Tina.
- Acortar el resumen de Mantenimiento preventivo en el bento: `summary` también se usa en `/servicios`.
- Campos nuevos en Tina.
- Igualar diferencias de diseño: lo nuevo se queda.
- Mobile: no hay referencia.

## Modelo de datos

Esta spec no agrega ni cambia estructuras de datos. Reutiliza las colecciones de las specs anteriores.

## Plan de implementación

1. **Rama.** Basar `feat/spec-06-contenido` en `feat/spec-05-medioambiente`. Tras el merge del PR #6, actualizarla con `staging`, y solo entonces abrir el PR.
2. **Comparación.** Levantar `npm run dev` con `WOO_SAMPLE_CATALOG=true`. Tomar capturas a 1440 px de las 8 pantallas, en el sitio y en la referencia.
3. **Revisión funcional.** Recorrer en cada pantalla los enlaces internos, las imágenes y la consola. Probar a 1440 px el megamenú, los filtros, la galería, el explorador de servicios y el formulario.
4. **Clasificación.** Separar cada hallazgo en error claro o diferencia de diseño. Un error claro es un desborde, un enlace roto, o un texto o una imagen equivocados.
5. **Correcciones.** Corregir los errores claros, con un commit `fix` por pantalla.
6. **Registro.** Anotar en `specs/06-contenido.md` los hallazgos, las correcciones y las diferencias de diseño, y copiar estas últimas en la descripción del PR.
7. **Cierre.** Ejecutar `npm run typecheck`, `astro build` contra el servidor local de Tina y `npm run check:standard` sin catálogo de muestra. Repetir la comprobación de las pantallas corregidas.

## Criterios de aceptación

**Comparación**

- [x] Hay capturas a 1440 px del sitio y de la referencia para las 8 pantallas.
- [x] Cada diferencia encontrada figura en esta spec como corregida o como diferencia de diseño.

**Funcionamiento a 1440 px**

- [x] Ninguna de las 8 pantallas tiene scroll horizontal.
- [x] Ningún enlace interno de las 8 pantallas, el header o el footer responde 404.
- [x] Ninguna imagen de las 8 pantallas falla al cargar.
- [x] Ninguna de las 8 pantallas registra errores en la consola, salvo los del captcha o el backend simulados.
- [x] El megamenú de Servicios y el de Productos abren y sus enlaces llevan a páginas existentes.
- [x] Los filtros de `/productos` cambian los productos listados.
- [x] La galería de la ficha cambia la imagen principal.
- [x] El explorador de servicios cambia el servicio mostrado.
- [x] "Ver cotización" lleva a `/contacto` con el campo `requerimiento` precargado.

**Decisiones de contenido**

- [x] `order` de los 7 servicios, `contact.address` y `summary` no cambian.
- [x] El footer no muestra iconos de redes mientras sus URLs estén vacías.
- [x] El schema de Tina no tiene campos nuevos.

**Cierre**

- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build:local` termina sin errores.
- [x] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.
- [x] La descripción del PR lista las diferencias de diseño para Sagar.
- [x] La descripción del PR indica que las URLs de redes siguen pendientes.

## Decisiones

- **Sí:** el bento conserva el orden de `/servicios`. La referencia usa dos órdenes, y `order` es un solo campo. Así coinciden `/servicios` y el megamenú, y solo se invierten dos tarjetas pequeñas del bento.
- **No:** intercambiar `order`, aunque la hoja de ruta lo pedía. Igualaba el bento, pero desigualaba `/servicios` y el megamenú.
- **No:** un orden propio del bento. Suma schema a una spec de contenido.
- **Sí:** el footer conserva `15038`. La dirección es correcta y es la misma en todo el sitio.
- **No:** quitar `15038` de `contact.address`. Desigualaría `/contacto` y perdería el código postal.
- **No:** un campo de dirección propio del footer. Obliga a mantener el dato en dos lugares.
- **Sí:** el bento conserva el `summary` completo de Mantenimiento preventivo. La referencia lo acorta solo ahí, y el campo también alimenta `/servicios`.
- **Sí:** cerrar la spec sin las URLs de redes. El footer oculta las redes sin URL, y las URLs se cargan desde Tina sin tocar código.
- **No:** esperar las URLs. Bloquearía el cierre por un dato que no cambia el código.
- **Sí:** corregir solo errores claros y listar las diferencias de diseño para Sagar. Respeta la regla de que lo nuevo se queda.
- **No:** igualar todo a la referencia. Es el mayor alcance y deshace decisiones aprobadas.
- **No:** limitar la spec a un informe. Dejaría errores claros abiertos antes de publicar.
- **Sí:** los textos no cambian. La comparación del 2026-11-01 encontró los textos del sitio en la referencia, y las únicas diferencias de contenido son las decididas aquí.
- **Sí:** empezar sobre `feat/spec-05-medioambiente`, sin esperar el merge del PR #6. Es una excepción a salir de `staging`, decidida por Esteban el 2026-11-01. Si Sagar pide cambios en el PR #6, se repite el QA de Medioambiente.
- **Sí:** QA de Productos y Detalle de producto con catálogo de muestra, porque WooCommerce aún no existe.
- **Sí:** cierre con `npm run build:local`, porque `npm run build` requiere credenciales de TinaCloud.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| La comparación de textos comprobó que cada texto existe, no que esté en su lugar. | Revisar los textos pantalla por pantalla en las capturas del paso 2. |
| El catálogo de muestra oculta errores de datos reales de WooCommerce. | Repetir el QA de Productos y Detalle de producto cuando exista la tienda. Queda fuera de esta spec. |
| `npm run build` puede fallar con TinaCloud aunque pase `build:local`. | Avisarlo en el PR. Sagar debe ejecutarlo antes de publicar. |
| Un error clasificado como claro puede ser una decisión de diseño aprobada. | Revisar antes "Decisiones" de las specs 01 a 05. En caso de duda, va a la lista para Sagar. |

## Qué no entra en esta spec

- Cambios de `order`, de `contact.address` y de `summary`.
- URLs de redes sociales.
- Campos nuevos en Tina.
- Igualar diferencias de diseño con la referencia.
- Mobile.
- QA con datos reales de WooCommerce.

Si alguno de estos entra, va en su propia spec.

## Notas de implementación

El QA no encontró errores claros, así que esta spec no cambia código ni contenido. El paso 5 no generó commits.

Las capturas lado a lado están en `quality-contexto/qa-06/`, fuera del repo.

Diferencias de diseño, para que decida Sagar:

| Pantalla | Sitio | Referencia |
| --- | --- | --- |
| Productos | Categorías con Escáner primero y conteo alineado a la derecha | Multifuncional primero y conteo junto al nombre |
| Productos | Banners negro y claro | Banners azul y negro con foto |
| Detalle de producto | Imagen de la descripción de unos 430 px | Imagen de unos 580 px |
| Detalle de producto | Barra fija con marca y modelo en una línea | Marca sobre el modelo |
| Servicios | Título del hero en dos líneas, sin corte forzado | Corte en "acorde / a tus necesidades" |
| Detalle de servicio | Título del hero más ancho | Título en una columna más angosta |
| Medioambiente | Franja de 420 px | Franja de 720 px |

La franja de Medioambiente ya figura en la spec 05, a la espera de Sagar.

Diferencias que dependen del catálogo de muestra, sin decisión de diseño:

- La ficha no muestra "Descargar ficha técnica", porque el catálogo de muestra no trae fichas.
- "Puedes comprar con" sugiere una impresora en lugar del tóner de la referencia. El tóner sigue sin definirse.
- "Te puede interesar" muestra 1 producto, frente a 4 en la referencia. La muestra solo relaciona productos de la misma categoría.
- La galería tiene 6 imágenes y empieza por la vista frontal. La referencia tiene 5.

Observaciones de texto, sin corregir porque coinciden con la referencia:

- "deshechos" debería ser "desechos" en `src/content/home/index.json` y `src/content/environment/index.json`.
- "Servicios acorde a tus necesidades" debería ser "acordes" en `src/content/services-page/index.json`.

## QA realizada

- **Comparación:** las 8 pantallas a 1440 × 900 contra la referencia, con `npm run dev` y catálogo de muestra. Se revisaron todas las capturas. Las capturas completas muestran la página en la posición inicial, así que no sirven para juzgar parallax ni la línea de Medioambiente.
- **Automático:** sin scroll horizontal, sin imágenes rotas, sin errores de consola y sin respuestas de error en las 8 pantallas. Los 32 enlaces internos únicos responden sin error.
- **Interacción:** megamenús de Servicios y Productos, filtro de categoría (de 7 a 2 productos), galería por miniatura y flecha, explorador de servicios, precarga de `requerimiento` y validación del formulario vacío.
- **Contenido:** `order`, `contact.address`, `summary` y el schema de Tina no cambian. El footer no muestra redes.
- **`npm run typecheck`:** sin errores.
- **`npm run build:local`:** sin errores, 14 páginas sin catálogo de muestra.
- **`npm run check:standard`:** 0 errores y 1 aviso (14 páginas sin `og:image`).
- **Sin probar:** `npm run build` con TinaCloud, datos reales de WooCommerce, el envío real del formulario y otros anchos.
