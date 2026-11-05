# SPEC 10 — Catálogo mobile

> **Estado:** Aprobado
> **Depende de:** SPEC 07 (y SPEC 09 por "Te puede interesar", en el PR #10)
> **Fecha:** 2026-11-05
> **Objetivo:** Adaptar el catálogo y la ficha de producto a la referencia mobile con chips de segmento, hoja de filtros, grilla de 2 columnas y galería con gesto, sin cambiar desktop.

## Por qué existe esta spec

Por debajo de `lg`, el catálogo apila los filtros de Categoría y Marca sobre el listado y muestra una tarjeta por fila, así que hay que bajar mucho para ver productos. En la ficha, la miga completa, las miniaturas y las especificaciones en dos columnas ocupan espacio en 390 px. La referencia mobile (`Quality Sumprint Mobile.html`) resuelve las dos pantallas con chips, una hoja de filtros, 2 columnas y una galería con puntos y gesto.

## Alcance

**Entra: catálogo (`/productos` y `/productos/categoria/<slug>`)**

- **Segmentos (por debajo de `lg`):** chips con desplazamiento horizontal en lugar de pestañas subrayadas.
- **Búsqueda y orden (por debajo de `lg`):** la búsqueda va a todo el ancho; debajo, "Filtrar" y el orden en una fila, y debajo de ambos, el conteo.
- **Botón "Filtrar":** abre una hoja inferior y muestra un indicador con el número de filtros activos.
- **Hoja de filtros:**
  - Título "Filtros" y "Limpiar".
  - Categoría y Marca como chips con su conteo.
  - Botón "Ver N productos", que la cierra.
  - Los filtros se aplican al tocar el chip.
  - Entra desde abajo en 300 ms.
- **Listado:** grilla de 2 columnas por debajo de `sm`, con `ProductTile` compacta (14 px de padding y textos más chicos) por debajo de `md`.

**Entra: ficha de producto (por debajo de `md`)**

- **Navegación:** "‹ Productos" en lugar de la miga completa.
- **Galería:**
  - Puntos debajo de la imagen.
  - Cambio de imagen con gesto horizontal, además de las flechas.
  - Sin miniaturas ni contador "1 / 4".
- **Especificaciones:** la etiqueta va arriba y el valor debajo.

**No entra:**

- Desktop: pestañas, barra lateral de filtros con casillas, grilla de 3 columnas, migas, miniaturas y especificaciones en 2 columnas.
- Banners del catálogo y título de la descripción: siguen iguales en todos los anchos.
- "Te puede interesar" (spec 09) y "Puedes comprar con".
- Explorador de servicios y Medioambiente (spec 11).
- Cambios de contenido o de schema en Tina.

## Modelo de datos

No hay datos nuevos ni cambios en Tina. Cambia el estado de dos islas y se suman props.

**`ProductCatalogReact.tsx`**

| Estado o pieza | Antes | Después |
|---|---|---|
| Hoja de filtros | — | `filtersOpen: boolean` |
| Filtros activos | — | `activeFilterCount = categories.length + brands.length`, para el indicador de "Filtrar" |
| Chip | — | Componente local `Chip`, botón con `aria-pressed`. Lo usan los segmentos (sin conteo) y la hoja (con conteo). |

Reglas:

- Por debajo de `lg` se ven los chips de segmento, la fila "Filtrar | orden" y la hoja. Desde `lg` siguen las pestañas, la barra lateral con casillas y la fila actual.
- La hoja se monta en `document.body` con `createPortal`. Así queda por encima del header, porque `.sheet` crea su propio contexto de apilamiento (`relative z-10`).
- La hoja sigue el patrón del menú de la spec 08:
  - Siempre montada y con `inert` mientras está cerrada.
  - Lleva `data-lenis-prevent` y bloquea el scroll del `body`.
  - Escape, el fondo o "Ver N productos" la cierran.
  - Al pasar a `lg`, se cierra.
- "Limpiar" vacía categoría y marca, no la búsqueda.

**`ProductTile.tsx`**

- Nueva prop `compact?: boolean`. Por debajo de `md`, baja el padding a 14 px y achica la marca, el nombre y la categoría. Desde `md` es la tarjeta actual.
- La usan la grilla del catálogo y la de `/productos/categoria/<slug>`.

**`ProductGalleryReact.tsx`**

- Gesto: guarda la `x` de `touchstart` y, en `touchend`, cambia de imagen si el desplazamiento supera 40 px.
- Por debajo de `md`, los puntos (`button` con `aria-label` y `aria-current`) reemplazan las miniaturas y el contador.

**Ficha (`[slug].astro`)**

- "‹ Productos" es un enlace `md:hidden`, y la miga completa pasa a `hidden md:block`.
- Las especificaciones pasan de `grid-cols-[180px_1fr]` a una columna por debajo de `md`.

## Plan de implementación

1. **Rama.** Crear `feat/spec-10-catalogo-mobile` desde `staging` actualizado.
2. **Chips de segmento.** Crear `Chip` en `ProductCatalogReact.tsx` y mostrar los segmentos como chips desplazables por debajo de `lg`. Desde `lg` siguen las pestañas.
3. **Búsqueda, "Filtrar" y orden.** Por debajo de `lg`: la búsqueda a todo el ancho, la fila "Filtrar | orden" con el indicador de filtros activos, y el conteo debajo. Desde `lg`, la fila actual.
4. **Hoja de filtros.**
   - Portal en `body` con el título, "Limpiar", los chips de Categoría y Marca con su conteo, y "Ver N productos".
   - `inert` mientras está cerrada, bloqueo de scroll y `data-lenis-prevent`.
   - Se cierra con Escape, con el fondo y al pasar a `lg`.
   - Entra en 300 ms, sin animación con `prefers-reduced-motion`.
   - Desde `lg` se oculta y la barra lateral sigue igual.
5. **Tarjeta compacta.** Agregar `compact` a `ProductTile`.
6. **Grilla de 2 columnas.** Usar 2 columnas por debajo de `sm`, con `compact`, en `/productos` y `/productos/categoria/<slug>`. Desde `sm`, las grillas actuales.
7. **"‹ Productos".** En la ficha, el enlace por debajo de `md` y la miga completa desde `md`.
8. **Galería.** Agregar el gesto horizontal y los puntos por debajo de `md`. Las miniaturas y el contador quedan desde `md`.
9. **Especificaciones.** Poner la etiqueta sobre el valor por debajo de `md`.
10. **Registro.** Actualizar la sección de estilos de `CLAUDE.md` si hay un patrón nuevo (hoja inferior en portal) y el brief en `quality-contexto/README.md`.
11. **Cierre.** Ejecutar `npm run typecheck`, `npm run build:local` y `npm run check:standard` sin catálogo de muestra. Probar a 375, 390, 768, 1024 y 1440 px.

## Criterios de aceptación

**Catálogo a 375 y 390 px**

- [ ] Los segmentos se ven como chips desplazables; el seleccionado se distingue sin depender solo del color y tiene `aria-pressed="true"`.
- [ ] La búsqueda va a todo el ancho. Debajo van "Filtrar" y el orden en una fila, y el conteo debajo de ambos.
- [ ] "Filtrar" abre la hoja desde abajo en 300 ms, por encima del header, y bloquea el scroll de la página.
- [ ] Con la hoja cerrada, ningún control de la hoja recibe foco con Tab.
- [ ] La hoja muestra Categoría y Marca como chips con su conteo; tocar un chip filtra el listado al instante.
- [ ] "Ver N productos" muestra el número de productos visibles y cierra la hoja.
- [ ] "Limpiar" quita los filtros de categoría y marca.
- [ ] Con filtros activos, "Filtrar" muestra cuántos hay.
- [ ] Escape, tocar el fondo o pasar a 1024 px cierran la hoja.
- [ ] El listado va en 2 columnas, con las tarjetas compactas, en `/productos` y `/productos/categoria/<slug>`.
- [ ] Ninguna pantalla de catálogo tiene scroll horizontal a 375 px.

**Ficha a 390 px**

- [ ] Arriba se ve "‹ Productos", que lleva a `/productos`, y no la miga completa.
- [ ] La galería muestra puntos y no las miniaturas ni "1 / N".
- [ ] Un gesto horizontal de más de 40 px cambia de imagen, y el punto activo cambia con ella.
- [ ] Cada especificación muestra la etiqueta arriba y el valor debajo.

**Movimiento reducido**

- [ ] Con `prefers-reduced-motion`, la hoja aparece sin transición.

**Desktop (1024 y 1440 px)**

- [ ] El catálogo se ve como en `staging`: pestañas, barra lateral con casillas y grilla.
- [ ] La ficha se ve como en `staging`: migas, miniaturas, contador y especificaciones en 2 columnas.

**General**

- [ ] El schema de Tina no cambia.
- [ ] La consola no muestra errores.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run build:local` termina sin errores.
- [ ] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.

## Decisiones

- **Sí:** la galería sigue la referencia: puntos, gesto y flechas, sin miniaturas ni contador por debajo de `md`. Decidido por Esteban el 2026-11-05.
- **Sí:** la tarjeta es compacta solo en la grilla de 2 columnas y por debajo de `md`. Con 24 px de padding en unos 165 px de ancho, el nombre se partiría en muchas líneas. Decidido por Esteban el 2026-11-05.
- **Sí:** la hoja de filtros usa chips, como la referencia, y desktop sigue con casillas. Decidido por Esteban el 2026-11-05.
- **No:** igualar los banners del catálogo y quitar el título de la descripción. Lo nuevo se queda. Decidido por Esteban el 2026-11-05.
- **Sí:** el catálogo cambia por debajo de `lg` y la ficha por debajo de `md`. La barra lateral de filtros solo existe desde `lg`, y la ficha ya tiene dos columnas desde `lg` y cabe bien en `md`.
- **Sí:** la hoja se monta en un portal sobre `body`. Dentro de `.sheet` no podría quedar por encima del header.
- **Sí:** los filtros se aplican al tocar el chip, como en la referencia. "Ver N productos" solo cierra la hoja; así no hay dos estados de filtro que sincronizar.
- **Sí:** la hoja dura 300 ms y no 700 ms, como en la spec 08. El estándar pide de 150 a 300 ms.
- **Sí:** el gesto de la galería se hace con eventos táctiles, sin dependencias nuevas.
- **No:** usar `scroll-snap` en la galería. Hoy cambia la imagen con un fundido; mantenerlo deja igual a desktop y solo suma el gesto.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `createPortal` falla en el render del servidor, porque `document` no existe. | Montar el portal solo después de hidratar (`useEffect` que marca `mounted`). |
| El gesto horizontal de la galería choca con el scroll vertical de la página. | Cambiar solo si el desplazamiento horizontal supera 40 px y es mayor que el vertical. |
| El bloqueo de scroll de la hoja choca con el del menú mobile. | Ambos guardan y restauran `body.style.overflow`; probar abrir la hoja, cerrarla y abrir el menú. |
| El JavaScript de `/productos` supera el presupuesto de 150 KB. | Sin dependencias nuevas; medirlo con `check:standard` y registrarlo si da aviso. |
| Entre 640 y 767 px, la tarjeta compacta queda en una grilla de 2 columnas más ancha. | Medir a 700 px que la tarjeta no se vea vacía; si hace falta, limitar `compact` a menos de `sm`. |

## Qué no entra en esta spec

- Desktop del catálogo y de la ficha.
- Banners del catálogo y título de la descripción.
- "Te puede interesar" y "Puedes comprar con".
- Explorador de servicios y Medioambiente (spec 11).
- Cambios de contenido o de schema en Tina.

Si alguno de estos entra, va en su propia spec.
