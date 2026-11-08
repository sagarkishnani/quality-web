# SPEC 12 — Correcciones de UI

> **Estado:** Implementado
> **Depende de:** SPEC 06 (QA desktop), SPEC 09 (carruseles) y SPEC 10 (catálogo mobile)
> **Fecha:** 2026-11-07
> **Objetivo:** Corregir las incongruencias de UI de la revisión del 2026-11-07 (botón de cotización, banners de `/productos`, escala de títulos, áreas táctiles, selector de orden, antetítulo de la 404 e imágenes sin medidas).

## Por qué existe esta spec

La revisión del sitio completo a 390 y 1440 px encontró diferencias entre páginas que ninguna spec cubría: un botón que cambia de ancho, una foto que tapa el texto, títulos de sección con cuatro tamaños y áreas táctiles de 8 a 38 px. Son correcciones chicas y repartidas, por eso van juntas.

## Alcance

**Entra:**

1. **Botón de cotización (ficha):** dice siempre "Ver cotización", en la caja y en la barra fija. La cantidad solo va en el mensaje a `/contacto`.
2. **Banners de `/productos`:** por debajo de `md`, el texto va a todo el ancho arriba y la foto abajo. Desde `md` siguen lado a lado, con "Consultar por esta promoción" en una línea en todos los anchos.
3. **Títulos de sección:** todos los H2 de sección pasan a `heading-sm` (el de `SectionHeading`):
   - "Concentra tu negocio".
   - El título de "¿En qué consiste?".
   - "Otros servicios", "Puedes comprar con" y "Te puede interesar".
   - "Nuestros servicios".
   - "Los grandes cambios empiezan…".
   - Los títulos de los pilares de Medioambiente.
   - El banner "Cuidamos el medio ambiente" y el banner final "Ayuda a preservar el planeta".

   Los CTA (`CtaBlock`) siguen en `heading-md`.
4. **H1 de categoría:** `/productos/categoria/<slug>` pasa de `heading-lg` a `heading-xl`, como `/productos`.
5. **Antetítulo de la 404:** usa la clase `eyebrow`, como el resto de las páginas claras.
6. **Selector de orden:** sin la apariencia nativa del navegador, con el `FaChevronDown` del sitio.
7. **Áreas táctiles en mobile:**
   - **Sin cambio visual:** "Ver cotización" de la tarjeta compacta llega a 44 px de alto, y el nombre del producto lleva a la ficha desde toda la tarjeta (enlace extendido).
   - **Con ajuste mínimo:** los enlaces del footer llegan a 44 px de alto, con 7 px más de separación, solo en mobile. Los puntos del hero y de la galería quedan a 24 px de separación, con un área de 24 × 44 px.
8. **Imágenes con medidas:** los logos de aliados y la galería de la ficha llevan `width` y `height`.

**Fuera de alcance (para otras specs):**

- Hero del inicio con botones apilados y cambio de diapositiva con gesto.
- Colores de los banners como en la referencia (azul y negro con foto).
- Quitar el título del producto sobre la descripción en la ficha.
- Política de privacidad, casilla de consentimiento y enlaces legales del footer.
- Imagen `og:image` por defecto.
- Títulos con dos pesos ("¿Por qué elegirnos?", "Contamos con…"), que quedan como están porque son así a propósito.
- Títulos de tarjetas: Misión, Visión y los títulos de los banners promocionales.

## Modelo de datos

Esta spec no agrega datos ni cambia el schema de Tina. Solo cambia clases y marcado de componentes que ya existen.

## Plan de implementación

1. **Botón de cotización:** en `QuoteBoxReact.tsx`, la caja y la barra fija usan siempre `quoteLabel`.
2. **Banners:** en `ShopPromos` (`ShopSections.tsx`), la tarjeta pasa a columna por debajo de `md`: texto a todo el ancho y foto abajo, dentro de la tarjeta, con alto fijo y sin máscara. Desde `md` sigue el diseño actual, con la columna de texto lo bastante ancha para que "Consultar por esta promoción" quede en una línea.
3. **Títulos de sección:** se cambian a `text-heading-sm` en `AboutSections.tsx`, `ServiceDetailReact.tsx` (dos), `BundleQuoteReact.tsx`, `productos/[slug].astro`, `ServicesExplorerReact.tsx`, `EnvironmentSections.tsx` (tres) e `ImageBanner.tsx`.
4. **H1 y 404:** `categoria/[slug].astro` pasa a `text-heading-xl` y `404.astro` usa `eyebrow`.
5. **Selector de orden:** en `ProductCatalogReact.tsx`, el `select` lleva `appearance-none` y un `FaChevronDown` superpuesto con `pointer-events-none`.
6. **Áreas táctiles:**
   - `ProductTile`: el botón compacto llega a 44 px con un área invisible, y el nombre lleva un enlace extendido a toda la tarjeta (`after:absolute after:inset-0`). El botón queda encima, para seguir llevando a la cotización.
   - Footer: enlaces con `py` hasta 44 px en mobile, sin cambio desde `md`.
   - Puntos del hero y de la galería: cada botón mide 24 × 44 px, con el punto visible centrado.
7. **Imágenes:** `width` y `height` en `PartnersReact.tsx` y en `ProductGalleryReact.tsx`, con las medidas reales del archivo o la proporción de la caja.
8. **Documentación:** registrar en `CLAUDE.md` la escala de títulos (H2 de sección en `heading-sm`, CTA en `heading-md`) y la regla de áreas táctiles.

## Criterios de aceptación

**Ficha**

- [x] El botón dice "Ver cotización" con 1 y con 5 equipos, en la caja y en la barra fija, y su ancho no cambia.
- [x] El enlace a `/contacto` lleva la cantidad elegida en el mensaje.

**Banners de `/productos`**

- [x] A 375 y 390 px, la foto no se cruza con el título, la descripción ni el botón de ningún banner.
- [x] "Consultar por esta promoción" queda en una línea, de 46 px de alto, a 390, 768, 1024 y 1440 px.
- [x] Desde `md`, los banners siguen lado a lado.

**Títulos**

- [x] Todos los H2 de sección, salvo CTA y títulos de dos pesos, miden lo mismo en cada ancho: 26 px a 390 y 36 px a 1440.
- [x] Los CTA miden 40 px a 1440.
- [x] El H1 de `/productos/categoria/<slug>` mide igual que el de `/productos` (52 px a 1440).
- [x] El antetítulo de la 404 tiene el mismo tamaño, color y estilo de letra que los otros `eyebrow`.

**Selector de orden**

- [x] Muestra el `FaChevronDown` del sitio y no la flecha nativa.
- [x] Tocar la flecha abre el selector.

**Áreas táctiles a 390 px**

- [x] ~~"Ver cotización" de la tarjeta compacta mide 44 px de alto.~~ No aplica: el botón solo aparece con hover o teclado, nunca en pantallas táctiles (ver Decisiones).
- [x] Tocar la tarjeta fuera del botón abre la ficha, y tocar el botón abre la cotización.
- [x] Los enlaces del footer miden 44 px de alto; desde `md`, el footer mide igual que en `staging`.
- [x] Los puntos del hero y de la galería miden 24 × 44 px y cada uno cambia a su diapositiva o imagen.

**Imágenes**

- [x] Los logos de aliados y las imágenes de la galería tienen `width` y `height`.

**General**

- [x] Ninguna página tiene scroll horizontal a 375 y 390 px.
- [x] Desktop (1024 y 1440 px) mide igual que `staging` fuera de lo listado.
- [x] `typecheck`, `build:local` y `check:standard` pasan (0 errores).
- [x] La consola no muestra errores.

## Decisiones tomadas y descartadas

**Tomadas:**

- **Todo en una spec de corrección:** son cambios chicos y repartidos; separarlos multiplicaba los PRs sin ganar nada. Decidido por Esteban el 2026-11-07.
- **H2 de sección en `heading-sm`:** es el tamaño de `SectionHeading`, que ya usa la mayoría de las secciones. Los CTA quedan en `heading-md` porque cierran la página. Se aparta de la referencia desktop cuadrada en la spec 06, que tenía cuatro tamaños.
- **Banners apilados por debajo de `md`:** con la columna al 60 %, a 390 px el texto quedaba en 224 px y la foto lo tapaba. Desde `md`, lado a lado funciona.
- **Áreas táctiles sin cambio visual cuando cabe, y con ajuste mínimo cuando no:** el footer está a 37 px entre enlaces y necesita 7 px más para 44. Los puntos, a 16 y 14 px, suben a 24 px, el mínimo de WCAG 2.5.8.
- **Enlace extendido en la tarjeta:** hace tocable toda la tarjeta sin cambiar cómo se ve; el botón de cotización queda encima.
- **Flecha propia en el orden:** se ve igual que "Filtrar" en todos los navegadores.

- **Banners en dos columnas desde `xl` (no desde `md`):** a 1024 px, con dos banners por fila, "Consultar por esta promoción" (261 px) no entraba en la columna de texto (233 px) y se metía en la foto. Entre `md` y `xl` cada banner ocupa todo el ancho, con texto y foto lado a lado. Decidido durante la implementación, el 2026-11-07.
- **El botón de la tarjeta compacta queda como está:** solo aparece con hover o teclado, así que en mobile no se toca; la cotización se pide desde la ficha. La revisión lo había medido aunque estaba invisible. Decidido por Esteban durante la implementación, el 2026-11-07.
- **El botón y el ojo de la tarjeta aparecen solo con mouse (`[@media(hover:hover)]`) o teclado:** antes, el toque activaba el hover y el botón se veía un instante en mobile (y en iPhone el primer toque podía quedarse solo en hover). Ahora, en pantallas táctiles no aparecen y un toque abre la ficha. Decidido por Esteban durante la implementación, el 2026-11-07.
- **Botón y ojo de la tarjeta dentro de la imagen, como la referencia desktop:** el botón ocupaba todo el ancho al pie de la tarjeta y tapaba la marca y el nombre. Ahora es una píldora de 44 px centrada al pie de la imagen y el ojo, un círculo blanco con borde de 44 px arriba a la derecha. Decidido por Esteban durante la implementación, el 2026-11-07.
- **El enlace extendido de la tarjeta ya existía** (`after:absolute after:inset-0` en el nombre): la revisión midió solo el texto. No hubo que cambiarlo.

**Descartadas:**

- **Bajar "¿Por qué elegirnos?" a peso 700:** es un título con dos pesos a propósito (`titleStrong`).
- **Ensanchar la columna de los banners al 70 %:** no alcanzaba a 375 px y achicaba demasiado la foto.
- **Dejar todas las áreas táctiles sin cambio visual:** el footer y los puntos no cumplían el estándar.
- **Dejar los títulos como en la referencia:** cuatro tamaños para el mismo nivel no siguen un patrón.

## Riesgos

- **El enlace extendido de la tarjeta puede tapar otros elementos:** si la etiqueta ("Oferta", "Nuevo") u otro elemento necesita recibir clics, quedaría debajo. El botón de cotización necesita `relative z-10`.
- **El cambio de títulos se ve en desktop,** y es lo que más notarán Sagar y el cliente, sobre todo en Medioambiente (52 → 36 px). El PR lleva capturas de antes y después.
- **El banner apilado depende de la foto:** si el cliente sube una foto muy vertical, la parte de abajo se recorta. Se usa `object-contain` en el banner claro y `object-cover` en el oscuro, como hoy.

## Notas de implementación

- `QuoteBoxReact.tsx`: la caja y la barra fija muestran `quoteLabel`; la cantidad sigue en el mensaje.
- `ShopSections.tsx` (`ShopPromos`): la tarjeta es `flex-col` por debajo de `md`, con la foto al final (`order-last`, 200 px de alto) y sin máscara; desde `md`, el diseño anterior. El botón lleva `whitespace-nowrap` y la grilla pasa a `xl:grid-cols-2`.
- Títulos: diez H2 pasan a `text-heading-sm` en siete archivos; `ImageBanner` solo se usa en el inicio.
- Footer: los enlaces son `flex min-h-11 items-center` en mobile e `inline` desde `md`; la lista pasa de `space-y-3` a `md:space-y-3` y de `mt-5` a `mt-2 md:mt-5`.
- Puntos: el botón mide `h-11 min-w-6` con el punto visible en un `span` adentro; los del hero suben de `bottom-20` a `bottom-16` para que el punto quede a la misma altura.
- Imágenes: logos con `144 × 48`, galería con `880 × 720` (proporción 11/9 de la caja) y miniaturas con `80 × 80`.

## QA (2026-11-07)

Chromium a 375, 390, 768, 1024, 1280 y 1440 px, con el catálogo de muestra.

- Ficha: con 5 equipos el botón dice "Ver cotización" en la caja y en la barra, con el mismo ancho (218 px); el mensaje dice "5 × HP LaserJet Enterprise M608".
- Banners: sin cruce de la foto con el texto a 375 y 390 px; el botón mide 46 px en todos los anchos. A 1280 px, la caja del texto y la de la foto del banner oscuro se tocan por 6 px, igual que en `staging`.
- H2 de sección: 26 px a 390 y 36 px a 1440 en las 14 secciones; CTA en 40 px. "LaserJet Enterprise M608" sobre la descripción queda en 28 px: quitarlo está fuera de alcance.
- H1 de categoría y de `/productos`: 52 px a 1440. Antetítulo de la 404 igual al de Nosotros.
- Orden: `appearance: none`, la flecha no intercepta el toque (el punto bajo la flecha es el `select`).
- Tarjeta a 1440 con hover: el botón (142 × 44 px) termina 40 px por encima del texto; ojo arriba a la derecha.
- Tarjeta: en pantalla táctil (`hover: none`), botón y ojo con opacidad 0 al pasar por encima y un toque abre la ficha; con mouse aparecen como antes, y con Tab el botón se muestra.
- Footer: enlaces de 44 a 48 px a 390. Puntos del hero (28 y 24 × 44) y de la galería (24 × 44) cambian de diapositiva e imagen. Tocar la tarjeta abre la ficha.
- Sin scroll horizontal a 375 y 390 px en las 10 páginas; consola sin errores.
- Desktop contra `staging` a 1024 y 1440: cambian solo los títulos, los banners (a 1024 px van uno debajo del otro, +326 px) y el ancho del selector (+4 px). Footer, `/contacto` y la 404, iguales.
- Las imágenes de la descripción del producto vienen del HTML de WooCommerce y no llevan medidas: quedan fuera de esta spec.
- `typecheck` y `build:local` pasan; `check:standard`, 0 errores y 1 aviso (`og:image`).
