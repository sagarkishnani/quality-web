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
- Hero y compromiso con la composición de la referencia, añadidos tras la revisión visual del 2026-11-01.
- Icono de hoja junto a la numeración de los pilares y columna de 1180 px desde `lg`.
- Sección de estilos de `CLAUDE.md`, actualizada en el mismo PR.

**Qué no entra (para specs futuras):**

- Video en el banner final: el de la referencia pesa 7 MB.
- Línea por debajo de `lg`.
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
| `data-scroll-line` | `svg` de la línea | `src/utils/scrollLine.ts` lo revela según el avance de su `section` |
| `data-motion-video` | `video` de Medioambiente | `src/utils/reducedMotionVideo.ts` lo detiene con movimiento reducido |
| `data-lazy-src` | `video` debajo del fold | `src/utils/lazyVideo.ts` lo carga a 100 px de la pantalla |

Avance de la línea, de 0 a 1:

```text
(alto de ventana × 0,75 − top de la sección) / alto de la sección
```

Medidas de cada ancho:

| Bloque | Menos de `md` | De `md` a `lg` | Desde `lg` |
| --- | --- | --- | --- |
| Franja de video | 320 px | 320 px | 420 px |
| Foto de pilar | 300 px de alto, ancho completo | 400 px de alto, ancho completo | 420 × 540 px |
| Espacio entre pilares | 64 px | 64 px | 120 px |
| Relleno inferior de pilares | 64 px | 64 px | 160 px |
| Banner final | 420 px | 560 px | 820 px |

## Plan de implementación

1. **Tokens.** Agregar `petrol` y `petrol-deep`. Cambiar `bg-[#0D4553]` por `bg-petrol` en `EnvironmentHero`.
2. **Franja.** Crear `EnvironmentVideoBand` en `EnvironmentSections.tsx`, con `data-parallax="0.18"`, capa de `-top-[20%]` y `h-[140%]`. La máscara va como clase `.video-band-mask` en `global.css`. Agregarla a `medioambiente.astro` con `client:tina`.
3. **Fondo de los pilares.** Pasar `EnvironmentPillars` a fondo petróleo, con texto blanco, numeración en `brand-secondary-light` y `btn-light` en lugar de `link-arrow`. Quitar la tarjeta blanca.
4. **Composición de los pilares.** Pasar a dos columnas desde `lg`, con las medidas de la tabla, `rounded-panel` y `shadow-deep`. La foto se alinea al borde exterior de su columna. Las imágenes llevan `loading="lazy"`.
5. **Parallax de los pilares.** Envolver cada medio en una capa con `data-parallax="-0.08"`, `-top-[15%]` y `h-[130%]`. El bloque padre lleva `overflow-hidden`.
6. **Línea.** Agregar el `svg` decorativo con `aria-hidden`, `hidden lg:block` y el `path` de la referencia, con `vectorEffect="non-scaling-stroke"`.
7. **Dibujo.** Crear `src/utils/scrollLine.ts` con `startScrollLine()`. Llamarla en `BaseLayout.astro` al cargar y en `astro:after-swap`. Usa un solo listener y `requestAnimationFrame`. Con movimiento reducido, deja la línea completa y quieta.
8. **Banner.** Reescribir `EnvironmentBanner` como sección propia a todo el ancho, sin `ImageBanner`, con `data-parallax="0.22"` y el degradado en `.environment-banner-scrim`. Quitar `0.22` de `PARALLAX_LAYERS` en `ImageBanner.tsx`.
9. **Revelado.** Quitar `.reveal` de los pilares y el banner en `medioambiente.astro`. No agregarlo a la franja.
10. **Videos.** Agregar `data-motion-video` en `BackgroundVideo` y crear `src/utils/reducedMotionVideo.ts`. Llamarlo en `BaseLayout.astro` al cargar y en `astro:after-swap`.
11. **Documentación.** Actualizar `CLAUDE.md` con los tokens, `data-scroll-line`, `data-motion-video` y la franja.

## Criterios de aceptación

**Franja**

- [ ] A 1440 px, la franja mide 420 px y funde del fondo claro al petróleo, sin línea visible de corte.
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
- [ ] A 1440 × 900 px, el hero mide 836 px, su título empieza a 333 px y funde a claro sin esquinas redondeadas.
- [ ] El compromiso está centrado, con el icono de hoja arriba y el texto a 680 px de ancho como máximo.
- [ ] Desde `lg`, la primera foto de pilar empieza en x=130 a 1440 px y cada pilar lleva el icono de hoja.
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
- **Sí:** la línea se revela con un `clip-path` vertical sobre el `svg`. Con `non-scaling-stroke`, el guion se mide en píxeles de pantalla e ignora `pathLength`, y la línea salía cortada en tramos.
- **No:** `getTotalLength`. Habría que convertir la longitud a píxeles y medirla de nuevo en cada cambio de tamaño.
- **Sí:** la franja y los pilares cargan su video a 100 px de la pantalla. Evita descargar dos veces el video del hero y cumple la carga bajo demanda del estándar.
- **Sí:** traer la composición del hero, el compromiso y los pilares. Esta decisión reemplaza la de la versión aprobada, porque en la revisión visual del 2026-11-01 la página quedó muy por debajo de la referencia. Sagar debe confirmarla en el PR.
- **Sí:** apartarse de la referencia en la franja (420 px), el espacio entre pilares (120 px) y la distancia entre texto y foto (218 px en todos los pilares). Había 768 px sin contenido tras el compromiso, con el mismo video del hero, y el pilar 2 quedaba a 320 px de su foto. Sagar debe confirmarlo en el PR.
- **Sí:** quitar `.sheet` en Medioambiente. El fundido del hero a claro no admite el corte con esquinas redondeadas.
- **No:** video en el banner. Pesa más del doble que los dos videos del sitio juntos.
- **No:** campo nuevo para el video de la franja. No hay otro video previsto.
- **No:** una biblioteca de animación. El cálculo cabe en pocas líneas.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El hero sigue en reproducción automática, y solo él carga al abrir la página. | La franja y los pilares cargan bajo demanda. Al llegar a la franja, el archivo puede pedirse de nuevo si el servidor no permite guardarlo en caché. |
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

## Notas de implementación

- **Línea:** el método de `pathLength={1}` pasaba las mediciones, pero las capturas mostraban la línea cortada en tramos. Se cambió por el `clip-path` registrado en "Decisiones". La punta de la línea queda siempre al 75 % del alto de la ventana.
- **Parallax de los pilares:** la capa pasó de `-top-[10%]` y `h-[120%]` a `-top-[15%]` y `h-[130%]`. Con factor negativo, el borde vacío aparecía en el lado visible: hasta 11 px a 1080 px de alto.
- **Banner:** el degradado de la referencia daba 1,34:1 en el antetítulo y 2,63:1 en el título. El tramo central subió a una opacidad de 0,8, como preveía "Riesgos". La foto queda bastante oscurecida.
- **Videos:** la carga bajo demanda no estaba en el plan. Se agregó tras medir 3,65 MB del video del hero al abrir la página, el doble del archivo. Ahora son 1,83 MB. También aplica al video de "Impresión responsable".
- **Pilares sin medio:** el bloque de la foto no se renderiza.
- **Revisión visual del 2026-11-01:** a 1440 × 900 px, el título del hero estaba 248 px más abajo que en la referencia, y la QA no lo detectaba porque esta spec dejaba fuera el hero y el compromiso. Se trajeron sus valores: hero de `100svh` menos el header y texto al 28 %, compromiso centrado, columna de 1180 px e icono de hoja.
- **Contraste del hero:** con el degradado de la referencia, el antetítulo daba 1,75:1 y el título 2,6:1 sobre el agua clara. Se agregó una elipse de opacidad 0,55 detrás del texto.
- **Espacios:** tras el compromiso había 768 px sin contenido y ahora quedan 468 px. La página bajó de 5.281 a 4.861 px a 1440 px. La capa de parallax de la franja pasó a `-top-[35%]` y `h-[170%]`, porque con 420 px de alto el margen anterior dejaba un borde vacío.
- **Medioambiente sin `.sheet`:** su fundido a claro reemplaza el corte con esquinas redondeadas.

## QA realizada

- **Navegador:** 28 de 28 comprobaciones en Chromium, repetidas tras la revisión visual sobre el build de producción sin catálogo de muestra. Cubren franja, pilares, línea, banner, footer, bordes vacíos a 1440 × 900 y 1920 × 1080, cambio de ancho, `ClientRouter`, movimiento reducido, consola y scroll horizontal a 375, 768 y 1024 px.
- **Capturas:** revisadas a 375, 1024, 1440 y 1920 px. Desde 1024 px, la línea cruza el texto de los pilares 1 y 2, incluido el título del pilar 2, y se sigue leyendo.
- **Contraste del hero:** peor 5 % en 4 momentos del video. A 1440 y 1920 px: antetítulo 4,93:1 y título de 7,59:1 a 7,90:1. A 375 px: antetítulo 4,91:1 y título de 4,59:1 a 4,74:1.
- **Contraste del banner:** medido sobre los píxeles detrás del texto, en el peor 5 % y en 3 posiciones. Antetítulo: 4,68:1 a 5,15:1. Título: 9,52:1 a 9,61:1.
- **LCP de `/medioambiente` a 1440 px:** mediana de 7 cargas a 1,6 Mbps y 150 ms de latencia: 2,39 s, entre 2,34 y 2,42 s, tras la revisión visual. La medición anterior dio 2,47 s. El elemento es el póster del hero, y la franja no lo afecta: 2,22 s con ella y 2,23 s sin su video, en una comparación con ruido de 1,6 a 3,1 s. Una comparación anterior que indicaba 350 ms de diferencia estaba mal hecha.
- **Variantes de contenido:** sin `hero.video`, la franja muestra el póster. Sin video ni póster, no aparece. El pilar sin medio, el banner sin imagen y 2 y 4 pilares funcionan sin errores. El título editado en el JSON se ve en la página. Se probaron antes del cambio de carga de videos y no se repitieron.
- **`client:tina`:** las islas de Medioambiente no se hidratan en producción. React se carga igual por el header.
- **Listener de scroll:** revisado en el código. En navegador solo se comprobó que la línea funciona tras navegar.
- **`npm run typecheck`:** sin errores.
- **`npm run check:standard`:** 0 errores y 1 aviso (14 páginas sin `og:image`), con build sin catálogo de muestra.
- **`npm run build`:** no se ejecutó, porque requiere credenciales de TinaCloud. `astro build` terminó sin errores (14 páginas), contra el servidor local de Tina.
- **Sin probar:** el editor de `/admin`, Safari, la edición en Tina con la línea en pantalla y la caché del video en el servidor real.
