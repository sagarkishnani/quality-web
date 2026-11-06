# SPEC 11 — Servicios y Medioambiente mobile

> **Estado:** Aprobado
> **Depende de:** SPEC 07 y SPEC 09 ("Otros servicios" en carrusel)
> **Fecha:** 2026-11-06
> **Objetivo:** Adaptar Servicios, el detalle de servicio y Medioambiente a la referencia mobile con el explorador en acordeón, "‹ Servicios" y la línea verde entre pilares, sin cambiar desktop.

## Por qué existe esta spec

Por debajo de `lg`, el explorador de servicios apila la lista sobre una tarjeta grande que solo cambia con hover, algo que en pantallas táctiles no funciona. El hero del detalle repite la miga completa, y en Medioambiente la línea verde que une los pilares no se ve. La referencia mobile (`Quality Sumprint Mobile.html`) resuelve las tres cosas con un acordeón, "‹ Servicios" y un trazo propio para mobile. Es la última spec del plan mobile.

## Alcance

**Entra: Servicios (`/servicios`, por debajo de `lg`)**

- El explorador pasa a acordeón. Cada fila es un botón con número, nombre y flecha que gira.
- El servicio abierto muestra su imagen (180 px), su resumen y "Ver servicio".
- Empieza con el primero abierto. Tocar otro lo cambia; tocar el abierto lo cierra.
- Se abre en 300 ms y sin animación con `prefers-reduced-motion`.
- Desde `lg` sigue la lista con la tarjeta grande al lado.

**Entra: detalle de servicio (por debajo de `md`)**

- "‹ Servicios" en lugar de la miga del hero.
- El botón "Solicitar servicio" y el título de "¿En qué consiste?" se mantienen.

**Entra: Medioambiente (por debajo de `lg`)**

- La línea verde entre pilares también se ve en mobile, con el trazo de la referencia, que va de un borde al otro entre los pilares apilados.
- Se dibuja con el scroll, igual que en desktop. Con `prefers-reduced-motion` queda completa y quieta.
- Desde `lg` sigue el trazo actual.

**No entra:**

- Desktop de las tres pantallas.
- Textos cortos de la referencia: el subtítulo del hero de Servicios y el compromiso de Medioambiente siguen iguales en todos los anchos.
- "¿Por qué elegirnos?", el banner final y Contacto.
- "Otros servicios", que ya va en carrusel desde la spec 09.
- Cambios de contenido o de schema en Tina.

## Modelo de datos

No hay datos nuevos ni cambios en Tina.

**`ServicesExplorerReact.tsx`**

| Estado | Antes | Después |
|---|---|---|
| Servicio activo en desktop | `active: number` (hover y foco) | Sin cambios |
| Servicio abierto en mobile | — | `openIndex: number \| null`, empieza en `0` |

Reglas:

- Por debajo de `lg` se ve el acordeón (`lg:hidden`) y desde `lg` la lista con la tarjeta (`hidden lg:grid`). Son dos bloques porque la lista de desktop son enlaces que se activan con hover, y el acordeón son botones que se abren al tocar. El bloque oculto no ocupa espacio ni entra en el árbol accesible.
- Cada fila es un `button` con `aria-expanded` y `aria-controls`. Su panel queda montado, con `inert` mientras está cerrado, y se abre con la técnica de `grid-template-rows` de `0fr` a `1fr` en 300 ms.
- Tocar la fila abierta deja `openIndex` en `null`.

**`ServiceDetailReact.tsx` (`ServiceHero`)**

- "‹ Servicios" es un enlace blanco `md:hidden` a `servicesHref`. La miga (`Breadcrumbs tone="inverse"`) pasa a `hidden md:block`.

**`EnvironmentSections.tsx` (`EnvironmentPillars`)**

- Se suma un segundo `svg` con `data-scroll-line` y `lg:hidden`, con el trazo mobile de la referencia: `M 8 0 C 8 30, 92 40, 92 80 S 8 130, 8 170 S 92 220, 92 260 S 50 290, 50 306`.
- El `svg` actual sigue con `hidden lg:block`.

**`src/utils/scrollLine.ts`**

- Deja de exigir `min-width: 1024px` y dibuja solo las líneas visibles: las que tienen `getClientRects().length > 0`. Así, cada `svg` se anima en su ancho.
- Vuelve a calcular al cruzar `lg`, con `matchMedia`, y al cambiar `prefers-reduced-motion`.

## Plan de implementación

1. **Rama.** Crear `feat/spec-11-servicios-medioambiente-mobile` desde `staging` actualizado.
2. **Acordeón.** En `ServicesExplorerReact.tsx`, sumar `openIndex` y el acordeón por debajo de `lg`. Cada fila lleva número, nombre y flecha; el panel tiene imagen de 180 px, resumen y "Ver servicio". Usar `inert`, 300 ms y `motion-reduce`. La lista con tarjeta queda desde `lg`.
3. **"‹ Servicios".** En `ServiceHero`, el enlace por debajo de `md` y la miga desde `md`.
4. **Línea mobile.** Sumar el `svg` con el trazo mobile en `EnvironmentPillars`, con `lg:hidden`.
5. **Script de la línea.** Adaptar `scrollLine.ts` para que dibuje las líneas visibles en cualquier ancho y vuelva a calcular al cruzar `lg`.
6. **Registro.** Actualizar en `CLAUDE.md` el párrafo de la línea de Medioambiente (hoy dice que por debajo de `lg` no se muestra) y el brief en `quality-contexto/README.md`.
7. **Cierre.** Ejecutar `npm run typecheck`, `npm run build:local` y `npm run check:standard` sin catálogo de muestra. Probar a 375, 390, 768, 1024 y 1440 px.

## Criterios de aceptación

**Servicios a 375 y 390 px**

- [ ] El explorador se ve como acordeón: cada servicio es una fila con número, nombre y flecha.
- [ ] Al cargar, el primer servicio está abierto, con su imagen, su resumen y "Ver servicio", y su fila tiene `aria-expanded="true"`.
- [ ] Tocar otro servicio lo abre y cierra el anterior; tocar el abierto lo cierra.
- [ ] El panel se abre en 300 ms y la flecha gira.
- [ ] "Ver servicio" lleva al detalle de ese servicio.
- [ ] Con un panel cerrado, sus enlaces no reciben foco con Tab.
- [ ] Las filas tienen al menos 44 px de alto.

**Detalle de servicio a 390 px**

- [ ] El hero muestra "‹ Servicios", que lleva a `/servicios`, y no la miga.
- [ ] El botón "Solicitar servicio" y el título de "¿En qué consiste?" siguen.

**Medioambiente a 390 px**

- [ ] La línea verde se ve entre los pilares con el trazo mobile, y no la de desktop.
- [ ] La línea se dibuja al bajar y está completa al final de la sección.

**Movimiento reducido**

- [ ] Con `prefers-reduced-motion`, el acordeón se abre sin transición y la línea mobile está completa desde el inicio.

**Desktop (1024 y 1440 px)**

- [ ] El explorador, el hero del detalle y los pilares se ven y funcionan igual que en `staging`, y la línea de desktop se sigue dibujando con el scroll.

**General**

- [ ] Ninguna de las tres pantallas tiene scroll horizontal a 375 px.
- [ ] El schema de Tina no cambia.
- [ ] La consola no muestra errores.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run build:local` termina sin errores.
- [ ] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.

## Decisiones

- **Sí:** el detalle de servicio conserva el botón "Solicitar servicio" y el título de "¿En qué consiste?"; solo la miga pasa a "‹ Servicios". El botón es la acción principal de la página. Decidido por Esteban el 2026-11-06.
- **Sí:** el acordeón empieza con el primer servicio abierto, como la referencia, y se puede cerrar. Decidido por Esteban el 2026-11-06.
- **Sí:** la línea de Medioambiente se ve en mobile con el trazo de la referencia (decisión del 2026-11-02). Usa el mismo `scrollLine.ts` y su `clip-path`, no el `stroke-dashoffset` de la referencia, que no funciona con `non-scaling-stroke`.
- **Sí:** el acordeón y la lista de desktop son dos bloques. Uno navega con hover y el otro abre con toque, y mezclarlos dejaría enlaces que también abren paneles.
- **Sí:** el acordeón cambia por debajo de `lg` y el enlace "‹ Servicios" por debajo de `md`, como en el catálogo y la ficha de la spec 10.
- **Sí:** el acordeón dura 300 ms y no 500 a 800 ms como la referencia. El estándar pide de 150 a 300 ms.
- **No:** traer los textos cortos de la referencia. Los textos son iguales en todos los anchos (decisión del 2026-11-02).

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El panel cerrado deja enlaces enfocables. | `inert` mientras está cerrado; comprobarlo con Tab. |
| La animación de `grid-template-rows` no corre en algún navegador. | Si no corre, el panel abre sin transición, pero abre. |
| Al cruzar `lg`, la línea que aparece queda sin dibujar o la que se oculta queda a medias. | Volver a calcular al cruzar `lg` con `matchMedia`, y probar redimensionando de 390 a 1440 px. |
| La línea mobile tapa texto de los pilares. | El `svg` va detrás del contenido; revisar a 390 px que no cruce texto ni botones. |
| Las imágenes del acordeón cargan las 7 al inicio. | `loading="lazy"`: solo cargan al abrir el panel o cerca de la pantalla. |

## Qué no entra en esta spec

- Desktop de Servicios, del detalle de servicio y de Medioambiente.
- Textos cortos de la referencia.
- "¿Por qué elegirnos?", el banner final y Contacto.
- "Otros servicios" (spec 09).
- Cambios de contenido o de schema en Tina.

Si alguno de estos entra, va en su propia spec.
