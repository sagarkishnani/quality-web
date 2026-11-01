# SPEC 05 — Medioambiente

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 03
> **Fecha:** 2026-11-01
> **Objetivo:** Llevar los pilares de Medioambiente a una sección de fondo petróleo con una línea verde que se dibuja con el scroll, unida a la página por una franja de video y un banner a todo el ancho.

## Por qué existe esta spec

Sagar aprobó traer la línea verde de la referencia, que era uno de los 9 puntos del inventario funcional. La línea solo funciona sobre fondo oscuro y entre pilares alternados, así que exige rehacer la sección.

Un bloque petróleo en medio de una página clara deja cortes secos arriba y abajo. La referencia los resuelve con dos fundidos: la franja de video de entrada y el banner de salida. Esta spec trae esos dos fundidos, y por eso también cubre el parallax y la franja que la spec 03 dejó para aquí.

## Referencia de diseño

Pantalla "Medioambiente" de `Quality Sumprint Desktop.html`, a 1440 px:

| Bloque | Valor de la referencia |
| --- | --- |
| Franja de video | 720 px de alto, con parallax 0,18 y el video del hero |
| Máscara de la franja | Transparente arriba, 60 % a los 22 % del alto, opaca desde el 42 % |
| Degradado de la franja | Los últimos 60 % del alto, de transparente a `#0D4553` |
| Sección de pilares | De `#0D4553` a `#0B3B47` al 55 % y de vuelta a `#0D4553` |
| Filas de pilares | 180 px entre filas y 96 px entre columnas |
| Foto de pilar | 420 × 540 px, radio de 28 px, parallax −0,08 |
| Línea | Trazo `#74C947` de 2 px, viewBox `0 0 100 300`, sin conservar proporción |
| Banner final | 820 px de alto, a todo el ancho, con fundido desde `#0D4553` |

## Alcance

**Entra:**

- Tokens `petrol` y `petrol-deep`.
- Franja de video entre el compromiso y los pilares, con fundido de claro a petróleo.
- Sección de pilares sobre petróleo, con fotos verticales y filas alternadas desde `lg`.
- Línea verde que se dibuja con el scroll, solo desde `lg`.
- Parallax en la franja y en las fotos de los pilares, desde `lg`.
- Banner final a todo el ancho, con imagen y fundido desde petróleo.
- Videos de la página detenidos con `prefers-reduced-motion`.
- Sección de estilos de `CLAUDE.md`, actualizada en el mismo PR.

**Qué no entra (para specs futuras):**

- Hero y sección de compromiso de Medioambiente: se quedan como están.
- Video en el banner final: el de la referencia pesa 7 MB.
- Línea por debajo de `lg`.
- Círculo con icono sobre la numeración de los pilares.
- Campos nuevos en Tina.
- Contenido y textos de la página (spec 06).
- Corregir los ciclos duplicados de `startLenis`.

## Modelo de datos

Esta spec no agrega campos de Tina ni cambia `tina/tina-lock.json`.

- La franja usa `hero.video` y `hero.poster`. Sin `hero.video` ni `hero.poster`, la franja no se renderiza.
- Los pilares y el banner usan sus campos actuales.

Tokens nuevos en `tailwind.config.mjs`:

| Token | Valor | Uso |
| --- | --- | --- |
| `petrol` | `#0D4553` | Fondo de la franja, los pilares, el banner y el hero de Medioambiente |
| `petrol-deep` | `#0B3B47` | Centro del degradado de los pilares |

Atributos nuevos:

| Atributo | Elemento | Función |
| --- | --- | --- |
| `data-scroll-line` | `path` de la línea | `src/utils/scrollLine.ts` lo dibuja según el avance de su `section` |
| `data-motion-video` | `video` de Medioambiente | `src/utils/reducedMotionVideo.ts` lo detiene con movimiento reducido |

Avance de la línea, de 0 a 1:

```text
(alto de ventana × 0,75 − top de la sección) / alto de la sección
```

Medidas de cada ancho:

| Bloque | Menos de `md` | De `md` a `lg` | Desde `lg` |
| --- | --- | --- | --- |
| Franja de video | 320 px | 320 px | 720 px |
| Foto de pilar | 300 px de alto, ancho completo | 400 px de alto, ancho completo | 420 × 540 px |
| Espacio entre pilares | 64 px | 64 px | 180 px |
| Relleno inferior de pilares | 64 px | 64 px | 160 px |
| Banner final | 420 px | 560 px | 820 px |

## Plan de implementación

1. **Tokens.** Agregar `petrol` y `petrol-deep`. Cambiar `bg-[#0D4553]` por `bg-petrol` en `EnvironmentHero`.
2. **Franja.** Crear `EnvironmentVideoBand` en `EnvironmentSections.tsx`, con `data-parallax="0.18"`, capa de `-top-[20%]` y `h-[140%]`. La máscara va como clase `.video-band-mask` en `global.css`. Agregarla a `medioambiente.astro` con `client:tina`.
3. **Fondo de los pilares.** Pasar `EnvironmentPillars` a fondo petróleo, con texto blanco, numeración en `brand-secondary-light` y `btn-light` en lugar de `link-arrow`. Quitar la tarjeta blanca.
4. **Composición de los pilares.** Pasar a dos columnas desde `lg`, con las medidas de la tabla, `rounded-panel` y `shadow-deep`. La foto se alinea al borde exterior de su columna. Las imágenes llevan `loading="lazy"`.
5. **Parallax de los pilares.** Envolver cada medio en una capa con `data-parallax="-0.08"`, `-top-[10%]` y `h-[120%]`. El bloque padre lleva `overflow-hidden`.
6. **Línea.** Agregar el `svg` decorativo con `aria-hidden`, `hidden lg:block` y el `path` de la referencia, con `pathLength={1}` y `vectorEffect="non-scaling-stroke"`.
7. **Dibujo.** Crear `src/utils/scrollLine.ts` con `startScrollLine()`. Llamarla en `BaseLayout.astro` al cargar y en `astro:after-swap`. Usa un solo listener y `requestAnimationFrame`. Con movimiento reducido, deja la línea completa y quieta.
8. **Banner.** Reescribir `EnvironmentBanner` como sección propia a todo el ancho, sin `ImageBanner`, con `data-parallax="0.22"` y el degradado en `.environment-banner-scrim`. Quitar `0.22` de `PARALLAX_LAYERS` en `ImageBanner.tsx`.
9. **Revelado.** Quitar `.reveal` de los pilares y el banner en `medioambiente.astro`. No agregarlo a la franja.
10. **Videos.** Agregar `data-motion-video` en `BackgroundVideo` y crear `src/utils/reducedMotionVideo.ts`. Llamarlo en `BaseLayout.astro` al cargar y en `astro:after-swap`.
11. **Documentación.** Actualizar `CLAUDE.md` con los tokens, `data-scroll-line`, `data-motion-video` y la franja.

## Criterios de aceptación

**Franja**

- [ ] A 1440 px, la franja mide 720 px y funde del fondo claro al petróleo, sin línea visible de corte.
- [ ] La franja usa el video y el póster del hero.
- [ ] Sin `hero.video` y con `hero.poster`, muestra el póster.
- [ ] Sin `hero.video` ni `hero.poster`, no aparece.
- [ ] La página no agrega archivos de video nuevos.

**Pilares**

- [ ] Desde `lg`, los pilares 1 y 3 tienen la foto a la izquierda y el pilar 2 a la derecha.
- [ ] A 1440 px, cada foto mide 420 × 540 px.
- [ ] Por debajo de `lg`, cada pilar muestra la foto arriba y el texto abajo.
- [ ] El enlace "Más información" es un botón blanco y conserva su destino.
- [ ] El pilar sin foto ni video no deja un bloque roto.
- [ ] Cambiar el título de un pilar desde Tina cambia el texto de la página.

**Línea**

- [ ] Desde `lg`, la línea no se ve al llegar a la sección.
- [ ] La línea crece al bajar, retrocede al subir y queda completa al final de la sección.
- [ ] Por debajo de `lg`, la línea no se muestra.
- [ ] Al pasar de 1440 px a 375 px sin recargar, la línea desaparece y no hay errores.
- [ ] Con `prefers-reduced-motion`, la línea aparece completa y no cambia con el scroll.
- [ ] Después de navegar con `ClientRouter`, la línea funciona y solo queda un listener de scroll.
- [ ] La línea no intercepta clics y queda fuera del árbol de accesibilidad.

**Parallax**

- [ ] Desde `lg`, la franja se mueve con factor 0,18 y las fotos de los pilares con −0,08.
- [ ] El banner conserva el factor 0,22.
- [ ] A 1440 × 900 y 1920 × 1080, ningún bloque muestra un borde vacío mientras se ve en pantalla.
- [ ] Por debajo de `lg` y con `prefers-reduced-motion`, ninguna capa se mueve.

**Banner**

- [ ] A 1440 px, el banner mide 820 px, va a todo el ancho y funde desde petróleo sin corte.
- [ ] Sin `banner.image`, el banner muestra fondo petróleo y el texto se lee.
- [ ] El antetítulo y el título llegan a 4.5:1 y 3:1, medidos sobre los píxeles detrás del texto.
- [ ] El footer queda justo debajo del banner, sin franja clara entre ambos.
- [ ] `HomeEcoBanner` no cambia.

**Generales**

- [ ] Con `prefers-reduced-motion`, los videos de la página quedan detenidos.
- [ ] A 375, 768 y 1024 px, Medioambiente no presenta scroll horizontal ni texto cortado o superpuesto.
- [ ] El hero y el compromiso de Medioambiente no cambian.
- [ ] El LCP de `/medioambiente` a 1440 px es menor a 2,5 s.
- [ ] Las secciones con `client:tina` funcionan sin cargar React en producción.
- [ ] No quedan `#0D4553` ni `#0B3B47` en `src/`, fuera de `.environment-banner-scrim` y `.video-band-mask`.
- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run check:standard` termina sin errores, sin el catálogo de muestra.
- [ ] `npm run build` termina sin errores.
- [ ] `CLAUDE.md` documenta los tokens y los atributos nuevos.
- [ ] La spec incluye "Notas de implementación" y "QA realizada".

## Decisiones

- **Sí:** franja y banner a todo el ancho. Sin ellos, la sección petróleo queda con cortes secos. Decisión de Esteban del 2026-11-01.
- **Sí:** la línea solo aparece desde `lg`, y el fondo petróleo en todos los anchos. En una columna, la curva pasaría por detrás del texto. Decisión de Esteban del 2026-11-01.
- **Sí:** la franja reutiliza `hero.video`. No suma un archivo nuevo ni un campo de Tina, y la referencia hace lo mismo.
- **Sí:** fotos verticales de 420 × 540 px. Las tres imágenes actuales conservan su motivo con ese recorte, simulado sobre los archivos reales.
- **Sí:** dos columnas desde `lg`, no desde `md`. Foto, separación y texto necesitan unos 960 px.
- **Sí:** el parallax se aplica también a bloques con texto encima. Es la excepción al estándar que Sagar aprobó el 2026-10-31, y debe registrarse en el PR.
- **Sí:** el banner deja de usar `ImageBanner`. Su ancho, su altura y su fundido no sirven para el banner del inicio.
- **Sí:** los degradados oscuros del banner usan `ink`, como en la spec 03, en lugar del `rgba(8,20,12)` de la referencia.
- **Sí:** los videos se detienen con movimiento reducido. El estándar lo exige, y la franja suma un segundo video en movimiento.
- **Sí:** `.reveal` sale de los pilares y el banner. Su desplazamiento de 24 px abriría una rendija entre bloques que deben fundirse.
- **No:** suavizado propio en la línea. Lenis ya suaviza el scroll, igual que en la spec 03.
- **No:** `getTotalLength`. `pathLength={1}` da el mismo resultado sin medir el trazo.
- **No:** círculo con icono sobre la numeración. Es un cambio solo visual, fuera del criterio de Sagar.
- **No:** rediseñar el hero o el compromiso. Mismo motivo.
- **No:** video en el banner. Pesa más del doble que los dos videos del sitio juntos.
- **No:** campo nuevo para el video de la franja. No hay otro video previsto.
- **No:** una biblioteca de animación. El cálculo cabe en pocas líneas.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Dos videos en reproducción automática contradicen la regla del estándar sobre autoplay pesado. | Es el mismo archivo de 1,8 MB que el hero. El PR debe señalar la excepción, y la QA revisa si el navegador lo descarga dos veces. |
| El texto del banner pierde contraste, porque el degradado de la referencia es más suave que el `ink/55` actual. | Medirlo sobre los píxeles detrás del texto. Si no llega, se oscurece el centro del degradado. |
| El trazo cruza por detrás del texto de los pilares. | Es igual en la referencia. Revisar la legibilidad a 1024, 1440 y 1920 px. |
| Con otra cantidad de pilares, la curva no coincide con las filas. | La línea se estira a la altura de la sección y sigue siendo decorativa. Revisarla con 2 y 4 pilares. |
| Una edición en Tina reemplaza el `path` y la línea deja de responder en el editor. | No afecta a producción. Se anota en la QA si ocurre. |
| El `svg` sale del viewBox y genera scroll horizontal. | La sección lleva `overflow-hidden`. |

## Qué no entra en esta spec

- Hero y sección de compromiso de Medioambiente.
- Video en el banner final.
- Línea por debajo de `lg`.
- Círculo con icono sobre la numeración.
- Campos nuevos en Tina.
- Contenido y textos de la página.
- Corregir los ciclos duplicados de `startLenis`.

Si alguno de estos entra, va en su propia spec.
