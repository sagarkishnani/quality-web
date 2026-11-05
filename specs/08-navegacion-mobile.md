# SPEC 08 — Navegación mobile

> **Estado:** Implementado
> **Depende de:** SPEC 07
> **Fecha:** 2026-11-02
> **Objetivo:** Llevar el header, el menú, la búsqueda y el footer mobile a la referencia mobile, sin cambiar desktop.

## Por qué existe esta spec

Por debajo de `lg`, el sitio no tiene búsqueda, y el menú despliega todos los servicios y productos a la vez. Además, el footer apila cuatro bloques. La referencia mobile resuelve las tres cosas: lupa en el header, menú en acordeón con botón de asesor, y footer en dos columnas.

## Alcance

**Entra (por debajo de `lg`):**

- Lupa en el header, junto a la hamburguesa.
- Búsqueda mobile: panel bajo el header que reutiliza `SearchPanel`, con su botón de cerrar.
- Hamburguesa de dos líneas que se convierte en X.
- Menú con acordeones:
  - Servicios: "Ver todos los servicios" y los servicios.
  - Productos: "Ver todos los productos", los segmentos y, bajo `categoriesTitle`, las categorías.
- Botones del menú: "Contáctanos" y "Comunícate con un asesor", con los datos de WhatsApp de `global.contact`.
- Menú desde la derecha y búsqueda desde arriba, en 300 ms, sin animación con `prefers-reduced-motion`.
- Footer en grilla de 2 columnas: el logo arriba, debajo Productos | Servicios y Empresa, y Contacto a todo el ancho.

**No entra:**

- Altura del header y tamaño del logo: siguen en 64 y 30 px.
- Marcas en el menú mobile.
- Cambios de contenido o de schema en Tina.
- Header, megamenús y footer de desktop.
- Carruseles, catálogo, servicios y Medioambiente mobile (specs 09 a 11).

## Modelo de datos

No hay datos nuevos ni cambios en Tina. Solo cambia el estado del header en `HeaderReact.tsx`:

| Estado | Antes | Después |
|---|---|---|
| Panel mobile | `mobileOpen: boolean` | `mobilePanel: "menu" \| "search" \| null` |
| Acordeón abierto | — | `mobileSection: "services" \| "products" \| null` |

Reglas:

- Abrir la búsqueda cierra el menú, y abrir el menú cierra la búsqueda.
- Al cerrar el menú, el acordeón vuelve a `null`.
- Escape, elegir un enlace o pasar a `lg` cierran el panel.

Datos que se reutilizan:

- `services`: los servicios.
- `catalog.segments` y `catalog.categories`: los segmentos y las categorías.
- `catalog.products`: los productos de la búsqueda.
- `nav.productsMenu.categoriesTitle`: el título de las categorías.
- `nav.cta`: "Contáctanos".
- `contact.whatsappNumber`, `contact.whatsappMessage` y `contact.whatsappLabel`: el botón de asesor.

## Plan de implementación

1. **Rama.** Crear `feat/spec-08-navegacion-mobile` desde `staging` actualizado, después del merge del PR #8.
2. **Estado.** Reemplazar `mobileOpen` por `mobilePanel`, sin cambiar todavía lo que se ve.
3. **Hamburguesa.** Cambiarla por dos líneas que se convierten en X, con su `aria-label` y `aria-expanded`.
4. **Menú siempre montado.** Mantener el panel en el DOM, desplazado fuera de pantalla y con `inert` mientras está cerrado, para poder animarlo. Entra desde la derecha en 300 ms.
5. **Acordeones.** Convertir Servicios y Productos en botones con `aria-expanded` y sus listas, con los títulos y enlaces del alcance.
6. **Botones del menú.** Agregar "Comunícate con un asesor" bajo "Contáctanos".
7. **Búsqueda mobile.** Agregar la lupa y el panel con `SearchPanel` y su botón de cerrar. Baja desde arriba en 300 ms.
8. **Movimiento reducido.** Sin transiciones con `prefers-reduced-motion`.
9. **Footer.** Grilla de 2 columnas por debajo de `md`, con el logo y Contacto a todo el ancho.
10. **Registro.** Actualizar la sección de estilos de `CLAUDE.md` si cambia algún patrón, y el brief en `quality-contexto/README.md`.
11. **Cierre.** Ejecutar `npm run typecheck`, `npm run build:local` y `npm run check:standard` sin catálogo de muestra. Probar a 375, 390, 768 y 1440 px.

## Criterios de aceptación

**Header (375 y 390 px)**

- [x] El header muestra el logo, la lupa y la hamburguesa de dos líneas, y mide 64 px.
- [x] La lupa y la hamburguesa tienen un área táctil de al menos 44 × 44 px.
- [x] Al abrir el menú, la hamburguesa pasa a X y `aria-expanded` vale `true`.

**Menú**

- [x] El menú entra desde la derecha en 300 ms y bloquea el scroll de la página.
- [x] Con el menú cerrado, ningún enlace del menú recibe foco con Tab.
- [x] Servicios y Productos empiezan cerrados, y abrir uno cierra el otro.
- [x] Servicios muestra "Ver todos los servicios" y los 7 servicios.
- [x] Productos muestra "Ver todos los productos", los segmentos y, bajo "Por tipo", las categorías, sin marcas.
- [x] "Comunícate con un asesor" abre `wa.me` con el número y el mensaje de `global.contact` en una pestaña nueva.
- [x] Elegir un enlace, pulsar Escape o pasar a 1024 px cierra el menú.

**Búsqueda**

- [x] La lupa abre el panel desde arriba en 300 ms, con foco en el campo.
- [x] Sin texto, el panel muestra "Productos populares". Al escribir, filtra los productos.
- [x] El botón de cerrar y Escape cierran el panel.
- [x] Abrir la búsqueda cierra el menú, y abrir el menú cierra la búsqueda.

**Movimiento reducido**

- [x] Con `prefers-reduced-motion`, el menú y la búsqueda aparecen sin transición.

**Footer (390 px)**

- [x] El logo va a todo el ancho; debajo van Productos | Servicios y Empresa en 2 columnas, y Contacto a todo el ancho.
- [x] El correo y la dirección se leen completos, sin desbordar su columna.

**Desktop (1024 y 1440 px)**

- [x] El header, los megamenús, la búsqueda y el footer se ven y funcionan igual que en `staging`.

**General**

- [x] Ninguna de las 8 pantallas tiene scroll horizontal a 375 px.
- [x] El schema de Tina no cambia.

**Cierre**

- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build:local` termina sin errores.
- [x] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.

## Decisiones

- **Sí:** el header mantiene 64 px y el logo de 30 px. Bajar a 56 px cambiaría el desplazamiento superior de todas las páginas por 8 px.
- **Sí:** el footer usa una grilla de 2 columnas con las mismas columnas de Tina. Lo acorta sin que mobile y desktop tengan enlaces distintos.
- **No:** copiar el footer de la referencia, que oculta Servicios y cambia los enlaces de Empresa solo en mobile.
- **Sí:** Contacto a todo el ancho en mobile. En una columna de 163 px, el correo se cortaba a mitad de palabra; la referencia también pone correo y dirección a todo el ancho. Decidido por Esteban durante la implementación, el 2026-11-02.
- **Sí:** el acordeón de Productos sigue a la referencia y no muestra marcas. Las marcas siguen en el megamenú de desktop y en los filtros del catálogo.
- **Sí:** el menú y la búsqueda se mueven como en la referencia, pero en 300 ms en lugar de 700 ms. El estándar pide de 150 a 300 ms.
- **Sí:** el menú queda siempre montado y con `inert` cuando está cerrado. Es necesario para animarlo sin que sus enlaces reciban foco.
- **Sí:** la búsqueda mobile reutiliza `SearchPanel`. Mobile y desktop filtran con la misma lógica.
- **Sí:** el botón de asesor usa los datos de WhatsApp de `global.contact`, igual que la burbuja. No suma campos a Tina.
- **No:** cambiar contenido o schema. Todo lo que muestra el menú ya existe.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Un panel montado pero cerrado deja enlaces enfocables o legibles para lectores de pantalla. | `inert` mientras está cerrado; comprobarlo con Tab en el criterio de foco. |
| El bloqueo de scroll del menú choca con Lenis o con el de la búsqueda. | Un solo efecto controla `overflow` según `mobilePanel`; probar abrir y cerrar ambos paneles seguidos. |
| La animación con `translateX` deja scroll horizontal mientras el menú está cerrado. | El panel va dentro del header `fixed` con `overflow-hidden`; medir el scroll horizontal a 375 px. |
| Al pasar de mobile a `lg` con un panel abierto, queda bloqueado el scroll. | Cerrar el panel al cruzar `lg` con `matchMedia`. |

## Qué no entra en esta spec

- Altura del header y tamaño del logo.
- Marcas en el menú mobile.
- Cambios de contenido o schema en Tina.
- Header, megamenús y footer de desktop.
- Carruseles, catálogo, servicios y Medioambiente mobile (specs 09 a 11).

Si alguno de estos entra, va en su propia spec.

## Notas de implementación

- `SearchPanel` suma dos props opcionales: `onClose` (botón de cerrar) y `active` (enfoca el campo al abrirse). Desktop no las usa y se ve igual.
- Los paneles mobile llevan `data-lenis-prevent`, para que la rueda haga scroll dentro del panel y no en la página.
- Un `matchMedia` de 1024 px cierra el panel mobile al pasar a desktop.
- El header deja de ser translúcido mientras un panel mobile está abierto.
- La sección de estilos de `CLAUDE.md` no cambia: no hay patrones nuevos de tokens ni de clases.
- `check:standard` suma un aviso: `/contacto` pasa a 151 KB de JavaScript, frente a un presupuesto de 150 KB. Antes de esta spec estaba justo por debajo. Queda para revisar el peso de las islas de esa página.

## QA realizada

- **Navegador:** Chromium a 390 × 844 con emulación táctil, sobre `npm run dev` y catálogo de muestra. Pasaron 25 comprobaciones de header, menú, búsqueda, footer y movimiento reducido; 2 fallaron en la primera corrida por errores de la prueba (mayúsculas por CSS y la regla global de movimiento reducido) y se verificaron aparte.
- **Header:** 64 px; lupa y hamburguesa de 44 × 44 px; `aria-expanded` correcto.
- **Menú:** transición de 300 ms, scroll bloqueado y ningún enlace enfocable con el menú cerrado (Tab). Los acordeones empiezan cerrados y son exclusivos: Servicios con 8 enlaces y Productos con segmentos y "Por tipo", sin marcas. WhatsApp con número y mensaje en una pestaña nueva. Se cierra con Escape, al elegir un enlace y al pasar a 1100 px.
- **Búsqueda:** foco en el campo, "Productos populares" y filtro ("Laser" deja 3). Se cierra con el botón y con Escape, y se excluye con el menú.
- **Movimiento reducido:** `transition-property: none` en ambos paneles.
- **Footer a 390 px:** logo y Contacto a todo el ancho; Productos | Servicios y Empresa en 2 columnas. El correo y la dirección caben en una línea.
- **Desktop a 1024 y 1440 px:** megamenús, búsqueda con foco y footer con las mismas medidas; los paneles mobile no se muestran.
- **Scroll horizontal:** ninguno en las 8 pantallas a 375 px.
- **Consola:** sin errores.
- **`npm run typecheck`:** sin errores.
- **`npm run build:local`:** sin errores, 14 páginas sin catálogo de muestra.
- **`npm run check:standard`:** 0 errores y 2 avisos (14 páginas sin `og:image`; 151 KB de JavaScript en `/contacto`).
- **Sin probar:** Safari iOS y Chrome Android reales, lector de pantalla y `npm run build` con TinaCloud.
