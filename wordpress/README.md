# WordPress + WooCommerce para Quality Sumprint

Qué hay que configurar en WordPress, y a su alrededor, para que el sitio en Astro
muestre el catálogo de WooCommerce y se vuelva a publicar solo cuando cambian los productos.
Sigue los pasos en orden. La decisión de diseño está en `specs/14-conexion-wordpress-woocommerce.md`.

El sitio **no vende**: cada producto termina en una cotización. WooCommerce solo guarda el
catálogo, las fotos y las fichas técnicas.

## Cómo encaja todo

| Pieza | Dominio | Carpeta en cPanel | Qué sirve |
|---|---|---|---|
| Astro (estático + PHP) | `qualitysumprintpe.com` | `public_html` | Sitio, `send-email.php`, `rebuild-hook.php` |
| WordPress + WooCommerce | `tienda.qualitysumprintpe.com` | `public_html/tienda.qualitysumprintpe.com` | Admin de productos, API REST, Medios (fichas PDF, fotos) |
| Staging | Amplify | — | Rama `staging`, contra el mismo Woo con claves propias |

Cada uno vive en su propio dominio: no hay `.htaccess` compartido ni reparto de rutas.
La carpeta de WordPress sí vive **dentro** de `public_html`, y el deploy la excluye siempre.

- **Catálogo:** se compila en el build con la API REST v3 de Woo, con claves de solo lectura.
- **Rebuild:** los webhooks de producto llaman a `rebuild-hook.php`, que dispara
  `.github/workflows/deploy.yml`. Las categorías, etiquetas y atributos no tienen webhook:
  los avisa el mu-plugin `quality-term-rebuild.php`. Además, hay un rebuild diario a las 04:00 de Lima.

## 1. SSL y HTTPS del subdominio

Las claves de la API viajan en Basic Auth: sin HTTPS, cualquiera en el camino las lee.

1. cPanel → **SSL/TLS Status**: `tienda.qualitysumprintpe.com` y `www.tienda.qualitysumprintpe.com`
   deben tener certificado válido. Si no, **Run AutoSSL** y espera a que termine.
2. cPanel → **Dominios** → fila de `tienda.qualitysumprintpe.com` → activa **Force HTTPS Redirect**.
3. Haz lo mismo con `qualitysumprintpe.com`.
4. WordPress → Ajustes → Generales: **Dirección de WordPress** y **Dirección del sitio** con `https://`.
5. Comprobación: `curl -sI http://tienda.qualitysumprintpe.com` responde `301` con
   `Location: https://tienda.qualitysumprintpe.com/`.

## 2. WooCommerce

Requisitos: WordPress 6.4 o superior y PHP 8.0 o superior, tanto en WordPress como en el hosting de Astro.

1. Ajustes → Enlaces permanentes → cualquier opción menos "Simple". La API REST la necesita.
2. Plugins → Añadir nuevo → **WooCommerce** → Instalar → Activar.
3. Salta el asistente de configuración o complétalo con lo mínimo:
   - País: Perú.
   - Moneda: PEN.
   - Sin pagos, sin envíos y sin extensiones recomendadas.
4. Comprobación: `https://tienda.qualitysumprintpe.com/wp-json/wc/v3` responde JSON, aunque sea un `401`.

## 3. Ajustes sin venta

El front de WooCommerce en `tienda.` sigue existiendo. Estos ajustes evitan que alguien compre ahí y que Google lo indexe:

1. WooCommerce → Ajustes → **Pagos**: desactiva todos los métodos.
2. WooCommerce → Ajustes → **Envío**: sin zonas de envío.
3. Ajustes → Lectura → marca **Disuadir a los motores de búsqueda de indexar este sitio**.
4. WooCommerce → Ajustes → Productos → Inventario: desactiva **Gestionar inventario**. El sitio no muestra stock.

## 4. Atributos, categorías y etiquetas

El sitio lee la marca y el segmento de **atributos globales** de WooCommerce. Los nombres se configuran en
el CMS (colección `shop`, campos `brandAttribute` y `segmentAttribute`). Por defecto son `Marca` y `Segmento`.

1. Productos → **Atributos** → crea `Marca` y `Segmento`. Deja el slug que propone Woo (`marca`, `segmento`).
2. En cada atributo → **Configurar términos**: agrega las marcas (HP, Epson…) y los segmentos.
   El orden de las pestañas de segmento se define en el CMS (`shop.catalog.segmentOrder`).
3. Productos → **Categorías**: crea las categorías del catálogo. Cada una genera `/productos/categoria/<slug>`.
4. Productos → **Etiquetas**: la primera etiqueta de un producto es la insignia de su tarjeta (ej. "Nuevo",
   "Más vendido"). Si el producto está en oferta, la insignia es "Oferta".
5. En cada producto → Datos del producto → **Atributos**: agrega `Marca` y `Segmento`, elige el término y
   marca **Visible en la página de productos**.

Otros datos que lee el sitio desde el producto:

| Dato en WooCommerce | Dónde se ve |
|---|---|
| Producto destacado (estrella) | Destacados del inicio. Sin ninguno, los primeros del catálogo |
| Ventas cruzadas | "Puedes comprar con", máximo 3, en ese orden |
| Productos relacionados o la misma categoría | "Te puede interesar" |
| Ficha técnica (paso 6) | Botón "Descargar ficha técnica" |

Antes del primer deploy, carga al menos **un producto de prueba** publicado, con marca, segmento, categoría y foto.

## 5. Claves REST de solo lectura

Se crean **dos pares**: uno para producción y otro para el staging de Amplify. Así, revocar uno no tumba el otro.

1. WooCommerce → Ajustes → Avanzado → API REST → **Añadir clave**.
2. Descripción: `Astro producción (solo lectura)`. Usuario: un administrador. Permisos: **Lectura**.
3. Copia `ck_…` y `cs_…`. Solo se muestran una vez.
4. Repite con la descripción `Astro staging (solo lectura)`.
5. Dónde va cada par:

| Par | Dónde |
|---|---|
| Producción | GitHub Secrets (`WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET`, paso 10) y `woo-config.php` del servidor (paso 8) |
| Staging | Variables de entorno de Amplify (paso 11) y `.env` local |

6. Comprobación:
   - `curl -s -u ck_…:cs_… https://tienda.qualitysumprintpe.com/wp-json/wc/v3/products` responde `200` con la lista.
   - `curl -s -o /dev/null -w '%{http_code}' -u ck_…:cs_… -X POST https://tienda.qualitysumprintpe.com/wp-json/wc/v3/products` responde `401` o `403`.

Nunca uses claves con permiso de escritura. Si una clave se filtra, revócala en esa misma pantalla y crea otra.
