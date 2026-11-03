# SPEC 07 — Títulos mobile

> **Estado:** Implementado
> **Depende de:** SPEC 06
> **Fecha:** 2026-11-02
> **Objetivo:** Bajar los mínimos de `heading-xl` y `heading-md` a los de la referencia mobile sin cambiar desktop.

## Por qué existe esta spec

A 390 px, los títulos de los heroes, la ficha, los CTA y Contacto son más grandes que en `Quality Sumprint Mobile.html`. Va antes que las otras specs mobile porque cambia el tamaño de todas las pantallas, y hacerla después obligaría a repetir su QA.

## Alcance

**Entra:**

- Mínimo de `heading-xl`: de 36 px a 32 px.
- Mínimo de `heading-md`: de 30 px a 28 px.
- Registrar las diferencias aceptadas con la referencia mobile.

**No entra:**

- `heading-lg`, `heading-sm`, `heading-xs` y los tokens `subtitle-*`.
- Ajustes por componente: el H1 de Contacto (28 frente a 32 px), las cifras (32 frente a 34 px) y el compromiso de Medioambiente (28 frente a 26 px).
- Máximos y pendientes del `clamp`: desktop no cambia.
- Navegación, carruseles, catálogo, servicios y Medioambiente mobile (specs 08 a 11).

## Modelo de datos

Solo cambian dos valores en `tailwind.config.mjs`:

| Token | Antes | Después |
|---|---|---|
| `heading-xl` | `clamp(2.25rem, 4.75vw + 0.75rem, 3.25rem)` | `clamp(2rem, 4.75vw + 0.75rem, 3.25rem)` |
| `heading-md` | `clamp(1.875rem, 3.5vw + 0.5rem, 2.5rem)` | `clamp(1.75rem, 3.5vw + 0.5rem, 2.5rem)` |

El valor central y el máximo no cambian. Por eso solo cambia el tamaño por debajo de 505 px en `heading-xl` y de 629 px en `heading-md`.

## Plan de implementación

1. **Rama.** Crear `feat/spec-07-titulos-mobile` desde `staging` actualizado.
2. **`heading-xl`.** Bajar el mínimo a `2rem`.
3. **`heading-md`.** Bajar el mínimo a `1.75rem`.
4. **Registro.** Anotar las diferencias aceptadas en `specs/07-titulos-mobile.md` y actualizar el brief de la spec en `quality-contexto/README.md`.
5. **Cierre.** Ejecutar `npm run typecheck`, `npm run build:local` y `npm run check:standard` sin catálogo de muestra. Medir los títulos a 390, 768 y 1440 px.

## Criterios de aceptación

**Mobile**

- [x] A 390 px, el título de los heroes de Inicio, Nosotros, Productos, Servicios, detalle de servicio y Medioambiente mide 32 px.
- [x] A 390 px, el título de la ficha, el de los CTA y el H1 de Contacto miden 28 px.
- [x] A 390 px, los títulos con `heading-lg`, `heading-sm` y `heading-xs` miden lo mismo que en `staging`.
- [x] A 375 px, ninguna de las 8 pantallas tiene scroll horizontal.

**Desktop**

- [x] A 768 y 1440 px, todos los títulos miden lo mismo que en `staging`.

**Código**

- [x] El diff de `tailwind.config.mjs` cambia solo los mínimos de `heading-xl` y `heading-md`.
- [x] Ningún componente cambia.

**Cierre**

- [x] `npm run typecheck` termina sin errores.
- [x] `npm run build:local` termina sin errores.
- [x] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.

## Decisiones

- **Sí:** bajar solo los mínimos de `heading-xl` y `heading-md`. Son los únicos tokens que superan a la referencia mobile.
- **Sí:** 32 px para `heading-xl`. La referencia usa de 30 a 34 px en heroes y banners, y 32 px es el valor más repetido.
- **Sí:** 28 px para `heading-md`. La referencia usa de 26 a 32 px, y 28 px es el valor más repetido.
- **Sí:** aceptar tres diferencias de 2 a 4 px: el H1 de Contacto (28 frente a 32 px), las cifras (32 frente a 34 px) y el compromiso de Medioambiente (28 frente a 26 px).
- **No:** ajustar esos tres elementos por separado. Obligaría a tocar componentes o a crear tokens nuevos por diferencias pequeñas.
- **No:** bajar los 5 mínimos. `heading-sm` y `heading-xs` ya coinciden y quedarían por debajo de la referencia.
- **No:** cambiar el valor central o el máximo del `clamp`. Desktop coincide con su referencia desde la spec 01.
- **Sí:** spec propia antes de las otras specs mobile. Cambia todas las pantallas, y hacerla después obligaría a repetir su QA.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Un título de dos líneas pasa a una línea y cambia la altura de un hero o un bloque. | Revisar las 8 pantallas a 390 px antes y después del cambio. |
| Entre 505 y 629 px, `heading-md` cambia y `heading-xl` no. | Medir a 600 px que la jerarquía entre los dos se mantenga. |

## Qué no entra en esta spec

- Cambios en `heading-lg`, `heading-sm`, `heading-xs` y `subtitle-*`.
- Ajustes por componente.
- Cambios en desktop.
- El resto de la adaptación mobile (specs 08 a 11).

Si alguno de estos entra, va en su propia spec.

## Notas de implementación

Diferencias aceptadas con la referencia mobile a 390 px:

| Elemento | Sitio | Referencia |
|---|---|---|
| H1 de Contacto | 28 px | 32 px |
| Cifras de Inicio y Nosotros | 32 px | 34 px |
| Compromiso de Medioambiente | 28 px | 26 px |

Con el cambio, el título de la ficha cabe en una línea a 390 px, y el del hero de Nosotros pasa a dos líneas, como en la referencia.

## QA realizada

- **Medición:** tamaño calculado de todos los títulos `heading-*` de las 8 pantallas a 375, 390, 600, 768 y 1440 px, antes y después del cambio, con `npm run dev` y catálogo de muestra.
- **Mobile:** a 375 y 390 px, `heading-xl` pasa de 36 a 32 px y `heading-md` de 30 a 28 px. `heading-lg` (32 px), `heading-sm` (26 px) y `heading-xs` (24 px) no cambian.
- **600 px:** `heading-md` pasa de 30 a 29 px y `heading-xl` no cambia; la jerarquía se mantiene.
- **Desktop:** a 768 y 1440 px ningún título cambia.
- **Scroll horizontal:** ninguno a 375, 390, 600, 768 ni 1440 px.
- **Capturas:** inicio de las 8 pantallas a 390 px, revisado tras el cambio.
- **`npm run typecheck`:** sin errores.
- **`npm run build:local`:** sin errores, 14 páginas sin catálogo de muestra.
- **`npm run check:standard`:** 0 errores y 1 aviso (14 páginas sin `og:image`).
- **Sin probar:** `npm run build` con TinaCloud y dispositivos reales.
