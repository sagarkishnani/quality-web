# SPEC 09 — Carruseles mobile, cifras y aliados

> **Estado:** Implementado
> **Depende de:** SPEC 07
> **Fecha:** 2026-11-04
> **Objetivo:** Convertir en carruseles las listas mobile de productos, servicios, testimonios, "Te puede interesar" y "Otros servicios", y ajustar las cifras y los aliados de Inicio y Nosotros.

## Por qué existe esta spec

Por debajo de `md`, las listas de tarjetas se apilan y alargan las páginas. La referencia mobile (`Quality Sumprint Mobile.html`) las resuelve con carruseles horizontales con `scroll-snap`. Durante el diseño se sumaron tres ajustes del inicio y Nosotros: las cifras no tienen animación, los logos de aliados se ven de tamaños distintos y el título de aliados es más chico que el resto de los títulos de sección.

## Alcance

**Entra: carruseles (por debajo de `md`)**

- **Componente:** un carrusel nuevo en `src/components/ui/`, solo con CSS (`scroll-snap`). No lleva flechas, puntos ni JavaScript, y desde `md` vuelve a la grilla actual.
- **Inicio · Productos:** tarjetas al 68 % con `ProductTile` sin cambios, "Ver cotización" incluido.
- **Inicio · Servicios:** los 4 de `showOnHome` al 78 % y de 380 px de alto, con "01 / 04" y el nombre, sin resumen. Desde `md` sigue el bento.
- **Inicio · Testimonios:** tarjetas al 84 %.
- **Ficha · "Te puede interesar":** tarjetas al 62 %.
- **Detalle de servicio · "Otros servicios":** las tarjetas oscuras actuales (`ServiceCard`) al 72 %.
- **Bordes:** el carrusel llega al borde de la pantalla y la primera tarjeta se alinea con el margen de 20 px.

**Entra: cifras y aliados (en todos los anchos)**

- **Contador:** las cifras de Inicio y Nosotros cuentan de 0 a su valor en 1,2 s, una vez, al entrar en pantalla. Lo hace un script, sin hidratar React, y se conservan el "+" y el resto del texto de la cifra. Con `prefers-reduced-motion` se muestra la cifra final.
- **Logos:** todos van dentro de la misma caja, de ancho y alto fijos y con `object-contain`. Si un archivo trae demasiado margen, se recorta.
- **Título de aliados:** "Nuestros proveedores y aliados" pasa al tamaño de "Algunos de los servicios que ofrecemos" (`heading-sm`, bold, color de texto principal), centrado sobre los logos.

**No entra:**

- Las grillas y el bento desde `md`.
- Las tarjetas blancas de "Otros servicios" y una tarjeta de producto sin botón.
- Los textos cortos de la referencia: se mantienen la descripción de la sección de servicios y "Ver todos los servicios".
- La galería de la ficha, el catálogo y el explorador de servicios (specs 10 y 11).
- Cambios de contenido o de schema en Tina.

## Modelo de datos

No hay datos nuevos ni cambios en Tina. Se suman dos piezas de código y una marca en el HTML.

**Componente `src/components/ui/Carousel.tsx`**

| Prop | Tipo | Para qué |
|---|---|---|
| `itemWidth` | `"62" \| "68" \| "72" \| "78" \| "84"` | Ancho de cada tarjeta en mobile, en %. |
| `gridClassName` | `string` | Grilla desde `md`, la misma que hay hoy (por ejemplo, `md:grid-cols-3`). |
| `label` | `string` | Nombre accesible del carrusel (`aria-label`). |
| `children` | `ReactNode[]` | Las tarjetas. |

Reglas:

- Por debajo de `md` es una fila con `overflow-x-auto`, `snap-x snap-mandatory`, separación de 12 px y la barra de scroll oculta.
- El carrusel sale del margen con `-mx-5 px-5` y usa `scroll-px-5`, para llegar al borde y que la primera tarjeta quede alineada a 20 px.
- Desde `md` quita el scroll y aplica `gridClassName`.
- Los anchos van en un mapa fijo de clases, no armados con texto, para que Tailwind los genere.
- Sirve en las islas `client:tina` y en el `.astro` de la ficha, porque no tiene estado.

**Contador `src/utils/countUp.ts`**

- Marca en el HTML: el `<dd>` de `StatGrid` lleva `data-count-up` con la cifra completa (por ejemplo, `"+1000"`).
- Separa la cifra en prefijo, número y sufijo (`"+"`, `1000`, `""`). Si el valor no tiene número, no lo anima.
- El HTML del build lleva la cifra final. El script la pone en 0 justo antes de animar, así que sin JavaScript se ve el valor correcto.
- Se inicia desde `BaseLayout.astro`, igual que `startParallax` y `startScrollLine`.

**Logos:** la caja es una clase en `PartnersReact.tsx`, sin cambios de datos.

## Plan de implementación

1. **Rama.** Crear `feat/spec-09-carruseles-mobile` desde `staging` actualizado.
2. **Carrusel.** Crear `Carousel.tsx` con el mapa de anchos y la grilla desde `md`. Si ninguna tarjeta tiene enlaces, como en testimonios, el contenedor lleva `tabIndex={0}` para poder desplazarlo con el teclado.
3. **Productos del inicio.** Usar `Carousel` al 68 % en `HomeProducts`, con la grilla actual desde `md`.
4. **Servicios del inicio.** Usar `Carousel` al 78 % solo por debajo de `md`, con tarjetas de 380 px, "01 / 04" y el nombre. Desde `md` sigue el bento sin cambios. `ServiceCard` suma la prop opcional `counter`.
5. **Testimonios.** Usar `Carousel` al 84 % en `HomeTestimonials`.
6. **"Te puede interesar".** Usar `Carousel` al 62 % en `src/pages/productos/[slug].astro`.
7. **"Otros servicios".** Usar `Carousel` al 72 % en `OtherServices`, con las tarjetas oscuras actuales.
8. **Contador.** Crear `countUp.ts`, marcar el `<dd>` de `StatGrid` con `data-count-up` e iniciarlo desde `BaseLayout.astro`.
9. **Logos.** Poner cada logo en una caja fija, con medidas tomadas de los 4 logos a 390 y 1440 px. Si algún archivo trae demasiado margen, recortarlo en `public/images/marcas/`.
10. **Título de aliados.** Cambiar el `<p>` por un `<h2>` centrado con `text-heading-sm`.
11. **Registro.** Anotar en la sección de estilos de `CLAUDE.md` el patrón del carrusel y del contador, y actualizar el brief en `quality-contexto/README.md`.
12. **Cierre.** Ejecutar `npm run typecheck`, `npm run build:local` y `npm run check:standard` sin catálogo de muestra. Probar a 375, 390, 768 y 1440 px.

## Criterios de aceptación

**Carruseles (375 y 390 px)**

- [x] Productos del inicio, servicios del inicio, testimonios, "Te puede interesar" y "Otros servicios" se desplazan en horizontal y cada tarjeta se detiene alineada a 20 px del borde.
- [x] Las tarjetas miden 68 % (productos), 78 % (servicios), 84 % (testimonios), 62 % ("Te puede interesar") y 72 % ("Otros servicios") del ancho del carrusel.
- [x] Los servicios del inicio son los 4 de `showOnHome`, miden 380 px de alto y muestran "01 / 04" a "04 / 04" y el nombre, sin resumen.
- [x] Las tarjetas de producto mantienen "Ver cotización".
- [x] Ningún carrusel muestra barra de scroll, y la página no tiene scroll horizontal.
- [x] El carrusel de testimonios recibe foco con Tab y se desplaza con las flechas del teclado.

**Desde `md` (768 y 1440 px)**

- [x] Las cinco listas se ven como en `staging`: las mismas grillas y el mismo bento.

**Contador**

- [x] En Inicio y Nosotros, las cifras cuentan de 0 a su valor en 1,2 s al entrar en pantalla, conservan el "+" y no se repiten al volver a pasar.
- [x] Con `prefers-reduced-motion`, las cifras aparecen con su valor final.
- [x] El HTML del build lleva la cifra final en cada `<dd>`.

**Aliados**

- [x] A 390 y 1440 px, los 4 logos ocupan la misma caja y se ven del mismo tamaño a simple vista.
- [x] "Nuestros proveedores y aliados" es un `<h2>` centrado del mismo tamaño que "Algunos de los servicios que ofrecemos", en Inicio y Nosotros.

**General**

- [x] El schema de Tina no cambia.
- [x] La consola no muestra errores.

**Cierre**

- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build:local` termina sin errores.
- [x] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.

## Decisiones

- **Sí:** los carruseles son solo CSS, con `scroll-snap`. La referencia no trae flechas ni puntos, y así no se agrega JavaScript a islas que hoy no lo cargan.
- **Sí:** los carruseles solo van por debajo de `md`. Desde ahí, las grillas actuales caben y coinciden con desktop.
- **Sí:** "Otros servicios" usa las tarjetas oscuras actuales y no las blancas de la referencia. Se reutiliza `ServiceCard` y la tarjeta es igual en todos los anchos. Decidido por Esteban el 2026-11-04.
- **Sí:** los servicios del inicio van sin resumen, como en la referencia, y numerados sobre los 4 de `showOnHome` ("01 / 04"), no sobre los 7.
- **Sí:** `ProductTile` no cambia en los carruseles y conserva "Ver cotización" (spec 02).
- **No:** traer los textos cortos de la referencia. Los textos son iguales en todos los anchos (decisión del 2026-11-02).
- **Sí:** el contador dura 1,2 s, aunque el estándar pide de 150 a 300 ms. Con 300 ms no se alcanza a ver el conteo, así que queda como excepción y va en el PR. Con `prefers-reduced-motion` no anima.
- **Sí:** el contador corre con un script de `src/utils/` y no hidratando `StatGrid`. Sigue el patrón de `parallax.ts` y `scrollLine.ts`, y la cifra final está en el HTML.
- **Sí:** los logos se igualan con una caja fija en el código y no con un campo en Tina. No cambia el schema, y si un logo nuevo trae mucho margen, se recorta el archivo.
- **Sí:** el título de aliados se centra en `heading-sm`. Es un cambio sobre la referencia, que lo deja en texto pequeño gris. Decidido por Esteban el 2026-11-04.
- **Sí:** las cifras y los aliados entran en esta spec, aunque no son carruseles. Decidido por Esteban el 2026-11-04.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El `-mx-5` del carrusel genera scroll horizontal en la página. | Medir `scrollWidth` a 375 px en las 4 pantallas afectadas. |
| El bento y el carrusel de servicios duplican las tarjetas en el DOM. | Renderizar una sola lista y cambiar solo las clases por ancho; si no se puede, ocultar la otra con `hidden md:grid` y quitarla del árbol accesible. |
| El contador deja la cifra en 0 si el script falla a mitad. | Solo se pone en 0 en el mismo paso que arranca la animación, que termina siempre en el valor original. |
| Un logo cuadrado se ve chico en una caja ancha. | Probar la caja con los 4 logos, y si hace falta, recortar el margen del archivo. |

## Qué no entra en esta spec

- Las grillas y el bento desde `md`.
- Las tarjetas blancas de "Otros servicios" y una tarjeta de producto sin botón.
- Los textos cortos de la referencia.
- La galería de la ficha, el catálogo y el explorador de servicios (specs 10 y 11).
- Cambios de contenido o de schema en Tina.

Si alguno de estos entra, va en su propia spec.

## Notas de implementación

- `Carousel` no envuelve las tarjetas: aplica el ancho y el `snap` a sus hijos directos (`[&>*]:`). Así, desde `md`, cada tarjeta sigue siendo un elemento de la grilla y el bento conserva `row-span` y `col-span`.
- El bento y el carrusel de servicios son la misma lista; no hay tarjetas duplicadas en el DOM.
- `ServiceCard` suma la prop `counter`. Con ella, por debajo de `md` muestra el número, oculta el resumen y usa un título y un padding uniformes. Desde `md` tiene los tamaños de antes.
- `startCountUp` usa un `IntersectionObserver` con umbral de 0,6 y deja de observar cada cifra al animarla. Termina escribiendo el texto original, no el número calculado.
- Logos recortados con `sharp` (`trim`): Xerox de 254 × 121 a 254 × 52, Epson de 292 × 268 a 266 × 60 y Lenovo de 291 × 250 a 261 × 75. HP no tenía margen. Caja: 112 × 40 px y 144 × 48 desde `md`.
- El título de aliados lleva `container-xl` para que no toque los bordes en mobile.
- En pantallas táctiles, "Ver cotización" de `ProductTile` aparece con hover o foco, como desde la spec 02. Esta spec no lo cambia.

## QA realizada

- **Navegador:** Chromium con `npm run dev` y catálogo de muestra.
- **Carruseles a 390 px:** productos 68 %, servicios 78 %, testimonios 84 %, "Te puede interesar" 62 % y "Otros servicios" 72 %, con la primera tarjeta a 20 px del borde, `scroll-snap` en x y sin barra. Tras desplazar, una tarjeta se detiene a 20 px.
- **Servicios:** 4 tarjetas de 380 px, de "01 / 04" a "04 / 04" y sin resumen.
- **Testimonios:** `tabindex="0"`; con la flecha derecha avanzan 306 px.
- **Scroll horizontal:** ninguno a 375 ni 390 px en Inicio, Nosotros, ficha y detalle de servicio.
- **Desde `md`:** a 768 y 1440 px, el ancho y el alto de cada tarjeta, la separación y los tamaños de título de las cinco listas coinciden con `staging`.
- **Contador:** a los 250 ms marca "+449" y a los 1,2 s, "+1000"; no se repite al volver. Con `prefers-reduced-motion` muestra la cifra final. En Nosotros también anima. El HTML del build trae "+1000", "+2500", "+14" y "+3000".
- **Aliados:** los 4 logos miden 144 × 48 px a 768 y 1440 px. El título es un `<h2>` centrado del mismo tamaño que "Algunos de los servicios que ofrecemos" (26, 31 y 36 px a 390, 768 y 1440 px), en Inicio y Nosotros.
- **Consola:** sin errores.
- **`npm run typecheck`:** sin errores.
- **`npm run build:local`:** sin errores, 14 páginas sin catálogo de muestra.
- **`npm run check:standard`:** 0 errores y 2 avisos (14 páginas sin `og:image`; 150 KB de JavaScript en `/contacto`, que no se toca en esta spec).
- **Sin probar:** Safari iOS y Chrome Android reales, lector de pantalla y `npm run build` con TinaCloud.
