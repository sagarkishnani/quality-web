# SPEC 03 — Heroes fijos y parallax

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-10-31
> **Objetivo:** Dejar fijos los heroes de Inicio, Nosotros, Servicios y detalle de servicio, con foto, y agregar un parallax compartido a heroes, banners e imágenes.

## Por qué existe esta spec

Sagar aprobó traer de la referencia los heroes fijos con foto y el parallax. Hoy solo Inicio tiene foto, y ningún hero queda fijo. Nosotros, Servicios y detalle de servicio son bloques oscuros.

La medición en la referencia encontró una diferencia. A 1440 px, con scroll de 0 a 500 px, la foto del hero de Nosotros se queda en 11,4 px, porque su parallax calcula sobre la propia sección y esta está fija. El parallax solo se mueve en los bloques no fijos.

Esta spec se aparta de la referencia en ese punto: las fotos de los heroes fijos sí se mueven con el scroll. Por eso los heroes fijos llevan un cálculo propio.

## Alcance

**Entra:**

- Hero fijo a 64 px del borde superior, desde `lg`, en Inicio, Nosotros, Servicios y detalle de servicio. El contenido sube sobre el hero.
- Foto de fondo con degradado en Nosotros, Servicios y detalle de servicio, en todos los anchos.
- Campo de imagen en Tina para el hero de Nosotros y el de Servicios. El detalle usa el `image` de cada servicio.
- Sin imagen, el hero sigue siendo el bloque oscuro actual.
- Mecanismo de parallax compartido con `data-parallax`, en JavaScript propio, porque las secciones con `client:tina` no cargan React en producción.
- Parallax desde `lg`, desactivado con `prefers-reduced-motion`:

| Bloque | Factor | Tipo |
|---|---|---|
| Hero de Inicio, Nosotros, Servicios y detalle de servicio | 0,15 | Fijo: se mueve con el scroll |
| Hero de Medioambiente | 0,3 | No fijo |
| Banner de Medioambiente del inicio | 0,16 | No fijo |
| Banner final de Medioambiente | 0,22 | No fijo |
| Imagen de "Solución integral" en Nosotros | 0,1 | No fijo |
| Imagen del detalle de servicio | 0,12 | No fijo |

- Al enfocar con teclado un elemento de un hero fijo tapado por el contenido, la página vuelve arriba para mostrarlo.
- Actualización de la sección de estilos de `CLAUDE.md`.

**Qué no entra (para specs futuras):**

- Parallax de los pilares y franja de video de impresión (spec 05).
- Línea animada y fondo petróleo de Medioambiente (spec 05).
- Hero fijo en Medioambiente, `/productos`, categoría y Contacto: la referencia no lo tiene ahí.
- Hero fijo o parallax por debajo de `lg`.
- Cambios de altura de los heroes o de tipografía: se conservan los actuales.
- Efecto de tarjetas apiladas: es código muerto en la referencia.

## Modelo de datos

### Tina: colecciones `about` y `servicesPage`

| Campo | Tipo | Cambio |
|---|---|---|
| `hero.image` | `image` | Nuevo y opcional. Foto de fondo del hero. |

Contenido inicial:

| Archivo | `hero.image` |
|---|---|
| `src/content/about/index.json` | `/images/banners/inicio.webp` |
| `src/content/services-page/index.json` | `/images/banners/hp.webp` |

El detalle de servicio no agrega campos: usa `service.image`, que ya tienen los 7 servicios.

### Atributos de parallax

| Atributo | Valor | Uso |
|---|---|---|
| `data-parallax` | Factor, ej. `0.15` | Marca la capa que se mueve. Va en un contenedor de la imagen o el video, nunca en el texto. |
| `data-parallax-pinned` | Sin valor | Se suma en heroes fijos y cambia el cálculo. |

El desplazamiento vertical de cada capa es:

| Tipo | Cálculo |
|---|---|
| No fijo | `(centro del bloque − mitad de la ventana) × −factor` |
| Fijo | `scrollY × −factor` |

En el hero fijo, la foto sube más lento que el contenido. El borde inferior que deja al subir queda tapado por `.sheet`.

### Sobredimensión de cada capa

La capa es más alta que su bloque, para que no aparezcan bordes vacíos. Los valores salen de la referencia:

| Bloque | `top` | Altura |
|---|---|---|
| Heroes fijos | −10 % | 120 % |
| Hero de Medioambiente | −14 % | 128 % |
| Banner de Medioambiente del inicio | −18 % | 136 % |
| Banner final de Medioambiente | −16 % | 132 % |
| Imagen de "Solución integral" | −12 % | 124 % |
| Imagen del detalle de servicio | −15 % | 130 % |

### Componentes

| Componente | Cambio |
|---|---|
| `src/components/ui/HeroPhoto.tsx` | Nuevo. Pinta la capa con `data-parallax`, la foto y el degradado. Recibe `image`, `align` y `tinaField`. |
| `DarkHero.tsx` | Props nuevas `image` y `tina.image`. Sin `image`, conserva el círculo decorativo actual. |
| `ImageBanner.tsx` | Prop nueva `parallax`, de tipo `number` y opcional. Sin ella, la imagen queda quieta. |

### Degradados

Se escriben con el token `ink`, y entran en la excepción de fondos oscuros fijos de `CLAUDE.md`:

| `align` | Clases | Uso |
|---|---|---|
| `left` | `bg-gradient-to-r from-ink/80 to-ink/30` | Nosotros y detalle de servicio |
| `center` | `bg-gradient-to-b from-ink/60 via-ink/30 to-ink/50` | Servicios |

Inicio conserva su capa `bg-ink/50`.

## Plan de implementación

1. **Capa del contenido.** Agregar `z-10` a `.sheet` en `src/styles/global.css`, para que el contenido pase por encima de un hero fijo. Ninguna pantalla cambia todavía.
2. **Mecanismo de parallax.** Crear `src/utils/parallax.ts` con los dos cálculos.
   - Actualiza una vez por cuadro durante el scroll, y solo las capas visibles.
   - No se activa por debajo de `lg` ni con `prefers-reduced-motion`.
   - Si la ventana baja de `lg`, limpia los desplazamientos.
3. **Conexión al layout.** Iniciar el mecanismo desde el script de `BaseLayout.astro`, y volver a buscar las capas en `astro:after-swap`. Sin atributos en las páginas, no hace nada.
4. **Campos de Tina.** Agregar `hero.image` a `tina/collections/about.ts` y `tina/collections/servicesPage.ts`, y cargar las dos rutas en `src/content/about/index.json` y `src/content/services-page/index.json`.
5. **`HeroPhoto`.** Crear `src/components/ui/HeroPhoto.tsx` con la capa, la foto y el degradado. La foto usa `loading="eager"` y `fetchPriority="high"`, porque es la imagen principal de la pantalla.
6. **`DarkHero`.** Recibir `image` y `tina.image`, y pintar `HeroPhoto` cuando exista. Sin imagen, sigue igual.
7. **Nosotros y Servicios.** Pasar `hero.image` desde `AboutSections.tsx` y `ServicesSections.tsx`.
8. **Detalle de servicio.** Usar `HeroPhoto` con `service.image` en `ServiceHero`, dentro de `ServiceDetailReact.tsx`.
9. **Heroes fijos.** Agregar `lg:sticky lg:top-16` a `DarkHero` y `ServiceHero`.
10. **Inicio.** En `HeroSliderReact.tsx`, agregar las mismas clases y envolver las fotos en una capa con `data-parallax="0.15"` y `data-parallax-pinned`. El fundido y el zoom de cada diapositiva no cambian.
11. **Banners.** Agregar la prop `parallax` a `ImageBanner.tsx`, y pasar `0.16` desde `HomeEcoBanner` y `0.22` desde `EnvironmentBanner`.
12. **Imágenes y Medioambiente.** Agregar la capa con su factor en "Solución integral" (`AboutSections.tsx`), en la imagen del detalle (`ServiceDetailReact.tsx`) y en el hero de `EnvironmentSections.tsx`.
13. **Foco con teclado.** En `src/utils/parallax.ts`, al recibir foco un elemento dentro de un hero fijo con la página desplazada, volver arriba. Este paso funciona también con movimiento reducido, sin animación, y por eso no depende de que el parallax esté activo.
14. **Documentación.** Actualizar en `CLAUDE.md` la sección de estilos con `data-parallax`, `data-parallax-pinned` y `HeroPhoto`, y agregar `hero.image` a las colecciones si corresponde.

## Criterios de aceptación

**Heroes fijos**

- [ ] A 1440 px, los heroes de Inicio, Nosotros, Servicios y detalle de servicio quedan a 64 px del borde superior al hacer scroll.
- [ ] El contenido sube por encima del hero, y sus esquinas redondeadas se ven sobre la foto.
- [ ] El header, el botón de WhatsApp y el banner de cookies quedan por encima del hero y del contenido.
- [ ] Al llegar al final de la página, el hero no se ve detrás del footer.
- [ ] Por debajo de `lg`, ningún hero queda fijo.
- [ ] Los heroes conservan las alturas actuales.

**Fotos**

- [ ] Nosotros, Servicios y los 7 detalles de servicio muestran foto de fondo en 375 px y 1440 px.
- [ ] Sin `hero.image`, Nosotros y Servicios muestran el bloque oscuro actual, sin imagen rota.
- [ ] Sin `service.image`, el detalle muestra el bloque oscuro.
- [ ] Desde `/admin` se puede cambiar `hero.image` en Nosotros y en Servicios.
- [ ] El texto blanco se lee sobre el degradado en Nosotros, Servicios y los 7 detalles.

**Parallax**

- [ ] Desde `lg`, las fotos de los cuatro heroes fijos cambian de posición al hacer scroll, y el texto del hero no se mueve.
- [ ] Los cinco bloques no fijos se mueven con su factor: 0,3, 0,16, 0,22, 0,1 y 0,12.
- [ ] A 1440 × 900 y 1920 × 1080, ningún bloque muestra un borde vacío en todo su recorrido.
- [ ] En Inicio, el fundido, el zoom y el cambio automático de diapositivas siguen funcionando con parallax.
- [ ] Por debajo de `lg`, ninguna capa tiene desplazamiento.
- [ ] Al pasar de 1440 px a 375 px sin recargar, los desplazamientos se limpian.
- [ ] Con `prefers-reduced-motion`, ninguna capa se mueve.
- [ ] Después de navegar entre páginas con `ClientRouter`, el parallax funciona en la página nueva y no queda más de un listener de scroll.
- [ ] Las secciones con `client:tina` funcionan sin cargar React en producción.

**Teclado**

- [ ] Con la página desplazada, enfocar con teclado un enlace o botón de un hero fijo vuelve arriba y lo deja visible.
- [ ] Con `prefers-reduced-motion`, ese regreso ocurre sin animación.

**Sin regresiones**

- [ ] A 375 px, ninguna de las 8 pantallas presenta scroll horizontal ni texto cortado o superpuesto.
- [ ] Los filtros de `/productos` y la galería de la ficha siguen fijos a 96 px si la spec 02 ya está en la rama.
- [ ] El LCP de Nosotros y Servicios a 1440 px no empeora más de 300 ms frente a `staging`.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run check:standard` termina sin errores, sin el catálogo de muestra.
- [ ] `npm run build` termina sin errores.
- [ ] `CLAUDE.md` documenta `data-parallax`, `data-parallax-pinned` y `HeroPhoto`.
- [ ] La spec incluye "Notas de implementación" y "QA realizada".

## Decisiones

**Tomadas:**

- **El sitio actual se queda como base.** Decisión de Sagar del 2026-10-31: de la referencia solo se trae lo que funcione o se vea mejor.
- **Se aplica parallax sobre secciones con texto, aunque el estándar lo rechaza.** Sagar aprobó la excepción el 2026-10-31. Cubre los heroes y los banners, y queda registrada también en el PR.
- **Las fotos de los heroes fijos se mueven con el scroll.** Decisión de Esteban. En la referencia no se mueven, porque su cálculo no sirve para una sección fija. Este efecto no está en la referencia, y el PR debe señalarlo.
- **Inicio también lleva parallax.** La referencia no lo tiene ahí, pero así todos los heroes fijos se comportan igual.
- **Los heroes fijos usan `scrollY` y los demás bloques la distancia al centro de la ventana.** Con la distancia al centro, un hero fijo nunca se mueve.
- **Hero fijo y parallax aplican desde `lg`.** No hay referencia mobile, y en pantallas bajas el contenido taparía el botón del hero. Es el mismo corte de la spec 02.
- **La foto sí aparece en todos los anchos.** Es parte del hero, no del movimiento.
- **El parallax va en JavaScript propio, sin biblioteca.** Las secciones con `client:tina` no cargan React en producción, y el proyecto ya tiene un script compartido en `BaseLayout.astro`.
- **El texto nunca va dentro de la capa que se mueve.** Solo se desplazan la imagen o el video.
- **No se suaviza el movimiento por separado.** Lenis ya suaviza el scroll, así que el retardo de 0,09 de la referencia sería un segundo suavizado.
- **Las fotos de Nosotros y Servicios se editan en Tina.** Son contenido visible, y el equipo debe poder cambiarlas sin tocar código.
- **El detalle de servicio reutiliza `service.image`.** Coincide con la imagen de la referencia en los 7 servicios, así que no hace falta un campo nuevo.
- **Las alturas de los heroes no cambian.** La regla acordada es no agregar diferencias de altura contra la referencia.
- **Los degradados usan el token `ink`.** El `rgba(10,12,14)` de la referencia es casi igual y no existe como token.
- **El factor 0,15 aplica a los cuatro heroes fijos.** Es el valor de la referencia en los heroes que lo tienen.
- **Los pilares y la franja de impresión se van a la spec 05.** Esa spec rehace esa parte de Medioambiente.

**Descartadas:**

- **Copiar el cálculo de la referencia en los heroes fijos.** Agrega código que no produce movimiento.
- **Dejar quieta la foto de los heroes fijos.** Era la opción más simple, pero se eligió el movimiento.
- **Una biblioteca como GSAP.** Agrega una dependencia para un cálculo de pocas líneas.
- **`background-attachment: fixed`.** No permite factores por bloque y funciona mal en Safari.
- **Parallax por debajo de `lg`.** No hay referencia y gasta batería sin necesidad.
- **Un campo `heroImage` nuevo por servicio.** Duplica un dato que ya existe.
- **Alturas de la referencia: 680, 620 y 600 px.** Contradicen la regla de no igualar alturas.
- **Copiar el retardo de la referencia.** Ya se explica arriba.
- **Parallax en los pilares ahora.** Se tocaría dos veces el mismo bloque.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El campo nuevo cambia el schema, y TinaCloud indexa por rama: compilar contra un índice sin ese campo falla. | Confirmar que la rama esté indexada antes de `npm run build`. Si no hay credenciales, correr `npm run build:local` y anotarlo en "QA realizada". |
| La foto en movimiento no está en la referencia, y Sagar no la ha visto. | Señalarla en el PR con captura o preview. El cambio a foto quieta se limita a quitar `data-parallax` de esas capas. |
| Un elemento enfocado queda tapado por el contenido, porque el navegador cree que un hero fijo ya está visible. | El paso 13 lo resuelve, y dos criterios de "Teclado" lo verifican. |
| Con `ClientRouter`, un listener puede duplicarse al navegar. | Registrar un solo listener de scroll y buscar las capas de nuevo en `astro:after-swap`. El criterio de navegación lo verifica. |
| `startLenis` ya crea un ciclo de animación nuevo en cada navegación. Es anterior a esta spec y puede acelerar el scroll. | El parallax no se conecta a ese ciclo. Comprobarlo en la QA y anotarlo en "Notas de implementación" si afecta. |
| La hidratación del slider de Inicio podría borrar el desplazamiento de la capa. | La capa no declara `style` en React, así que el render no lo toca. Comprobarlo durante el cambio automático de diapositivas. |
| Las fotos cambian de aspecto entre pantallas anchas y bajas, y el recorte puede cortar la impresora. | Revisar las 9 fotos a 1440 × 900 y 1920 × 1080. |
| `banners/inicio.webp` se repite en Inicio y Nosotros, y `banners/hp.webp` se repite en Servicios y "Equipos de respaldo". | Es igual en la referencia, y `hero.image` permite cambiarlas desde Tina. |
| Las fotos miden 1728 px de ancho y pueden verse blandas por encima de 1920 px. | Revisar a 1920 × 1080. Si se ven mal, reportarlo sin reemplazarlas en esta spec. |
| Las ramas de esta spec y de la spec 02 pueden chocar en `global.css`, si el PR #3 sigue abierto. | La rama sale de `staging` actualizado. Si el PR #3 se mergea antes, actualizarla antes de abrir el PR. |

## Qué no entra en esta spec

- Parallax de los pilares y franja de video de impresión (spec 05).
- Línea animada y fondo petróleo de Medioambiente (spec 05).
- Hero fijo en Medioambiente, `/productos`, categoría y Contacto.
- Hero fijo o parallax por debajo de `lg`.
- Cambios de altura de los heroes o de tipografía.
- Efecto de tarjetas apiladas.
- Corregir los ciclos duplicados de `startLenis`.

Si alguno de estos entra, va en su propia spec.
