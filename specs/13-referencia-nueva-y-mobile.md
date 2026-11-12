# SPEC 13 — Ajustes de la referencia nueva y correcciones mobile

> **Estado:** Aprobado
> **Depende de:** SPEC 05 (Medioambiente), SPEC 09 (carruseles) y SPEC 12 (correcciones de UI)
> **Fecha:** 2026-11-11
> **Objetivo:** Llevar al sitio los cambios de `Quality Sumprint (2).html` y los assets nuevos, y corregir la alineación de las cifras y el footer en mobile.

## Por qué existe esta spec

Llegó una versión nueva de la referencia desktop junto con videos en WebM, íconos e imágenes. Comparada con `Quality Sumprint Desktop.html`, cambia secciones del inicio, Nosotros, Servicios, Medioambiente, Contacto y el catálogo. Además, en el celular las cifras de Nosotros quedan desalineadas y el footer deja Empresa y Contacto en una fila cada una.

## Alcance

**Entra:**

1. **Cifras (mobile):** en cada fila, las cifras quedan a la misma altura aunque una etiqueta ocupe dos líneas.
2. **Footer (mobile):** Empresa y Contacto en dos columnas; el correo se corta después de la `@`.
3. **Servicios del inicio:** el párrafo va debajo del título y "Ver todos los servicios" sube a la derecha del encabezado.
4. **Banner "Cuidamos el medio ambiente" (inicio):** video `eco-loop` con la imagen actual como póster, degradado vertical y sombra en el texto.
5. **Misión y Visión:** cada una lleva su ícono (`icon-mision.svg`, `icon-vision.svg`).
6. **Antes y Después:** los títulos pasan a "Antes" y "Después".
7. **Solución integral:** se quita la sección "Concentra tu negocio…" de Nosotros.
8. **Explorador de Servicios:** sin números en la lista ni contador `01 / 07`, en mobile y desktop.
9. **Pilares de Medioambiente:** el 01 usa `eco-cartuchos` y el 03 pasa de video a `eco-plotter`.
10. **Banner final de Medioambiente:** video `v3` con la imagen actual como póster.
11. **Videos en WebM + MP4:** el hero de Medioambiente y los dos videos nuevos se sirven en WebM, con MP4 de respaldo.
12. **Contacto:** las tarjetas de correo, teléfono y dirección van sin flecha.
13. **Checkbox:** los filtros del catálogo y el bundle de la ficha usan `checkbox.svg` y `checkbox-empty.svg`.
14. **Imágenes nuevas:** `nosotros-building` en el hero de `/nosotros` y `banner-tintas-hp` en el banner claro "Accesorios de impresora" de `/productos`.
15. **Botón "Ver cotización" de la tarjeta de producto:** pasa de estar sobre la imagen a quedar entre la imagen y el texto. Sigue apareciendo solo con mouse o teclado.
16. **Buscador del header:** como la referencia (desktop del HTML nuevo, mobile de `Quality Sumprint Mobile.html`): input más grande y de peso normal, lupa de trazo fino, línea inferior más oscura, panel de 1000 px, X dentro del panel en desktop (la lupa del header ya no cambia a X), "Productos populares" sin mayúsculas y resultados sin flecha (4 columnas en desktop, lista con separadores en mobile). Sin anillo de foco: la línea inferior se oscurece.

**Fuera de alcance:**

- Fundido entre páginas (View Transitions).
- Reemplazar `react-icons` por los SVG de `icons-navigation`.
- Reemplazar las imágenes que ya existen por las de la carpeta nueva: tienen las mismas medidas y pesan más.
- El video `v2`, que el HTML no usa.
- Subrayados de 1 px del menú y los enlaces: el sitio usa `link-arrow`.
- Los contadores `01 / 04` del bento del inicio, que la referencia mantiene.

## Modelo de datos

Cambia el schema de Tina en tres colecciones. Todos los campos nuevos son opcionales, así que el contenido que ya existe sigue siendo válido.

**`environment`** (`tina/collections/environment.ts`)

| Objeto | Campo | Tipo | Cambio |
|---|---|---|---|
| `hero` | `video` | texto | Sin cambio: ruta del MP4 |
| `hero` | `videoWebm` | texto | **Nuevo:** ruta del WebM |
| `banner` | `video` | texto | **Nuevo:** ruta del MP4 |
| `banner` | `videoWebm` | texto | **Nuevo:** ruta del WebM |
| `banner` | `image` | imagen | Pasa a ser el póster cuando hay video |

**`home`** (`tina/collections/home.ts`)

| Objeto | Campo | Tipo | Cambio |
|---|---|---|---|
| `ecoBanner` | `video` | texto | **Nuevo:** ruta del MP4 |
| `ecoBanner` | `videoWebm` | texto | **Nuevo:** ruta del WebM |
| `ecoBanner` | `image` | imagen | Pasa a ser el póster cuando hay video |

**`about`** (`tina/collections/about.ts`)

| Objeto | Campo | Tipo | Cambio |
|---|---|---|---|
| `values[]` | `icon` | imagen | **Nuevo:** ícono de la tarjeta; sin él, la hoja |
| `solution` | — | objeto | **Se elimina** junto con su contenido |

Con un solo formato cargado, se sirve ese. Sin ninguno, queda la imagen.

**Archivos nuevos en `public/`**

| Ruta | Origen |
|---|---|
| `videos/medioambiente-hero.webm` | `v1 (2).webm` |
| `videos/inicio-medioambiente.webm` / `.mp4` | `eco-loop (1).webm` / MP4 sacado del HTML |
| `videos/medioambiente-banner.webm` / `.mp4` | `v3 (1).webm` / MP4 sacado del HTML |
| `images/medioambiente/cartuchos.webp` | `eco-cartuchos.webp` |
| `images/medioambiente/plotter.webp` | `eco-plotter.webp` |
| `images/nosotros/edificio.webp` | `nosotros-building.webp` |
| `images/banners/tintas-hp.webp` | `banner-tintas-hp.webp` |
| `images/brand/mision.svg`, `vision.svg` | `icons-brand/icon-mision.svg`, `icon-vision.svg` |
| `images/brand/checkbox.svg`, `checkbox-vacio.svg` | `icons-brand/checkbox.svg`, `checkbox-empty.svg` |

**Se eliminan**, si nada más los usa: `videos/impresion-responsable.mp4`, `images/medioambiente/impresion-poster.webp` e `images/medioambiente/impresora-2.webp`.

**Contenido (JSON):** `about` (títulos de Antes y Después, hero, íconos y sin `solution`), `environment` (imágenes de los pilares 01 y 03, pilar 03 sin video, videos del hero y del banner), `home` (videos de `ecoBanner`) y `shop` (imagen del banner "Accesorios de impresora").

## Plan de implementación

Cada paso deja el sitio compilando y funcionando.

1. **Correcciones mobile:**
   - `StatGrid.tsx`: la tarjeta suma `justify-end`, que con `flex-col-reverse` alinea el contenido arriba.
   - `FooterReact.tsx`: Contacto deja `col-span-2` y queda a la par de Empresa. El correo lleva un `<wbr>` después de la `@` en lugar de `break-all`.
2. **Video compartido:**
   - `BackgroundVideo` sale de `EnvironmentSections.tsx` a `ui/BackgroundVideo.tsx` y recibe `webm`, `mp4` y `poster`.
   - Renderiza un `<source>` WebM y otro MP4, en ese orden, y sigue marcando `data-motion-video`.
   - `lazyVideo.ts` carga los `<source>` (`data-src` → `src` y `video.load()`) en vez de `video.src`.
   - Medioambiente sigue igual hasta el paso 3.
3. **Schema y videos:**
   - Se suman los campos del modelo de datos en `environment.ts` y `home.ts`.
   - Los archivos de video se copian a `public/videos/`. Los MP4 de `eco-loop` y `v3` se extraen del HTML con un script fuera del repo.
   - En el JSON se cargan `videoWebm` del hero, `video` y `videoWebm` del banner final, y los dos de `ecoBanner`.
4. **Banner final de Medioambiente:** usa `BackgroundVideo` con `lazy`, la imagen como póster y el parallax actual.
5. **Banner del inicio:**
   - `ImageBanner` acepta `video` y `videoWebm` y usa `BackgroundVideo` con `lazy`. Sin video, sigue con la imagen.
   - El oscurecido plano pasa a degradado vertical y el texto suma sombra.
6. **Servicios del inicio:**
   - `SectionHeading` suma la variante con descripción debajo del título y enlace a la derecha, cuando vienen los dos.
   - `HomeServices` la usa y quita el enlace centrado del pie.
7. **Nosotros:**
   - Campo `icon` en `values[]`. `AboutValues` usa ese ícono y, sin él, la hoja.
   - Títulos "Antes" y "Después" en el JSON.
   - Se eliminan `AboutSolution`, su uso en `nosotros.astro`, el objeto `solution` del schema y su contenido.
   - El hero usa `images/nosotros/edificio.webp`.
8. **Explorador de Servicios:** `ServicesExplorerReact.tsx` quita los números de la lista desktop, del acordeón mobile y del contador, y `pad` si deja de usarse.
9. **Pilares de Medioambiente:**
   - El 01 usa `cartuchos.webp`. El 03 usa `plotter.webp`, sin video.
   - Se eliminan los archivos que quedan sin uso (modelo de datos).
10. **Contacto:** `ContactIntroReact.tsx` quita el `FaArrowRight` de las tarjetas.
11. **Checkbox:**
    - `ProductCatalogReact.tsx` y `BundleQuoteReact.tsx` reemplazan la caja dibujada con `FaCheck` por `checkbox.svg` (marcado) y `checkbox-vacio.svg` (sin marcar).
    - El `input` sigue siendo el control real (`sr-only`) y el foco sigue visible.
12. **Banner de `/productos`:** el banner "Accesorios de impresora" del JSON de `shop` usa `banners/tintas-hp.webp`.
13. **Botón de la tarjeta:** en `ProductTile.tsx`, el botón sale del bloque de la imagen a un espacio propio entre la imagen y el texto. Ese espacio solo existe con `[@media(hover:hover)]` y el botón aparece con hover o foco, con `z-10` sobre el enlace extendido.
14. **Buscador:** en `HeaderReact.tsx` (`SearchPanel`), token `text-search` (22 px en mobile y 34 px en desktop, peso 400) y color `line-input` (`#B9BEC3`) en `tailwind.config.mjs`. El input lleva `focus-visible:ring-0`, y el contenedor, `focus-within:border-ink`.
15. **Documentación:** `CLAUDE.md` registra:
    - `BackgroundVideo` compartido con WebM + MP4 y el campo `videoWebm`.
    - El video del banner del inicio y del banner final de Medioambiente.
    - La colección `about` sin `solution`.

## Criterios de aceptación

**Mobile (375 y 390 px)**

- [ ] En Nosotros, `+1000` y `+2500` quedan a la misma altura aunque "Trabajos realizados con éxito" ocupe dos líneas. Lo mismo en la otra fila y en el inicio.
- [ ] En el footer, Empresa y Contacto quedan lado a lado.
- [ ] El correo del footer se corta solo después de la `@`, y "qualitysumprint.com" queda entero en una línea.
- [ ] Los enlaces del footer siguen midiendo 44 px de alto.

**Inicio**

- [ ] En Servicios, el párrafo va debajo del título y "Ver todos los servicios" está a la derecha desde `md`. No queda ningún enlace en el pie de la sección.
- [ ] El banner "Cuidamos el medio ambiente" reproduce `eco-loop`.
- [ ] El video del banner no se descarga hasta acercarse a la pantalla (pestaña Red).
- [ ] Sin video cargado en el CMS, el banner muestra la imagen como hoy.

**Nosotros**

- [ ] Misión y Visión muestran cada una su ícono. Sin ícono en el CMS, aparece la hoja.
- [ ] Los títulos dicen "Antes" y "Después".
- [ ] La sección "Concentra tu negocio…" ya no aparece y `solution` no existe en el panel de Tina.
- [ ] El hero muestra la foto del edificio.

**Servicios**

- [ ] El explorador no muestra números en la lista desktop, en el acordeón mobile ni en la tarjeta.

**Medioambiente**

- [ ] El pilar 01 muestra `cartuchos.webp` y el 03 muestra `plotter.webp`, sin video.
- [ ] El banner final reproduce `v3`, carga diferida y con la imagen actual como póster.
- [ ] El hero y la franja siguen reproduciendo su video.

**Videos**

- [ ] En Chrome y Firefox se descarga solo el WebM; el MP4 no aparece en la pestaña Red.
- [ ] En Safari se reproducen los tres videos.
- [ ] Con `prefers-reduced-motion`, ningún video avanza.

**Contacto, catálogo y ficha**

- [ ] Las tarjetas de correo, teléfono y dirección van sin flecha.
- [ ] Los filtros de Categoría y Marca y el bundle usan los SVG de checkbox, marcado y sin marcar.
- [ ] Los checkbox funcionan con teclado (Tab y Espacio) y muestran el foco.
- [ ] Con mouse, "Ver cotización" aparece entre la imagen y la marca sin tapar la imagen ni el texto, y lleva a la cotización.
- [ ] Con teclado, el botón aparece al recibir el foco.
- [ ] En pantallas táctiles el botón no aparece, no queda hueco y tocar la tarjeta abre la ficha.
- [ ] El buscador (desktop y mobile) se ve como la referencia: input de 34 px en desktop y 22 px a 390 px, lupa fina y resultados sin flecha.
- [ ] Al abrir el buscador no aparece el anillo azul; la línea inferior pasa a `ink` mientras el input tiene el foco.
- [ ] En desktop, la X del panel lo cierra y la lupa del header no cambia de ícono.
- [ ] El banner "Accesorios de impresora" de `/productos` muestra `tintas-hp.webp`.

**General**

- [ ] `public/` no conserva `impresion-responsable.mp4`, `impresion-poster.webp` ni `impresora-2.webp`, salvo que algo más los use.
- [ ] Ninguna página tiene scroll horizontal a 375 y 390 px.
- [ ] Fuera de lo listado, desktop (1024 y 1440 px) mide igual que `staging`.
- [ ] `typecheck`, `build:local` y `check:standard` pasan (0 errores).
- [ ] La consola no muestra errores.

## Decisiones tomadas y descartadas

**Tomadas:**

- **Alcance:** entran los cambios de diseño del HTML nuevo, los checkbox SVG y las dos correcciones mobile. Decidido por Esteban el 2026-11-11.
- **Videos en WebM con MP4 de respaldo:** el WebM pesa unos 0,5 MB contra 3 a 7 MB del MP4, y el navegador baja solo el primer formato que soporta. El MP4 cubre los Safari que no reproducen VP9. Decidido por Esteban el 2026-11-11.
- **Campo `videoWebm` aparte:** `video` sigue siendo el MP4, así que el contenido actual no se rompe y cada archivo se ve en el panel. Decidido por Esteban el 2026-11-11.
- **Video en el banner final de Medioambiente:** la spec 05 lo descartó porque pesaba 7 MB. En WebM pesa 0,5 MB y va con carga diferida. Decidido por Esteban el 2026-11-11.
- **Correo cortado después de la `@`:** se lee entero y no cambia el tamaño de letra. Decidido por Esteban el 2026-11-11.
- **Sin números en el explorador, mobile incluido:** el HTML nuevo los quita en desktop, y así el explorador queda igual en los dos anchos. Decidido por Esteban el 2026-11-11.
- **Se suman `nosotros-building` y `banner-tintas-hp`:** el hero de Nosotros deja de repetir la foto del slider, y el banner de `/productos` deja de repetir la de Medioambiente. Decidido por Esteban el 2026-11-11.
- **`tintas-hp` en el banner claro, no en el oscuro:** la spec decía "banner oscuro", pero ese es la oferta de la M2727 con la foto del producto. El que repetía la foto de Medioambiente es "Accesorios de impresora" (claro), y sigue claro. Decidido por Esteban durante la implementación, el 2026-11-12.
- **"Ver cotización" entre la imagen y el texto:** revierte la decisión de la spec 12 de ponerlo sobre la imagen, aunque la referencia nueva también lo deja ahí. Sigue apareciendo solo con hover o teclado, en un espacio reservado que solo existe en pantallas con mouse, así que en mobile la tarjeta no cambia. Decidido por Esteban durante la implementación, el 2026-11-12.
- **Buscador como la referencia, con la línea inferior como indicador de foco:** la referencia no muestra foco en el input. Se quita el anillo global, pero la línea se oscurece para seguir cumpliendo WCAG 2.4.7. Decidido por Esteban durante la implementación, el 2026-11-12.
- **Se quedan las imágenes del repo:** las de la carpeta nueva tienen las mismas medidas y pesan entre 25 % y 90 % más.
- **`BackgroundVideo` compartido en `ui/`:** ahora lo usan Medioambiente y el inicio, y la regla de `lazy` y `prefers-reduced-motion` queda en un solo lugar.
- **Ícono de Misión y Visión como campo del CMS:** sigue el patrón de que el contenido sale de Tina. La hoja queda de respaldo.
- **Eliminar `solution` del schema y del contenido:** dejarlo oculto sería código muerto.

**Descartadas:**

- **Fundido entre páginas:** en un sitio de varias páginas pide View Transitions y reiniciar los scripts de cada carga. Va en otra spec si se pide.
- **SVG propios en vez de `react-icons`:** toca casi todos los componentes sin cambiar lo que se ve.
- **Solo WebM:** en iPhone con iOS anterior a 17.4 quedaría solo el póster.
- **Una ruta sin extensión para los dos videos:** si falta un archivo, falla sin aviso.
- **Contacto a todo el ancho en el footer:** no resolvía el pedido de dos columnas.

## Riesgos

- **"qualitysumprint.com" en 167 px:** a 16 px mide cerca del ancho de la columna. Si no entra a 375 px, se baja el correo a `text-body-sm` solo en mobile.
- **Peso del repo:** los MP4 de respaldo suman unos 10 MB, aunque los navegadores modernos no los descargan.
- **Identidad de `v1`:** se asume que `v1 (2).webm` es el video del hero de Medioambiente. Hay que confirmarlo a ojo antes de publicarlo.
- **Carga diferida con `<source>`:** cambiar `lazyVideo.ts` afecta la franja de Medioambiente. Hay que verificar que siga cargando al acercarse.
- **Póster de los videos nuevos:** se usa la imagen actual del banner, que puede no coincidir con el primer cuadro del video, y se nota un salto al empezar.
