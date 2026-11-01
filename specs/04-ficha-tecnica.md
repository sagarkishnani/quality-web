# SPEC 04 — Ficha técnica

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-01
> **Objetivo:** Agregar a la ficha de producto un botón "Descargar ficha técnica" que abre el PDF indicado en WooCommerce.

## Por qué existe esta spec

La referencia tiene el botón en la ficha de producto, pero su enlace es de muestra. Sagar aprobó traerlo, y faltaba definir de dónde sale el archivo. WooCommerce todavía no existe, así que esta spec también fija cómo debe cargarse.

## Alcance

**Entra:**

- Campo `meta_data` de WooCommerce con clave `ficha_tecnica`, cuyo valor es la URL del PDF subido a Medios.
- Función en `src/lib/woo/catalog.ts` que lee esa URL y solo acepta `http`, `https` o una ruta que empieza con una sola `/`.
- Botón con icono de descarga, a todo el ancho y de 56 px de alto, entre la fila de cotización y el bloque de WhatsApp de `QuoteBoxReact`, en desktop y mobile.
- El PDF se abre en una pestaña nueva. Sin URL válida, el botón no aparece.
- Campo de Tina `datasheetLabel` en `shop.product`, con el valor "Descargar ficha técnica".
- Catálogo de muestra: un producto con ficha y un PDF de prueba en `public/`, para probar los dos casos.
- Sección de catálogo de `CLAUDE.md`: cómo se carga la ficha en WooCommerce.

**Qué no entra (para specs futuras):**

- Botón en la barra fija de la ficha.
- Forzar la descarga: el atributo `download` no funciona si el PDF está en otro dominio.
- Fichas por variación de producto.
- Subir PDF desde Tina.
- Plugins de WooCommerce.

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

## Plan de implementación

1. Agregar `meta_data` a `WooProduct` y `meta_data: []` a los productos de `src/lib/woo/sample.ts`. Agregar `DATASHEET_META_KEY` y `datasheetUrlOf` a `src/lib/woo/catalog.ts`. Prueba: `npm run typecheck`.
2. Agregar `datasheetLabel` a `product` en `tina/collections/shop.ts` y su valor en `src/content/shop/`. Regenerar `tina/__generated__/` y el lock con el build local.
3. Agregar `datasheetUrl` y `datasheetLabel` a `QuoteBoxReact`. Renderizar el enlace entre la fila de cotización y el bloque de WhatsApp, con `target="_blank"`, `rel="noopener noreferrer"` y el icono `FaDownload` con `aria-hidden`. Usar `h-14`, `rounded-md` y borde `line-strong`, que cambia a `ink` en hover.
4. En `src/pages/productos/[slug].astro`, pasar `datasheetUrlOf(product)` y `texts?.datasheetLabel || "Descargar ficha técnica"`. Prueba: sin URL, la ficha se ve igual que antes.
5. Crear `public/docs/ficha-muestra.pdf` y apuntar un producto de muestra a esa ruta. Prueba: con `WOO_SAMPLE_CATALOG=true`, ese producto muestra el botón y el PDF abre.
6. Documentar en la sección de catálogo de `CLAUDE.md` cómo cargar `ficha_tecnica` en WooCommerce.

## Criterios de aceptación

- [ ] Un producto con `ficha_tecnica` válida muestra el botón entre la fila de cotización y el bloque de WhatsApp.
- [ ] El botón mide 56 px de alto y ocupa todo el ancho de la columna.
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

## Decisiones

- **Sí:** campo personalizado `ficha_tecnica` con la URL del PDF. Es un dato por producto y no requiere plugins.
- **No:** `downloads` de WooCommerce. Obliga a marcar el producto como descargable, algo pensado para ventas, y este sitio no vende.
- **No:** atributo de WooCommerce. Mete una URL entre las especificaciones y obliga a excluirla de la tabla.
- **Sí:** abrir el PDF en una pestaña nueva. El atributo `download` no funciona entre dominios distintos, y WooCommerce no estará en el mismo dominio del sitio.
- **Sí:** aceptar rutas que empiezan con `/`. El catálogo de muestra las necesita para funcionar en `npm run dev`.
- **Sí:** clave fija en el código. Marca y segmento son configurables porque son datos de negocio; esta clave es un detalle técnico.
- **Sí:** el texto del botón se edita en Tina, como los demás textos de la ficha.
- **No:** botón en la barra fija. La referencia solo lo tiene en el bloque de cotización.
- **Sí:** un PDF de prueba en `public/docs/`. Se publica con el sitio, pesa poco y nada lo enlaza en un build real.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| WooCommerce todavía no existe, así que `meta_data` no se probó contra una API real. | La muestra replica la forma esperada. Hay que confirmar la clave con el primer producto real. |
| Un plugin de campos guarda el ID del archivo en lugar de la URL. | `datasheetUrlOf` lo rechaza y el botón no aparece. `CLAUDE.md` indica guardar la URL. |
| La URL del PDF cambia o se borra en WooCommerce. | El sitio se compila en build y no valida el archivo. El enlace queda roto hasta corregir la URL y recompilar. |
| El sitio usa datos de build y una ficha nueva no aparece sola. | Requiere recompilar, como cualquier cambio del catálogo. |

## Qué no entra en esta spec

- Botón en la barra fija de la ficha.
- Forzar la descarga del PDF.
- Fichas por variación de producto.
- Subir PDF desde Tina.
- Plugins de WooCommerce.
