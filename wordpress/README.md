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

## 6. mu-plugin de la ficha técnica

`quality-product-fields.php` agrega el campo **Ficha técnica (PDF)** en Datos del producto → General.
El botón **Elegir PDF** abre Medios filtrado a PDF y guarda la URL completa del archivo en el meta
`ficha_tecnica`. Solo acepta URLs `http` o `https`; vacío, borra el meta y el botón desaparece del sitio.

1. Copia `wordpress/mu-plugins/quality-product-fields.php` a `wp-content/mu-plugins/` del WordPress
   (cPanel → Administrador de archivos → `public_html/tienda.qualitysumprintpe.com/wp-content/`; crea
   la carpeta `mu-plugins` si no existe).
2. Plugins → **Imprescindibles**: debe aparecer "Quality · Ficha técnica del producto". Los mu-plugins no se
   activan: se cargan solos.
3. Comprobación: en el producto de prueba, elige un PDF y actualiza. Luego:
   `curl -s -u ck_…:cs_… https://tienda.qualitysumprintpe.com/wp-json/wc/v3/products/<id>` trae en
   `meta_data` un objeto con `"key": "ficha_tecnica"` y la URL del PDF.

El deploy no toca WordPress: cada versión nueva de un mu-plugin se sube a mano.

## 7. Token de GitHub para el rebuild

1. GitHub → Settings (de tu usuario) → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Repository access: **Only select repositories** → `sagarkishnani/quality-web`.
3. Permissions → Repository → **Contents: Read and write**. Nada más.
4. Fecha de expiración: 1 año. Anótala en el calendario para renovarlo. Mientras esté vencido, solo publica el rebuild diario.
5. Copia el token (`github_pat_…`) para el paso 8.

## 8. `woo-config.php` en el servidor de Astro

1. Copia `woo-config.example.php` (raíz del repo) como `public_html/woo-config.php` en el hosting.
2. Completa:
   - `store_url`: `https://tienda.qualitysumprintpe.com`, sin barra final.
   - `consumer_key` / `consumer_secret`: el par de **producción** del paso 5.
   - `webhook_secret`: una cadena aleatoria larga (`openssl rand -hex 32`). Es la misma que irá en los webhooks.
   - `github_repo`: `sagarkishnani/quality-web`.
   - `github_token`: el del paso 7.
   - `allowed_origins`, `cache_ttl` y `rate_limit` son del proxy `woo-api.php`, que hoy no se publica: déjalos como están.
3. Permisos `600` (cPanel → Administrador de archivos → Permisos).
4. Este archivo no está en git y el deploy no lo sobrescribe ni lo borra.
5. Comprobación: `curl -s -X POST https://qualitysumprintpe.com/rebuild-hook.php` responde `401` (firma inválida).
   Si responde `503`, falta el archivo o alguna de las tres claves del rebuild.

## 9. Webhooks de producto

WooCommerce → Ajustes → Avanzado → Webhooks → **Añadir webhook**, cuatro veces:

| Nombre | Estado | Tema | URL de entrega | Secreto | Versión de la API |
|---|---|---|---|---|---|
| Astro · producto creado | Activo | Producto creado | `https://qualitysumprintpe.com/rebuild-hook.php` | `webhook_secret` | WP REST API Integration v3 |
| Astro · producto actualizado | Activo | Producto actualizado | ídem | ídem | ídem |
| Astro · producto eliminado | Activo | Producto eliminado | ídem | ídem | ídem |
| Astro · producto restaurado | Activo | Producto restaurado | ídem | ídem | ídem |

Al guardar, Woo manda un ping. `rebuild-hook.php` lo responde con `200` sin disparar nada.
Cualquier evento firmado de producto redespliega: el sitio no muestra precio ni stock en vivo, así que no hay cambios "solo de existencias" que ignorar.

| Cambio en WooCommerce | Se ve en el sitio |
|---|---|
| Producto creado, editado, eliminado o restaurado (nombre, fotos, descripción, ficha técnica, atributos, oferta, destacado…) | Cuando termina el redeploy (unos minutos) |
| Categoría, etiqueta o término de atributo creado, renombrado o eliminado | Cuando termina el redeploy, con el mu-plugin de abajo |

Si un webhook aparece **Desactivado**, Woo tuvo varias entregas fallidas seguidas. Revisa los registros
(WooCommerce → Estado → Registros, fuente `webhooks-delivery`), corrige y vuelve a activarlo. Mientras tanto,
el rebuild diario mantiene el catálogo al día.

### mu-plugin de rebuild al editar categorías, etiquetas y atributos

WooCommerce no tiene webhooks de términos: renombrar una marca o borrar una categoría no toca los productos y
no dispara nada. `quality-term-rebuild.php` escucha la creación, edición y borrado de términos de `product_cat`,
`product_tag` y de cualquier atributo global (`pa_marca`, `pa_segmento`…). 60 segundos después manda a
`rebuild-hook.php` un aviso con el tema `product_term.updated`. Los cambios seguidos dentro de esa ventana salen en un solo deploy.

No se configura nada: el plugin toma la URL de entrega y el secreto del primer webhook **activo** de la tabla
de arriba. Si los cuatro están desactivados o borrados, no avisa.

1. Copia `wordpress/mu-plugins/quality-term-rebuild.php` a `wp-content/mu-plugins/`.
2. Plugins → **Imprescindibles**: debe aparecer "Quality · Rebuild al editar categorías, etiquetas y atributos".
3. Comprobación: renombra dos términos de `Marca` en menos de un minuto. En WooCommerce → Estado → Acciones
   programadas, grupo `quality-term-rebuild`, hay **una sola** acción `quality_term_rebuild_deliver`, que queda
   **Completada** al minuto. En GitHub → Actions aparece un solo "Deploy a producción" con evento
   `repository_dispatch`. Si la acción queda **Fallida**, su registro trae la respuesta de `rebuild-hook.php`.

## 10. GitHub Actions

En el repo → Settings → Secrets and variables → Actions.

**Secrets:**

| Nombre | Valor |
|---|---|
| `TINA_CLIENT_ID`, `TINA_TOKEN` | Los de TinaCloud (ya existen) |
| `WOO_STORE_URL` | `https://tienda.qualitysumprintpe.com` |
| `WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET` | El par de **producción** del paso 5 |
| `CPANEL_SSH_HOST` | Host SSH del hosting (cPanel → **Acceso SSH**, o el dominio del servidor) |
| `CPANEL_SSH_PORT` | Puerto SSH (por defecto `22`; algunos hostings usan otro) |
| `CPANEL_SSH_USER` | Usuario de cPanel |
| `CPANEL_SSH_KEY` | Clave privada cuya pública está autorizada en cPanel → Acceso SSH → Administrar claves SSH |
| `CPANEL_DEPLOY_PATH` | Ruta absoluta de `public_html`, por ejemplo `/home/<usuario>/public_html` (sin barra final) |

**Variables:**

| Nombre | Valor |
|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Site key pública de Cloudflare Turnstile |

Para generar la clave SSH: `ssh-keygen -t ed25519 -f quality-deploy -N ""`. Importa `quality-deploy.pub` en
cPanel y **autorízala**. El contenido de `quality-deploy` (privada) va en `CPANEL_SSH_KEY`. Si el plan del hosting
no trae SSH, el deploy no funciona: la alternativa registrada en la spec es FTPS con las mismas exclusiones.

"Deploy a producción" (`.github/workflows/deploy.yml`) corre en cada push a `main`, con cada webhook y todos
los días a las 04:00 de Lima. Antes de subir:

- Falla si faltan los secrets de Woo, porque el sitio saldría sin catálogo.
- Corre `typecheck` y `check:standard`. Este último falla si el build usó el catálogo de muestra.
- Se detiene si `dist/` trae una carpeta `tienda.qualitysumprintpe.com`.

El rsync usa `--delete`, pero **nunca toca**:

- `tienda.qualitysumprintpe.com/`, `.well-known/` y `cgi-bin/`.
- `site-config.php` y `woo-config.php`.
- `data/` (solo sube su `.htaccess`).
- `woo-api.php` y `*.example.php`, que no se publican.

Cualquier otro archivo de `public_html` que no venga en `dist/` se borra. Al terminar corre una prueba de humo
contra el sitio y contra `wp-login.php` de WordPress. Si falla, el job queda en rojo, pero lo subido no se revierte solo.

`public/.htaccess` también rige en la carpeta de WordPress, porque está dentro de `public_html`. Sus reglas
de `mod_rewrite` no la afectan (el `.htaccess` de WordPress activa su propio `RewriteEngine`), y la de HTTPS
coincide con lo que se quiere en `tienda.` de todos modos.

## 11. Staging en Amplify

El staging compila la rama `staging` contra el mismo WooCommerce, con su propio par de claves.

1. Amplify → la app → Hosting → **Environment variables**:
   - `WOO_STORE_URL`: `https://tienda.qualitysumprintpe.com`.
   - `WOO_CONSUMER_KEY` / `WOO_CONSUMER_SECRET`: el par de **staging** del paso 5.
   - Borra `WOO_SAMPLE_CATALOG` si existe.
2. Redeploy de la rama `staging`.
3. Comprobación: el catálogo de staging muestra el producto de prueba y el HTML no trae `<meta name="x-sample-catalog">`.

Amplify no ejecuta PHP: en staging el formulario y `rebuild-hook.php` no funcionan. Un cambio en Woo se ve en
staging solo al volver a compilar la rama.

## 12. Verificación de punta a punta

1. `npm run build` en local con el par de staging en `.env` (sin `WOO_SAMPLE_CATALOG`). Se generan
   `dist/productos/<slug>/` por cada producto publicado y `dist/productos/categoria/<slug>/` por cada categoría con productos.
2. `grep -rE "(ck|cs)_[0-9a-f]{40}" dist/` no devuelve nada.
3. `npm run check:standard` pasa sin errores.
4. Push a `main` (o "Run workflow" en "Deploy a producción"). El job termina en verde.
5. `https://tienda.qualitysumprintpe.com/wp-admin/` sigue funcionando. En el Administrador de archivos siguen
   `woo-config.php`, `site-config.php` y `data/`.
6. `https://qualitysumprintpe.com/no-existe` muestra la página 404 de Astro con código `404`.
7. Edita el producto de prueba en WooCommerce (por ejemplo, su ficha técnica). En menos de 2 minutos aparece en
   GitHub → Actions un "Deploy a producción" con evento `repository_dispatch`. Cuando termina, la ficha del sitio
   muestra el cambio.
8. `curl -X POST -H 'X-WC-Webhook-Topic: product.updated' -H 'X-WC-Webhook-Signature: falsa' -d '{}' https://qualitysumprintpe.com/rebuild-hook.php`
   responde `401` y no crea ninguna ejecución en GitHub.
