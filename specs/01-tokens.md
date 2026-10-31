# SPEC 01 — Tokens de diseño y tipografía

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-10-30
> **Objetivo:** Igualar la tipografía, los colores, los radios y las sombras del sitio a la referencia visual desktop, mediante tokens aplicados en las 8 pantallas.

## Por qué existe esta spec

El sitio ya tiene las 8 pantallas, pero su sistema visual no coincide con la referencia. A 1440 px, ninguno de los 31 títulos coincide en tamaño y peso: la referencia usa 52, 48, 40, 36 y 32 px en peso 700, y el sitio 60, 54, 40 y 34 px en peso 600. El texto base es de 15 px en la referencia y de 14 px en el sitio. También difieren el azul, los verdes, los grises, los radios y las sombras.

Cambiar solo los tokens no alcanza: `text-heading-sm` se usa hoy en títulos que en la referencia miden 36 y 40 px, y `text-body-sm` tiene 41 usos que en la referencia serían 14 o 15 px. Por eso esta spec también reasigna las clases en cada pantalla.

Si las specs siguientes se construyen antes de esto, cada una tendría que resolver el estilo con valores sueltos.

Fuentes de los valores:

- **Tipografía, radios, sombras y color:** estilos de la referencia visual, por frecuencia de uso, y valores calculados a 1440 px.

## Alcance

**Entra:**

- Nuevos valores para la escala `heading-*`, `subtitle-*`, `body-*` y `caption-*` en `tailwind.config.mjs`, más los tamaños que faltan (17, 15, 13 y 11 px).
- Pesos, interlineados y tracking de la referencia dentro de cada token.
- Colores de la referencia en los tokens semánticos y de marca: azul, verdes, textos, bordes y fondos.
- Radios y sombras de la referencia como tokens.
- Clases reutilizables de `src/styles/global.css`: botones, `eyebrow`, `eyebrow-caps`, `card`, y la regla base de títulos.
- Reasignación de las clases de tipografía, color y radio en los componentes y páginas de las 8 pantallas, incluidos header y footer.
- Reemplazo de los tamaños y radios sueltos actuales (`text-[13px]`, `rounded-[5px]`, etc.) por tokens.
- Sección de estilos de `CLAUDE.md`, actualizada en el mismo PR.

**Qué no entra (para specs futuras):**

- Cambios de estructura o layout de cualquier pantalla (specs 02 a 05).
- Heroes con imagen y parallax (spec 02).
- Tarjetas, banners y alto de tarjetas de `/productos` (spec 03).
- Ficha técnica y bundle (spec 04).
- Rediseño de Medioambiente (spec 05).
- Ajustes de contenido, textos y redes sociales (spec 06).
- Mobile: no hay referencia, sus tamaños se conservan.
- Cambio o autoalojamiento de la fuente: se mantiene Inter.
- Animaciones, transiciones y hover.

## Modelo de datos

Esta spec no introduce estructuras de datos ni cambios de Tina. Define los tokens de `tailwind.config.mjs` y `src/styles/global.css`.

### Tipografía

| Token | 1440 px | Peso | Interlineado | Tracking | Mínimo mobile |
|---|---|---|---|---|---|
| `heading-xl` | 52 px | 700 | 1.05 | -0.035em | 36 px |
| `heading-lg` | 48 px | 700 | 1 | -0.04em | 32 px |
| `heading-md` | 40 px | 700 | 1.05 | -0.035em | 30 px |
| `heading-sm` | 36 px | 700 | 1.1 | -0.03em | 26 px |
| `heading-xs` | 32 px | 700 | 1.1 | -0.03em | 24 px |
| `subtitle-lg` | 28 px | 700 | 1.15 | -0.02em | 28 px |
| `subtitle-md` | 26 px | 700 | 1.2 | -0.02em | 24 px |
| `subtitle-sm` | 24 px | 700 | 1.15 | -0.02em | 20 px |
| `subtitle-xs` (nuevo) | 20 px | 600 | 1.2 | -0.01em | 20 px |
| `body-xl` (nuevo) | 18 px | 400 | 28 px | — | 18 px |
| `body-lg` | 17 px | 400 | 27 px | — | 17 px |
| `body-md` | 16 px | 400 | 26 px | — | 16 px |
| `body-base` (nuevo) | 15 px | 400 | 24 px | — | 14 px |
| `body-sm` | 14 px | 400 | 20 px | — | 14 px |
| `caption-md` (nuevo) | 13 px | 400 | 18 px | — | 13 px |
| `caption-sm` | 12 px | 400 | 16 px | — | 12 px |
| `caption-xs` (nuevo) | 11 px | 400 | 14 px | — | 11 px |

Se elimina `heading-xxl`, sin usos. Los títulos con parte ligera usan `font-medium` sobre su token.

### Color

| Token | Antes | Después |
|---|---|---|
| `accent` | `#0078A7` | `#00A0DF` |
| `brand-primary-lightest` | `#D9F1FA` | `#DFF1FA` |
| `brand-secondary-dark` | `#357A1A` | `#3E8E1F` |
| `brand-secondary-darkest` | — | `#2F6E16` |
| `content-strong` | — | `#24272A` |
| `content-subtle` | `#676C71` | `#6B7075` |
| `content-faint` | — | `#9AA0A6` |
| `line` | `#E3E6E9` | `#E6E8EB` |
| `line-soft` | — | `#ECEEF0` |
| `line-strong` | `#C7CBD0` | `#DADDE1` |
| `surface-sunken` | — | `#F4F5F5` |
| `semantics-error` | `#EB0E0E` | `#C8372D` |

`surface`, `content`, `content-muted`, `ink`, `brand-primary` y `brand-secondary` no cambian. `brand-primary-dark` se conserva, pero deja de usarse en superficies.

### Radios

| Token | Valor | Uso |
|---|---|---|
| `xs` (nuevo) | 5 px | Etiquetas |
| `sm` | 6 px | Botones |
| `md` | 8 px | Campos y CTA grandes |
| `lg` | 14 px | Bloques medianos |
| `xl` | 16 px | Sin cambio |
| `2xl` | 24 px | Sin cambio |
| `panel` (nuevo) | 28 px | Tarjetas e imágenes grandes |
| `3xl` | 32 px | Sin cambio |
| `sheet` | 48 px | Sin cambio |

### Sombras

| Token | Valor |
|---|---|
| `shadow-soft` | `0 8px 28px rgba(0,0,0,0.12)` |
| `shadow-lift` | `0 30px 60px rgba(0,0,0,0.08)` |
| `shadow-deep` | `0 40px 80px rgba(0,0,0,0.35)` |

### Clases de `global.css`

| Clase | Referencia |
|---|---|
| `h1`–`h6` | `font-bold` |
| `.btn` | 46 px de alto, `body-base`, 600, radio `sm` |
| `.btn-sm` (nueva) | 40 px de alto, `body-sm`, 600 |
| `.btn-lg` (nueva) | 48 px de alto, radio `md` |
| `.btn-xl` (nueva) | 52 px de alto, `body-md`, radio `md` |
| `.eyebrow` | `body-sm`, 600, `brand-secondary-dark` |
| `.eyebrow-caps` | `caption-sm`, 600, tracking 0.12em |
| `.card` | Radio `panel` |

## Plan de implementación

1. **Color, radios y sombras.** Actualizar `tailwind.config.mjs` y reemplazar `bg-brand-primary-dark` en superficies por `bg-brand-primary`. Actualizar el comentario de `accent`.
2. **Escala tipográfica.** Cambiar los valores de `heading-*`, `subtitle-*`, `body-*` y `caption-*`, agregar los tokens nuevos y eliminar `heading-xxl`.
3. **Clases base.** Ajustar `src/styles/global.css`: regla de títulos, `.btn`, `.btn-sm`, `.btn-lg`, `.btn-xl`, `.eyebrow`, `.eyebrow-caps` y `.card`.
4. **Componentes compartidos.** Reasignar clases en header, footer, botón de WhatsApp, `ProductTile`, `ServiceCard`, `DarkHero` y formularios.
5. **Inicio y Nosotros.** Reasignar títulos, textos, botones y radios según la tabla.
6. **Servicios y detalle de servicio.** Igual que el paso 5.
7. **Productos y ficha de producto.** Igual que el paso 5.
8. **Medioambiente, Contacto, 404 y banner de cookies.** Igual que el paso 5.
9. **Valores sueltos.** Reemplazar `text-[NNpx]` y `rounded-[5px]` por tokens.
10. **Documentación.** Actualizar la sección de estilos de `CLAUDE.md`: tokens, colores, tipografía y la nota de contraste.
11. **Verificación.** Comparar las 8 pantallas a 1440 px y correr `npm run typecheck`, `npm run check:standard` y `npm run build`.

### Equivalencias de títulos

| Pantalla | Título | Clase |
|---|---|---|
| Heroes de Inicio, Nosotros, Servicios, Productos y Medioambiente | `h1` | `heading-xl` |
| Banners de Inicio y Medioambiente | `h2` | `heading-xl` |
| Secciones de Inicio y "Olvídate de comprar…" | `h2` | `heading-sm` |
| "Contamos con…" y "Tu aliado estratégico…" | `h2` | `heading-xs font-medium` |
| "¿Por qué elegirnos?" | `h2` | `heading-sm font-medium` |
| Misión y Visión | `h3` | `subtitle-md` |
| "Concentra tu negocio…" y "Otros servicios" | `h2` | `heading-xs` |
| "Nuestros servicios", CTA y "Los grandes cambios…" | `h2` | `heading-md` |
| Pilares de Medioambiente | `h2` | `heading-md` |
| Título del detalle de servicio | `h2` | `heading-xs` |
| Descripción de producto | `h2` | `subtitle-lg` |
| "Puedes comprar con" y "Te puede interesar" | `h2` | `heading-xs` |
| Contacto | `h1` | `heading-md` |
| Cifras (+1000, etc.) | — | `heading-lg`, `text-accent` |
| Nombre de producto en tarjeta | — | `subtitle-xs` |

### Equivalencias de texto

| Elemento | Clase |
|---|---|
| Navegación | `body-base font-medium`, `content-strong` |
| Descripciones, categorías, etiquetas de cifras y enlaces del footer | `body-base` |
| Etiquetas de producto | `caption-md font-semibold` |
| Antetítulos | `.eyebrow` |

Los textos que no estén en estas tablas se ajustan al valor calculado de la referencia a 1440 px.

## Criterios de aceptación

**Tokens**

- [ ] `tailwind.config.mjs` contiene los valores de tipografía, color, radios y sombras de esta spec.
- [ ] `heading-xxl` ya no existe y no quedan usos.
- [ ] `src/styles/global.css` contiene las clases de esta spec.
- [ ] No quedan `text-[NNpx]` ni `rounded-[5px]` en `src/`.
- [ ] No quedan usos de `bg-brand-primary-dark` en superficies.

**Fidelidad a 1440 px**

- [ ] Los títulos de las tablas de equivalencias coinciden con la referencia en tamaño y peso en las 8 pantallas.
- [ ] Los títulos que dependen de estructura de las specs 02 a 05 quedan anotados en "Notas de implementación".
- [ ] La navegación, los antetítulos, las cifras y las etiquetas coinciden con la referencia en tamaño, peso y color.
- [ ] Los botones coinciden en tamaño de texto, peso y radio, con una tolerancia de 2 px en el alto.
- [ ] Los fondos y textos usan los colores de esta spec en las 8 pantallas.

**Sin regresiones**

- [ ] A 375 px, ninguna de las 8 pantallas presenta scroll horizontal ni texto cortado o superpuesto.
- [ ] No cambia la estructura de ninguna pantalla.
- [ ] Ningún texto ni dato del CMS cambia.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run check:standard` termina sin errores, sin el catálogo de muestra.
- [ ] `npm run build` termina sin errores.
- [ ] `CLAUDE.md` refleja los tokens nuevos y la nueva nota de contraste.
- [ ] La spec incluye "Notas de implementación" y "QA realizada".

## Decisiones

**Tomadas:**

- **Todo sigue la referencia visual.** Si contradice el estándar, se sigue la referencia y la excepción queda aquí y en la descripción del PR.
- **Tokens y reasignación en la misma spec.** Cambiar solo los tokens dejaría tamaños incorrectos hasta terminar la spec 06.
- **El azul de superficies y números es `#00A0DF`.** `accent` deja de ser `#0078A7`, aunque baja de 4,5:1.
- **Se reutilizan los nombres de la escala actual.** Los valores cambian y se agregan solo los tamaños que faltan, sin una escala nueva.
- **Se conservan los mínimos de mobile por token.** Un título que cambia de token puede variar hasta 4 px en mobile; se acepta para no duplicar tokens.
- **`body-base` llega a 15 px en desktop y conserva 14 px en mobile.**
- **`surface-sunken` es `#F4F5F5`.** Es el valor más frecuente; `#F4F5F6` no tiene diferencia perceptible.
- **Quedan fuera de los tokens los colores de relleno oscuro de imágenes** (`#33373B`, `#1F2225`, `#2A2D31`, `#E9ECEF`). Se resuelven en la spec que los use.

**Excepciones de contraste:**

| Tono | Fondo | Contraste |
|---|---|---|
| `#00A0DF` | `#F1F3F5` | 2,66:1 |
| Blanco | `#00A0DF` | 2,96:1 |
| `#9AA0A6` | `#F1F3F5` | 2,37:1 |
| `#3E8E1F` | `#F1F3F5` | 3,71:1 |
| Blanco | `#74C947` | 2,06:1 |

`check:standard` no mide contraste. Estas excepciones las aprobó Esteban y falta informarlas a Sagar.

**Descartadas:**

- **Mantener `#0078A7` por contraste.** No sigue la referencia.
- **Tokens por tamaño exacto (`text-52`).** Se pierde el significado y el ajuste en mobile.
- **Valores sueltos como `text-[52px]`.** Lo prohíben el estándar y las lecciones de Fiberlux.
- **Duplicar tokens para fijar el mínimo mobile de cada título.** Añade complejidad por una diferencia de hasta 4 px.

## Riesgos

- **PR grande con cambios en casi todos los componentes.** Mitigación: commits por paso y pantallas revisadas por separado.
- **Títulos más anchos con peso 700.** Pueden provocar saltos de línea o texto cortado. Mitigación: revisar a 375 px y con contenido real.
- **Baja de contraste.** Es la queja más frecuente de clientes según Fiberlux, y Sagar podría pedir revertirla. Mitigación: al estar en tokens, el cambio se hace en un solo lugar.
- **Cambio visual en mobile sin referencia.** Mitigación: revisar a 375 px antes del PR.
- **Títulos que dependen de otra estructura.** Algunos no se pueden validar del todo hasta las specs 02 a 05. Mitigación: anotarlos en "Notas de implementación".

## Notas de implementación

- `.btn-accent` pasa a texto blanco, porque así está el CTA del header en la referencia. Se agrega a las excepciones de contraste.
- `ServiceCard` suma el tamaño `sm` para las dos tarjetas de 20 px del bento del inicio.
- `.btn` usa `min-h` en vez de alto fijo, para que un texto largo no se corte.
- Tamaños de la referencia sin token, resueltos con el más cercano: 19 px en el hero de Servicios (`body-xl`), 21 px en "¿Por qué elegirnos?" y Contacto (`subtitle-xs`).
- Colores de la referencia sin token, resueltos con el más cercano: `#33373B` en la descripción de producto (`content-strong`) y `#7A8086` en la pestaña inactiva (`content-subtle`).
- `surface-sunken` y las sombras `shadow-lift` y `shadow-deep` quedan definidas, pero se aplican en las specs 03 a 05, que tocan esos bloques.

Diferencias que dependen de estructura y quedan para otra spec:

| Elemento | Spec |
|---|---|
| Heroes sin imagen y texto de "Otros servicios" | 02 |
| Color de los banners de `/productos` y su botón | 03 |
| Tarjetas del bundle y nombre del producto en ellas | 04 |
| Color de pilares y numeración de Medioambiente | 05 |

## QA realizada

- **Textos a 1440 px:** comparación automática de tamaño, peso y color en las 8 pantallas. Coincidían 73 de 382 y ahora 355 de 382. Los 27 restantes son las diferencias de arriba.
- **Botones a 1440 px:** tamaño de texto, peso y radio revisados contra la referencia.
- **Visual a 1440 px:** Nosotros revisada lado a lado.
- **375 px:** sin scroll horizontal en las 8 pantallas; inicio y ficha revisadas a simple vista, sin texto cortado ni superpuesto.
- **`npm run typecheck`:** sin errores.
- **`npm run check:standard`:** 0 errores y 1 aviso (14 páginas sin `og:image`), con build local sin catálogo de muestra.
- **`npm run build`:** no se pudo ejecutar, porque requiere credenciales de TinaCloud. `npm run build:local` terminó sin errores (14 páginas).
- **Observación en mobile:** en las cifras del inicio, un rótulo de dos líneas desalinea `+3000` respecto de `+14`.
