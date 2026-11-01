# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Comandos

```bash
npm run dev        # TinaCMS + Astro (siempre juntos: /admin necesita el server de Tina)
npm run build      # tinacms build → astro build
npm run preview     # previsualiza el build de producción
```

No hay test runner configurado.

## Entorno

Copia `.env.example` a `.env`. Deja `TINA_CLIENT_ID`/`TINA_TOKEN` vacíos para
trabajar en **modo local** (Tina lee y escribe los archivos de `src/content/`
sin cuenta en la nube).

**`TINA_BRANCH` importa más de lo que parece.** TinaCloud indexa el contenido
**por rama**, y el valor se hornea dentro de `tina/__generated__/client.ts` al
correr `tinacms build`: *no* se lee en runtime. Compilar un árbol contra el
índice de otra rama falla si los schemas difieren.

## Flujo de trabajo

### Ramas

`main` es producción y `staging` la línea de desarrollo. Las ramas de trabajo
**siempre salen de `staging` actualizado** y se PR-ean contra `staging`:

```
tipo/descripcion-corta
```

| Tipo | Cuándo |
|------|--------|
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de error |
| `chore/` | Mantenimiento, dependencias, configuración, limpieza |

Ejemplos: `feat/formulario-contacto`, `fix/total-checkout-igv`,
`chore/actualizar-dependencias`. Minúsculas, palabras separadas por guiones, sin
tildes ni espacios.

### Commits

Conventional Commits, descripción **en presente y en español**:

```
tipo(alcance opcional): descripción en presente
```

```
feat: agrega formulario de contacto
fix(checkout): corrige cálculo del total con IGV
chore: actualiza dependencias
```

### Código sin comentarios

El código tiene que explicarse solo: nombres claros de variables, funciones y
componentes, y funciones pequeñas con una sola responsabilidad. **No agregues
comentarios** salvo que sea estrictamente necesario, es decir, cuando expliquen
un *por qué* que el código no puede expresar (un workaround de un bug externo,
una restricción de una API, una decisión no obvia). Nunca comentes *qué* hace
el código, no dejes código comentado y no agregues comentarios de sección o
decorativos. Si algo parece necesitar un comentario, primero renombra o extrae.

## Arquitectura

**Astro 5 SSG + React 19 (islas) + TinaCMS 2 (CMS sobre git)**

El sitio se compila estático (sin adaptador SSR). Todo lo dinámico en runtime es
una isla de React hidratada.
La excepción son los formularios, que hablan con el backend PHP (ver **Formularios**).

### Patrón de componente doble

Cada sección alimentada por el CMS son dos archivos:

- `Componente.astro` — resuelve la consulta a TinaCMS **en build time** con
  `client` de `tina/__generated__/client` y pasa `{ query, variables, data }`.
- `ComponenteReact.tsx` — recibe esas props y renderiza; envuelve el contenido en
  `useTina()`, que es lo que habilita la edición visual en el panel.

Directivas de hidratación: `client:load` arriba del fold, `client:visible`
debajo. `client:tina` (integración propia en `astro-tina-directive/`) hidrata
**solo dentro del editor de Tina**: en producción no carga React.

Las secciones de una misma página comparten una sola consulta: la página la
resuelve y se la pasa a cada isla (ver `src/pages/index.astro`).

### Contenido y colecciones

El contenido vive en `src/content/` como JSON (páginas estructuradas).
El schema de `tina/config.ts` es la única fuente de verdad sobre la forma del
contenido; cada colección vive en su propio archivo en `tina/collections/`.
Los tipos, las queries y el cliente se generan en `tina/__generated__/`
(**no editar a mano**).

Colecciones:

- `global` — navegación (con megamenús de servicios y productos), datos de
  contacto y WhatsApp, proveedores y aliados, footer, SEO por defecto, código inyectado.
- `home` — portada: diapositivas del hero, productos destacados, servicios,
  experiencia, banner de medioambiente y testimonios.
- `about` — `/nosotros`; `hero.image` es la foto de fondo.
- `service` — un JSON por servicio en `src/content/services/`; el nombre del
  archivo es el slug de `/servicios/<slug>`. `order` ordena, `showOnHome` elige
  los que van en el bento del inicio e `image` es la foto del hero del detalle.
- `servicesPage` — `/servicios` y los textos comunes del detalle de servicio;
  `hero.image` es la foto de fondo.
- `environment` — `/medioambiente`. La franja de video reutiliza `hero.video` y `hero.poster`.
- `contactPage` — textos de `/contacto` (los datos salen de `global.contact`).
- `shop` — textos de `/productos`, banners promocionales, textos de la ficha y
  qué atributos de WooCommerce son la marca y el segmento.
- `formConfig` — por formulario: `formType`, `label`, `enabled`, `recipients[]`.
- `dynamicForms` — definición completa de cada formulario (un JSON por formulario).
- `maintenance` — modo mantenimiento del sitio.
- `cookieConsent` — textos del banner de cookies.

### Formularios (definidos en el CMS)

Los formularios no están hardcodeados:

- Cada uno es un JSON de `dynamicForms` con `fields[]` ordenados (`text`, `email`,
  `select`, `radio`, `checkbox`, `file`, `currency`, `date_triplet`,
  `section_header`, `note`…), con `validation`, `width` y visibilidad
  condicional por campo (`conditionalField`).
- `dynamic-form/DynamicForm.astro` carga un formulario por `formSlug` y lo
  renderiza con `DynamicFormReact.tsx`, que arma la UI con las primitivas de
  `shared/FormControls.tsx`.
- El envío pasa por `src/utils/submitForm.ts` → `POST` a **`send-email.php`**
  (JSON normalmente; `multipart/form-data` si hay adjuntos). Incluye honeypot
  (`website`) y token de Turnstile.
- En la variante de contacto, `successTitle` acepta `{nombre}` (primera palabra
  del campo `nombre`) y `successButtonText` muestra un botón que reinicia el
  formulario; si está vacío, el botón no aparece.
- `src/pages/form-config.json.ts` emite `/form-config.json` en build time: el
  mapa de destinatarios que lee el backend PHP.

**Secretos**: viven solo en `public/site-config.php` (git-ignored, plantilla en
`public/config.example.php`). `send-email.php` hace `require` de ese archivo.

**Captcha (Cloudflare Turnstile)**: el widget usa la site key **pública** de
`PUBLIC_TURNSTILE_SITE_KEY`; `send-email.php` verifica el token contra
`siteverify` con `turnstile_secret` y **falla cerrado** (token inválido o
`siteverify` inalcanzable ⇒ no se envía correo), solo mientras el secreto esté
configurado.

### Catálogo de WooCommerce (modo `catalog`)

El sitio **no vende**: muestra el catálogo y cada producto termina en una
cotización. Las rutas son `/productos`, `/productos/<slug>` y
`/productos/categoria/<slug>`, generadas en build desde la REST de Woo
(`src/lib/woo/rest.ts`, solo build time).

- Precios y stock no se muestran. “Ver cotización” lleva a
  `/contacto?requerimiento=<mensaje>`; el formulario precarga cualquier campo
  cuyo `name` coincida con un parámetro de la URL.
- Marca y segmento son **atributos** de WooCommerce (por defecto `Marca` y
  `Segmento`, configurables en la colección `shop`). Las pestañas de segmento
  siguen `shop.catalog.segmentOrder`.
- Etiqueta de la tarjeta: “Oferta” si el producto está en oferta; si no, la
  primera etiqueta (tag) del producto (ej. “Nuevo”, “Más vendido”).
- Destacados del inicio: productos marcados como destacados en Woo; si no hay,
  los primeros del catálogo.
- “Puedes comprar con” usa las ventas cruzadas (`cross_sell_ids`), con un máximo
  de 3 en ese orden; “Te puede interesar”, los relacionados o la misma categoría.
- Ficha técnica: el PDF se sube a Medios y su URL completa va en el campo
  personalizado `ficha_tecnica` del producto (guarda la URL, no el ID del
  archivo). `datasheetUrlOf` solo acepta `http` o `https`; sin URL válida, el botón no
  aparece. Abre en una pestaña nueva y el cambio se ve al recompilar. El catálogo
  de muestra no trae fichas.
- `src/lib/woo/catalog.ts` convierte un `WooProduct` en lo que pintan las
  tarjetas y no toca credenciales: puede importarse desde islas.

**Catálogo de muestra.** Mientras WooCommerce no exista, `WOO_SAMPLE_CATALOG=true`
en `.env` usa los productos del diseño (`src/lib/woo/sample.ts`). Las páginas
compiladas así llevan `<meta name="x-sample-catalog">` y `check:standard` da
**error**: un build con datos de muestra no puede publicarse.

### Modo mantenimiento

`BaseLayout.astro` consulta la colección `maintenance` en build time; con
`enabled: true` reemplaza todo el cuerpo de la página por una pantalla de aviso.

### Estilos

Tailwind CSS 3 con tokens propios en `tailwind.config.mjs`. Las clases
reutilizables (`btn-primary`, `btn-secondary`, `card`, `section`, `container-xl`,
`container-lg`) están en `src/styles/global.css`, que **BaseLayout importa** —
un CSS que nadie importa no se bundlea y no llega al sitio.

Iconos: `react-icons` (Font Awesome 6, `react-icons/fa6`).

**Tema: light.** Los componentes NO escriben colores: piden tokens
semánticos, y por eso el tema se puede cambiar sin tocar una sola clase.

| Token | Para qué | Valor |
|---|---|---|
| `surface` | Fondo de la página | `#F1F3F5` |
| `surface-raised` | Tarjetas, bloques blancos | `#FFFFFF` |
| `surface-sunken` | Tarjetas de producto y galería | `#F4F5F5` |
| `content` | Texto principal | `#111316` |
| `content-strong` | Navegación y texto de lectura | `#24272A` |
| `content-muted` | Texto secundario | `#5C6166` |
| `content-subtle` | Metadatos | `#6B7075` |
| `content-faint` | Numeración y texto de apoyo | `#9AA0A6` |
| `line` / `line-soft` / `line-strong` | Bordes | `#E6E8EB` / `#ECEEF0` / `#DADDE1` |
| `accent` | Marca en cifras y acentos | `#00A0DF` |
| `ink` / `ink-soft` | Botón primario, heros oscuros | `#111316` / `#24272A` |
| `petrol` / `petrol-deep` | Hero, franja, pilares y banner de Medioambiente | `#0D4553` / `#0B3B47` |

Los tonos siguen la referencia visual. `accent`, `content-faint`, `brand-secondary-dark` y el texto
blanco sobre `brand-primary` no llegan a 4.5:1: es una excepción registrada en `specs/01-tokens.md`,
y `check:standard` no la mide.

**Nunca escribas `text-white/65` ni `bg-white/5`**: asumen fondo oscuro y rompen
el tema. Las únicas excepciones legítimas son los bloques con fondo oscuro fijo
(el scrim del hero sobre una foto, el degradado de marca del CTA) y el texto
sobre `bg-brand-primary`.

Para "texto en color de marca" usa `text-accent`, **no** `text-brand-primary-light`:
sobre fondo claro ese tono es ilegible.

**Rampa de marca**: `brand-primary` (`#00A0DF`), `brand-primary-dark`
(`#0078A7`), `brand-primary-darkest` (`#005070`). Verde secundario:
`brand-secondary` (`#74C947`, fondos y acentos), `brand-secondary-dark`
(`#3E8E1F`, antetítulos sobre fondo claro), `brand-secondary-darkest`
(`#2F6E16`, iniciales y texto sobre verde claro),
`brand-secondary-light` (`#9BE070`, antetítulos sobre fondo oscuro).

**Botones**: `btn-primary` (tinta), `btn-accent` (verde, CTA del header),
`btn-light` y `btn-ghost-light` (sobre fondos oscuros), `btn-secondary`.
Tamaños: `btn` (46 px), `btn-sm` (40 px), `btn-lg` (48 px) y `btn-xl` (52 px).
Antetítulos: `eyebrow` (verde) y `eyebrow-caps` (mayúsculas, sobre fotos).

**Secciones**: las páginas con hero oscuro continúan en `<div class="sheet">`,
que sube 48 px con esquinas redondeadas. Envolver una sección en
`<div class="reveal">` la hace aparecer al entrar en pantalla; va siempre en el
`.astro`, nunca dentro de un componente React (la hidratación borraría la clase).

**Heroes**: los de Inicio, Nosotros, Servicios y detalle de servicio quedan fijos desde `lg`
(`lg:sticky lg:top-16`) y `.sheet` sube sobre ellos. `HeroPhoto` pinta la foto y su degradado;
sin imagen, el hero es el bloque oscuro.

**Parallax**: `src/utils/parallax.ts` mueve las capas con `data-parallax="<factor>"`, desde `lg` y
sin `prefers-reduced-motion`. La capa va dentro de un bloque con `overflow-hidden`, es más alta que
él y nunca contiene texto. Los heroes fijos suman `data-parallax-pinned`, porque calculan con
`scrollY`: sobre una sección fija, la distancia al centro no cambia.

**Línea de Medioambiente**: `src/utils/scrollLine.ts` dibuja el `path` con `data-scroll-line` según el
avance de su `section`, desde `lg`. Con `prefers-reduced-motion` queda completa y quieta. Por debajo
de `lg`, el `svg` no se muestra.

**Videos**: `BackgroundVideo` marca sus videos con `data-motion-video`, y
`src/utils/reducedMotionVideo.ts` los detiene con `prefers-reduced-motion`.

**Islas**: las secciones sin interacción usan `client:tina` (sin JavaScript en
producción). Solo hidratan de verdad el header, el slider del inicio, el
catálogo con filtros, la ficha de producto y el explorador de servicios.

**Tipografía**: Inter en todo el sitio. La escala está como utilidades de
Tailwind (`heading-xl` → `caption-xs`); los títulos son bold con tracking
negativo. Nada de tamaños sueltos como `text-[52px]`: si falta uno, va como token.

**Radios y sombras**: `rounded-xs` (etiquetas), `rounded-sm` (botones), `rounded-md`
(campos), `rounded-panel` (tarjetas e imágenes grandes); `shadow-soft`,
`shadow-lift` y `shadow-deep`.


### Panel del CMS

Disponible en `/admin` con `npm run dev`. Las imágenes se suben a `public/`.
