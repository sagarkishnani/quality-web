# SPEC 04 — Ficha técnica y bundle

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-01
> **Objetivo:** Agregar a la ficha de producto el botón "Descargar ficha técnica" y reorganizar "Puedes comprar con" en un panel único.

## Por qué existe esta spec

La referencia tiene el botón en la ficha de producto, pero su enlace es de muestra. Sagar aprobó traerlo, y faltaba definir de dónde sale el archivo. WooCommerce todavía no existe, así que esta spec también fija cómo debe cargarse.

La spec 01 dejó las tarjetas del bundle para esta spec. Después, el inventario funcional solo comparó su comportamiento, y el diseño quedó sin decidir. La comparación en navegador encontró dos problemas en el bloque actual:

- A 1440 px, las tarjetas y el resumen quedan separados por unos 500 px vacíos.
- Con 3 complementos y nombres largos, la página se desborda 259 px a 1024 px y 199 px a 768 px. El botón de cotización queda fuera de pantalla.

La referencia resuelve lo primero, pero solo admite 2 productos y no tiene versión mobile. Por eso esta spec usa un híbrido.

## Alcance

**Entra:**

- Campo `meta_data` de WooCommerce con clave `ficha_tecnica`, cuyo valor es la URL del PDF subido a Medios.
- Función en `src/lib/woo/catalog.ts` que lee esa URL y solo acepta `http`, `https` o una ruta que empieza con una sola `/`.
- Botón con icono de descarga, a todo el ancho y de 56 px de alto, entre la fila de cotización y el bloque de WhatsApp de `QuoteBoxReact`, en desktop y mobile.
- El PDF se abre en una pestaña nueva. Sin URL válida, el botón no aparece.
- Campo de Tina `datasheetLabel` en `shop.product`, con el valor "Descargar ficha técnica".
- Catálogo de muestra: un producto con ficha y un PDF de prueba en `public/`, para probar los dos casos.
- Sección de catálogo de `CLAUDE.md`: cómo se carga la ficha en WooCommerce.
- "Puedes comprar con" como panel único con tarjetas horizontales y resumen integrado, en desktop y mobile.
- Máximo de 3 complementos, tomados en el orden de `cross_sell_ids`.

**Qué no entra (para specs futuras):**

- Botón en la barra fija de la ficha.
- Forzar la descarga: el atributo `download` no funciona si el PDF está en otro dominio.
- Fichas por variación de producto.
- Subir PDF desde Tina.
- Plugins de WooCommerce.
- Cambiar la lógica de selección o el mensaje de cotización del bundle.
- Mover el bundle a la columna principal, como en la referencia.

## Modelo de datos

### WooCommerce

Cada producto con ficha lleva este campo personalizado:

| Clave | Valor | Ejemplo |
|---|---|---|
| `ficha_tecnica` | URL absoluta del PDF | `https://tienda.ejemplo.com/wp-content/uploads/ficha.pdf` |

La clave vive en la constante `DATASHEET_META_KEY` de `src/lib/woo/catalog.ts`. No es configurable desde Tina.

### Tipos

`WooProduct`, en `src/lib/woo/types.ts`, suma un campo:

```ts
meta_data: { key: string; value: unknown }[];
```

`value` es `unknown` porque WooCommerce también puede devolver objetos o listas.

`src/lib/woo/catalog.ts` suma una función:

```ts
datasheetUrlOf(product: WooProduct): string | undefined
```

Devuelve la URL sin espacios si es un texto con protocolo `http` o `https`, o una ruta que empieza con una sola `/`. En cualquier otro caso devuelve `undefined`.

### Props de `QuoteBoxReact`

| Prop | Tipo | Cambio |
|---|---|---|
| `datasheetUrl` | `string \| undefined` | Nueva. Sin valor, el botón no se renderiza. |
| `datasheetLabel` | `string` | Nueva. Texto del botón. |

### Tina: colección `shop`

| Campo | Tipo | Cambio |
|---|---|---|
| `product.datasheetLabel` | `string` | Nuevo. Valor en `src/content/shop/`: `Descargar ficha técnica`. |

### Catálogo de muestra

Un producto de `src/lib/woo/sample.ts` apunta a `${BASE}docs/ficha-muestra.pdf`, como las imágenes de ese archivo. El PDF vive en `public/docs/ficha-muestra.pdf`. Los demás productos llevan `meta_data: []`.

### Bundle

`BundleQuoteReact` no cambia sus props ni necesita campos nuevos de Tina. `src/pages/productos/[slug].astro` suma la constante `BUNDLE_EXTRAS_LIMIT = 3`.

## Plan de implementación

1. Agregar `meta_data` a `WooProduct` y `meta_data: []` a los productos de `src/lib/woo/sample.ts`. Agregar `DATASHEET_META_KEY` y `datasheetUrlOf` a `src/lib/woo/catalog.ts`. Prueba: `npm run typecheck`.
2. Agregar `datasheetLabel` a `product` en `tina/collections/shop.ts` y su valor en `src/content/shop/`. Regenerar `tina/__generated__/` y el lock con el build local.
3. Agregar `datasheetUrl` y `datasheetLabel` a `QuoteBoxReact`. Renderizar el enlace entre la fila de cotización y el bloque de WhatsApp, con `target="_blank"`, `rel="noopener noreferrer"` y el icono `FaDownload` con `aria-hidden`. Usar `min-h-14`, `py-2`, `text-center`, `rounded-md` y borde `line-strong`, que cambia a `ink` en hover.
4. En `src/pages/productos/[slug].astro`, pasar `datasheetUrlOf(product)` y `texts?.datasheetLabel || "Descargar ficha técnica"`. Prueba: sin URL, la ficha se ve igual que antes.
5. Crear `public/docs/ficha-muestra.pdf` y apuntar un producto de muestra a esa ruta. Prueba: con `WOO_SAMPLE_CATALOG=true`, ese producto muestra el botón y el PDF abre.
6. Documentar en la sección de catálogo de `CLAUDE.md` cómo cargar `ficha_tecnica` en WooCommerce.
7. En `src/pages/productos/[slug].astro`, tomar los complementos en el orden de `cross_sell_ids`, ignorar los que no estén en el catálogo y limitarlos con `BUNDLE_EXTRAS_LIMIT`.
8. Reescribir el layout de `BundleQuoteReact`:
   - Sección con fondo `surface-raised`.
   - Panel con fondo `surface-sunken`, `rounded-panel` y 24 px de relleno desde `sm`.
   - Tarjetas blancas horizontales de la misma altura, con 16 px de relleno y 16 px entre imagen y texto.
   - Miniatura de 112 px con `object-contain`, `width` y `height`, y fondo `surface-sunken`.
   - Check sobre la miniatura, arriba a la izquierda, con checkbox real y foco visible en la tarjeta.
   - Con 1 complemento, tarjetas y círculo blanco de 32 px con `+` en fila desde `md`. Con 2 o 3, grilla de 2 columnas desde `md`, sin `+`.
   - Resumen en la columna derecha desde `xl`, separado por una línea `line-strong`. Por debajo de `xl`, va abajo, a todo el ancho, con una línea horizontal.
9. Actualizar la sección de catálogo de `CLAUDE.md` con el máximo de complementos.

## Criterios de aceptación

- [ ] Un producto con `ficha_tecnica` válida muestra el botón entre la fila de cotización y el bloque de WhatsApp.
- [ ] Con el texto por defecto, el botón mide 56 px de alto y ocupa todo el ancho de la columna.
- [ ] El clic abre el PDF en una pestaña nueva.
- [ ] Un producto sin `ficha_tecnica` no muestra el botón ni deja un espacio vacío.
- [ ] `datasheetUrlOf` acepta `https://…`, `http://…` y `/docs/ficha.pdf`.
- [ ] `datasheetUrlOf` devuelve `undefined` con `javascript:alert(1)`, `//dominio.com/ficha.pdf`, texto vacío y valores que no son texto.
- [ ] Cambiar `datasheetLabel` en Tina cambia el texto del botón.
- [ ] El botón se puede enfocar y activar con teclado, y su foco es visible.
- [ ] A 375 px, el botón no genera scroll horizontal.
- [ ] La barra fija de la ficha no cambia.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run check:standard` pasa sin catálogo de muestra.
- [ ] `npm run build` pasa.
- [ ] `CLAUDE.md` explica cómo cargar `ficha_tecnica` en WooCommerce.
- [ ] A 1440 px, productos y resumen se ven dentro de un solo panel.
- [ ] Con 1 complemento, el círculo con `+` aparece entre las dos tarjetas. Con 2 o 3, no aparece.
- [ ] Un producto con 4 ventas cruzadas muestra solo las 3 primeras, en el orden de `cross_sell_ids`.
- [ ] Todas las tarjetas de una misma fila tienen la misma altura.
- [ ] Con 3 complementos y nombres largos, no hay scroll horizontal a 1440, 1280, 1024, 768 ni 375 px.
- [ ] Con 3 complementos, "Ver cotización" se ve dentro del ancho de pantalla en esos 5 anchos.
- [ ] Quitar un complemento baja la opacidad de su tarjeta, actualiza el conteo y lo saca del mensaje de cotización.
- [ ] El producto principal sigue marcado y no se puede desmarcar.
- [ ] Al enfocar un complemento con teclado, su tarjeta muestra un foco visible, y la barra espaciadora lo marca o desmarca.
- [ ] Un producto sin ventas cruzadas no muestra el bloque.
- [ ] Las imágenes de las tarjetas no se recortan.

## Decisiones

- **Sí:** campo personalizado `ficha_tecnica` con la URL del PDF. Es un dato por producto y no requiere plugins.
- **No:** `downloads` de WooCommerce. Obliga a marcar el producto como descargable, algo pensado para ventas, y este sitio no vende.
- **No:** atributo de WooCommerce. Mete una URL entre las especificaciones y obliga a excluirla de la tabla.
- **Sí:** abrir el PDF en una pestaña nueva. El atributo `download` no funciona entre dominios distintos, y WooCommerce no estará en el mismo dominio del sitio.
- **Sí:** aceptar rutas que empiezan con `/`. El catálogo de muestra las necesita para funcionar en `npm run dev`.
- **Sí:** clave fija en el código. Marca y segmento son configurables porque son datos de negocio; esta clave es un detalle técnico.
- **Sí:** el texto del botón se edita en Tina, como los demás textos de la ficha.
- **No:** botón en la barra fija. La referencia solo lo tiene en el bloque de cotización.
- **Sí:** bundle híbrido. Toma de la referencia el panel, las tarjetas horizontales y el resumen integrado, y conserva del sitio el checkbox, los varios complementos y el mobile.
- **Sí:** miniatura de 112 px, frente a los 88 px de la referencia. Una impresora necesita más detalle para reconocerse.
- **Sí:** `object-contain` en lugar del recorte de la referencia, para no cortar productos.
- **Sí:** máximo de 3 complementos. Más alargan el panel y dificultan decidir.
- **Sí:** el bundle sigue a todo el ancho, en su lugar actual. Moverlo cambiaría la estructura de la ficha sin resolver ningún problema.
- **No:** `button` para seleccionar, como en la referencia. El checkbox anuncia su estado sin código extra.
- **Sí:** cambio de alcance decidido por Esteban el 2026-11-01, y queda para validación de Sagar en el PR. Sagar había dejado fuera los cambios solo visuales, pero este también corrige un desborde real.
- **Sí:** un PDF de prueba en `public/docs/`. Se publica con el sitio, pesa poco y nada lo enlaza en un build real.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| WooCommerce todavía no existe, así que `meta_data` no se probó contra una API real. | La muestra replica la forma esperada. Hay que confirmar la clave con el primer producto real. |
| Un plugin de campos guarda el ID del archivo en lugar de la URL. | `datasheetUrlOf` lo rechaza y el botón no aparece. `CLAUDE.md` indica guardar la URL. |
| La URL del PDF cambia o se borra en WooCommerce. | El sitio se compila en build y no valida el archivo. El enlace queda roto hasta corregir la URL y recompilar. |
| El sitio usa datos de build y una ficha nueva no aparece sola. | Requiere recompilar, como cualquier cambio del catálogo. |
| El panel `surface-sunken` casi no se distingue sobre `surface`. | La sección pasa a `surface-raised`. |
| La miniatura de 112 px no basta con fotos reales, que aún no existen. | Revisarlo con el primer catálogo real. |
| Un producto con más de 3 ventas cruzadas pierde complementos en este bloque. | Es una decisión aprobada. El orden de `cross_sell_ids` define cuáles se ven. |

## Qué no entra en esta spec

- Botón en la barra fija de la ficha.
- Forzar la descarga del PDF.
- Fichas por variación de producto.
- Subir PDF desde Tina.
- Plugins de WooCommerce.
- Cambiar la lógica de selección o el mensaje de cotización del bundle.
- Mover el bundle a la columna principal.

## Notas de implementación

- `datasheetUrlOf` también rechaza rutas que empiezan con `/\`, porque el navegador las trata como `//`.
- `DATASHEET_META_KEY` se reutiliza en `src/lib/woo/sample.ts`.
- `tina/tina-lock.json` cambió con el schema y va en la rama.
- El botón usa `min-h-14` en lugar de `h-14`, porque el texto se edita en Tina y uno largo puede pasar a varias líneas.

## QA realizada

- **Navegador:** 15 de 15 comprobaciones en Chromium, sobre el build estático con catálogo de muestra. Cubren posición, 56 px de alto, ancho de columna, pestaña nueva con clic y con Enter, foco visible, producto sin ficha, 375 px, barra fija y consola sin errores.
- **Pestaña nueva:** el clic y Enter abren una pestaña nueva con la URL del PDF cuando la navegación se simula con HTML. Con el PDF real, la pestaña se abre, pero Chromium sin interfaz no muestra el PDF ni actualiza su URL. Por eso falta confirmarlo en un navegador normal. `/docs/ficha-muestra.pdf` responde 200 con `application/pdf`.
- **`datasheetUrlOf`:** 12 de 12 casos, con la función real.
- **Texto en Tina:** se cambió `datasheetLabel` en `src/content/shop/index.json`, el build mostró el texto nuevo y el cambio se revirtió.
- **`npm run typecheck`:** sin errores.
- **`npm run check:standard`:** 0 errores y 1 aviso, con build sin catálogo de muestra.
- **`npm run build`:** falla porque no hay credenciales de TinaCloud (`Missing clientId, token`). `npm run build:local` terminó sin errores, con y sin catálogo de muestra.
- **Bundle:** 111 de 111 comprobaciones en Chromium, sobre `npm run dev` y catálogo de muestra, con 1, 2 y 4 ventas cruzadas. Cubren 1440, 1280, 1024, 768 y 375 px con nombres largos, orden y límite de complementos, altura de tarjetas, signo `+`, imágenes sin recorte, selección, mensaje de cotización y teclado. Las ventas cruzadas se cambiaron de forma temporal en `src/lib/woo/sample.ts`.
- **Tras el bundle:** `npm run typecheck` sin errores. `npm run check:standard` con 0 errores y 1 aviso. `npm run build:local` sin errores, sin catálogo de muestra.
- **Sin probar:** `meta_data` contra una API real de WooCommerce, porque todavía no existe; el PDF abierto en un navegador normal, y el bundle con fotos y nombres reales.
