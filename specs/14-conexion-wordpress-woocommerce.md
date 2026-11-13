# SPEC 14 — Conexión con WordPress y WooCommerce

> **Estado:** Aprobado
> **Depende de:** SPEC 04 (ficha técnica)
> **Fecha:** 2026-11-13
> **Objetivo:** Conectar el catálogo al WooCommerce de `tienda.qualitysumprintpe.com` y publicar el sitio en el hosting con un rebuild automático cuando cambian los productos.

## Por qué existe esta spec

El catálogo ya se arma desde la REST de Woo en build (`src/lib/woo/rest.ts`), pero nunca se conectó a una tienda real: todos los builds usan `WOO_SAMPLE_CATALOG=true`. Faltan cuatro piezas:

- **Tienda.** WordPress ya está instalado en `tienda.qualitysumprintpe.com`, pero sin WooCommerce, sin HTTPS forzado, sin claves REST, sin marcas cargadas y sin el atributo `Segmento`.
- **Deploy.** Solo existe el staging de Amplify. `qualitysumprintpe.com` está vacío y no hay workflow que publique ahí.
- **Rebuild.** Los productos se compilan en build. Sin un disparador, un producto nuevo no aparece hasta un deploy manual.
- **Ficha técnica.** La URL del PDF se carga a mano como campo personalizado `ficha_tecnica`, y es fácil equivocarse.

La base es la integración de ERES (`eres-skin-studio`, spec 02). Quality no vende, así que se queda fuera todo lo que ERES tiene para el carrito, el checkout y el pago.

## Topología

| Pieza | Dominio | Carpeta en cPanel | Qué sirve |
|---|---|---|---|
| Astro (estático + PHP) | `qualitysumprintpe.com` | `public_html` | Sitio, `send-email.php`, `rebuild-hook.php` |
| WordPress + WooCommerce | `tienda.qualitysumprintpe.com` | `public_html/tienda.qualitysumprintpe.com` | Admin de productos, API REST, Medios (fichas PDF, fotos) |
| Staging | Amplify | — | Rama `staging`, contra el mismo Woo con claves propias |

Cada uno vive en su propio dominio, así que no hay `.htaccess` compartido ni reparto de rutas como en ERES. La carpeta de WordPress sí vive **dentro** de `public_html`: el deploy nunca puede borrarla.

Flujo de rebuild:

1. En Woo se crea, edita, borra o restaura un producto, o se cambia una categoría, una etiqueta o un término de atributo.
2. Un webhook hace `POST` a `https://qualitysumprintpe.com/rebuild-hook.php`.
3. `rebuild-hook.php` verifica la firma HMAC y dispara `repository_dispatch` (`woo-catalog-changed`) en `sagarkishnani/quality-web`.
4. `.github/workflows/deploy.yml` compila y sube por FTPS. Ese mismo workflow corre también en cada push a `main` y todos los días a las 04:00 de Lima.

## Alcance

**Entra:**

- Guía `wordpress/README.md`, en orden: SSL y HTTPS forzado del subdominio, instalación de WooCommerce, ajustes mínimos sin venta, marcas nativas y atributo `Segmento`, claves REST de solo lectura, mu-plugins, webhooks, token de GitHub, `woo-config.php`, secrets de GitHub, Amplify y verificación de punta a punta.
- mu-plugin `wordpress/mu-plugins/quality-product-fields.php`: caja "Ficha técnica (PDF)" en la edición del producto, que elige un PDF de Medios y guarda su URL en el meta `ficha_tecnica`.
- mu-plugin `wordpress/mu-plugins/quality-term-rebuild.php`: avisa a `rebuild-hook.php` al crear, editar o borrar términos de `product_cat`, `product_tag`, `product_brand` y de cualquier atributo global (`pa_*`).
- La marca del catálogo sale de **Productos → Marcas** (taxonomía nativa `product_brand`, campo `brands` de la REST v3). Si un producto no tiene marca nativa, se usa el atributo de `shop.catalog.brandAttribute`.
- Endpoint `public/rebuild-hook.php`, adaptado del de ERES, sin la huella de producto: cualquier evento válido redespliega.
- Claves nuevas en `woo-config.example.php`: `webhook_secret`, `github_repo` y `github_token`.
- Workflow `.github/workflows/deploy.yml`: push a `main`, `repository_dispatch` (`woo-catalog-changed`) y cron diario. Hace build contra el Woo real, `typecheck`, `check:standard`, subida por FTPS y una prueba de humo.
- `public/.htaccess` mínimo: HTTPS forzado y `ErrorDocument 404 /404.html`.
- Staging de Amplify contra el Woo real, con un par de claves de solo lectura propias y sin `WOO_SAMPLE_CATALOG`.
- Sección **Catálogo de WooCommerce** de `CLAUDE.md` y sección de despliegue del `README.md` actualizadas.

**Fuera de alcance (para specs futuras):**

- Carrito, checkout, pagos, página de gracias, evento de compra y libro de reclamaciones.
- Borrar `public/woo-api.php`, `src/utils/wooClient.ts` y `StockRefresher.astro`. Se quedan porque pueden usarse pronto, pero no se publican ni se configuran como proxy en esta spec.
- Mostrar precios o stock en el sitio.
- Carga masiva de productos: la hace el equipo de Quality. La guía solo pide un producto de prueba para verificar.
- Ocultar o redirigir el front de WordPress (`tienda.…/shop`, fichas de Woo). Esta spec solo lo marca como `noindex` y desactiva los métodos de pago.
- Huella de producto para evitar redeploys (`data/woo-rebuild/` de ERES). Sin precio ni stock en vivo, no compensa.
- Cloudflare, mu-plugin de AIOSEO y sitio de prueba en el hosting: WordPress está limpio y no usa nada de eso.
- `noindex` del staging de Amplify.

## Modelo de datos

No hay datos nuevos en el sitio. El catálogo sigue usando `WooProduct` (`src/lib/woo/types.ts`) y `DATASHEET_META_KEY = "ficha_tecnica"` (`src/lib/woo/catalog.ts`).

Lo que aparece del lado de WordPress y del servidor:

```php
// Meta del producto (lo escribe quality-product-fields.php)
'ficha_tecnica' => 'https://tienda.qualitysumprintpe.com/wp-content/uploads/2026/11/ficha.pdf'

// Taxonomías que vigila quality-term-rebuild.php
['product_cat', 'product_tag', 'product_brand', 'pa_*']   // pa_segmento…

// WooProduct (src/lib/woo/types.ts) suma el campo nativo de marcas de Woo 9.6+
brands?: { id: number; name: string; slug: string }[]

// public_html/woo-config.php (fuera de git; plantilla woo-config.example.php)
return [
  'store_url'       => 'https://tienda.qualitysumprintpe.com',
  'consumer_key'    => 'ck_…',
  'consumer_secret' => 'cs_…',
  'allowed_origins' => ['https://qualitysumprintpe.com'],
  'cache_ttl'       => [/* sin cambios */],
  'rate_limit'      => 120,
  'webhook_secret'  => '…',                        // el mismo secreto de los webhooks de Woo
  'github_repo'     => 'sagarkishnani/quality-web',
  'github_token'    => 'github_pat_…',             // fine-grained, Contents: read and write, solo este repo
];
```

Evento de `repository_dispatch`:

```json
{ "event_type": "woo-catalog-changed", "client_payload": { "topic": "product.updated", "id": 123 } }
```

Secrets de GitHub (nivel repositorio):

| Secret | Uso |
|---|---|
| `TINA_CLIENT_ID`, `TINA_TOKEN` | Build (ya existen) |
| `WOO_STORE_URL`, `WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET` | Build contra el Woo real |
| `FTP_DEPLOY_PASSWORD` | Contraseña de la cuenta FTP `deploy@qualitysumprintpe.com` (directorio `public_html`) |

El servidor (`ftp.qualitysumprintpe.com`, FTPS, puerto 21) y el usuario van fijos en el workflow, como en `quality` (spec 01): no son sensibles.

Variables de entorno de Amplify (rama `staging`): `WOO_STORE_URL`, `WOO_CONSUMER_KEY` y `WOO_CONSUMER_SECRET` con un par de claves propio. `WOO_SAMPLE_CATALOG` se elimina.

El deploy de producción **nunca** toca:

- `tienda.qualitysumprintpe.com/` (WordPress).
- `.well-known/` y `cgi-bin/` (cPanel y SSL).
- `site-config.php` y `woo-config.php` (secretos).
- `data/` (contador y archivos de runtime).
- `*.example.php` y `woo-api.php`, que no se suben.

`FTP-Deploy-Action` solo borra en el servidor lo que él mismo subió antes (lo registra en `.ftp-deploy-sync-state.json`). Lo que nunca estuvo en `dist/` queda intacto. `public/.htaccess` niega el acceso web a ese archivo de estado.

## Plan de implementación

1. **Guía, primera parte.** Crear `wordpress/README.md` con: cómo encaja todo (tabla de topología), SSL y "Force HTTPS Redirect" del subdominio en cPanel, instalación de WooCommerce, ajustes sin venta (sin métodos de pago, "Disuadir a los motores de búsqueda"), marcas en Productos → Marcas, atributo global `Segmento`, y claves REST de solo lectura (una para producción y otra para Amplify).
2. **Ficha técnica.** Crear `wordpress/mu-plugins/quality-product-fields.php`: una caja en el producto con un botón que abre Medios filtrado a PDF y guarda la URL en `ficha_tecnica`. Valida `http`/`https` al guardar y lo expone en la REST. Agregar a la guía cómo subirlo a `wp-content/mu-plugins/`. Prueba manual: guardar un PDF y verlo en `meta_data` de `/wp-json/wc/v3/products/<id>`.
3. **Endpoint de rebuild.** Adaptar `public/rebuild-hook.php` de ERES: lee `woo-config.php`, verifica `X-WC-Webhook-Signature` con `webhook_secret`, responde `200` al ping de verificación de Woo y dispara `repository_dispatch` sin huella. Agregar las tres claves nuevas a `woo-config.example.php`.
4. **Rebuild por términos.** Crear `wordpress/mu-plugins/quality-term-rebuild.php` a partir de `eres-term-rebuild.php`. Vigila `product_cat`, `product_tag`, `product_brand` y `pa_*`, agrupa los cambios en 60 s y usa la URL y el secreto del primer webhook activo hacia `rebuild-hook.php`.
5. **Workflow de deploy.** Crear `.github/workflows/deploy.yml` con:
   - Disparadores: push a `main`, `repository_dispatch` (`woo-catalog-changed`), cron `0 9 * * *` y `workflow_dispatch`.
   - `concurrency` para no solapar deploys.
   - Pasos: build con los secrets de Woo, `typecheck`, `check:standard`, subida por FTPS con las exclusiones del modelo de datos y prueba de humo (`/`, `/productos`, `/404.html`).
   - Se detiene si `dist/` trae una carpeta llamada `tienda.qualitysumprintpe.com`.
6. **`.htaccess`.** Crear `public/.htaccess` con HTTPS forzado y `ErrorDocument 404 /404.html`.
7. **Guía, segunda parte.** Agregar a `wordpress/README.md`:
   - Token de GitHub y `woo-config.php` en el servidor.
   - Webhooks de producto (`created`, `updated`, `deleted`, `restored`, todos con el mismo secreto).
   - Secrets de GitHub y variables de Amplify.
   - Verificación de punta a punta: editar el producto de prueba → ver el run en Actions → ver el cambio en el sitio.
8. **Documentación del repo.** Actualizar la sección **Catálogo de WooCommerce** de `CLAUDE.md` (topología, rebuild, mu-plugins, secretos, exclusiones del deploy) y agregar "Despliegue" al `README.md`.
9. **Marca nativa.** Agregar `brands` a `WooProduct` y hacer que `toCatalogItem` (`src/lib/woo/catalog.ts`) tome la marca de ahí, con el atributo de `brandAttribute` como respaldo. Sumar `product_brand` a `quality-term-rebuild.php` y ajustar la guía y `CLAUDE.md`.

## Criterios de aceptación

- [ ] `https://tienda.qualitysumprintpe.com` redirige de `http` a `https`.
- [ ] `GET /wp-json/wc/v3/products` con las claves de producción responde `200`. Un `POST` con esas claves responde `401` o `403`.
- [ ] Elegir un PDF en "Ficha técnica (PDF)" guarda su URL en `ficha_tecnica`, y la ficha del sitio muestra "Descargar ficha técnica" tras el rebuild.
- [ ] Un `POST` a `rebuild-hook.php` sin firma o con una firma inválida responde `401` y no dispara ningún workflow.
- [ ] Editar un producto en Woo dispara `deploy.yml` por `repository_dispatch` en menos de 2 minutos.
- [ ] Un producto con marca en Productos → Marcas la muestra en su tarjeta y en el filtro de marca del catálogo.
- [ ] Renombrar una marca dispara un solo deploy, aunque se editen varios términos dentro de 60 s.
- [ ] El build de `deploy.yml` no lleva `<meta name="x-sample-catalog">` y `check:standard` pasa sin errores.
- [ ] Tras un deploy, `https://tienda.qualitysumprintpe.com/wp-admin/` sigue funcionando, y `woo-config.php`, `site-config.php` y `data/` siguen en el servidor.
- [ ] `https://qualitysumprintpe.com/no-existe` responde `404` con la página de Astro.
- [ ] El build de Amplify en `staging` muestra el producto de prueba del Woo real.
- [ ] Ningún archivo de `dist/` contiene `WOO_CONSUMER_KEY`, `WOO_CONSUMER_SECRET` ni un `ck_`/`cs_` real.

## Decisiones

- **Sí:** WordPress en el subdominio `tienda.`, con su propia carpeta. Sin checkout, compartir raíz con Astro solo agrega complejidad (`htaccess-astro.conf`, lista de rutas protegidas).
- **No:** raíz compartida como en ERES.
- **Sí:** FTPS con `SamKirkland/FTP-Deploy-Action`, como en `quality` (spec 01). El plan `CorporativoEspecial_2025_CP` no trae SSH: cPanel no muestra "Acceso SSH" ni "Terminal", y los puertos 22 y 2222 están cerrados (2026-11-13).
- **No:** SSH + rsync. Era la primera opción; se retoma si el hosting habilita SSH.
- **Sí:** rebuild completo: webhooks de producto + términos + cron diario, igual que ERES.
- **No:** huella de producto. Su razón en ERES era no redesplegar por stock o ventas, y aquí eso no se muestra.
- **Sí:** la marca sale de la taxonomía nativa **Marcas** (`product_brand`), no de un atributo. WooCommerce ya trae ese menú y duplicarlo como atributo confunde a quien carga productos. Cambio acordado durante la configuración (2026-11-13).
- **Sí:** el atributo de `shop.catalog.brandAttribute` queda como respaldo cuando un producto no tiene marca nativa. Así el catálogo de muestra sigue funcionando y no hay que tocar el schema de Tina.
- **No:** atributo global `Marca`. Lo reemplaza la taxonomía nativa.
- **Sí:** `Segmento` sigue siendo atributo global. WooCommerce no tiene una taxonomía nativa para eso, y las categorías ya cumplen otra función.
- **Sí:** el rebuild por términos vigila `product_cat`, `product_tag`, `product_brand` y `pa_*`. La etiqueta pinta la insignia de la tarjeta.
- **Sí:** `woo-api.php`, `wooClient.ts` y `StockRefresher.astro` se quedan, porque pueden usarse pronto.
- **Sí:** staging de Amplify contra el Woo real, con claves propias. Muestra lo mismo que se publicará, y una clave revocada no tumba ambos ambientes.
- **No:** catálogo de muestra en staging.
- **Sí:** `WOO_SAMPLE_CATALOG` se queda para desarrollo local.
- **Sí:** publica `main`, como dice `CLAUDE.md`. El primer deploy es el lanzamiento: el dominio está vacío y no hace falta un plan de pase ni de reversa.
- **Sí:** HTTPS forzado en ambos dominios. Las claves viajan en Basic Auth.
- **Nota:** definición rápida. El usuario confirmó la cabecera y la topología y pidió asumir el resto, sin revisar las demás secciones una por una.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El deploy borra WordPress, que vive dentro de `public_html` | `FTP-Deploy-Action` solo borra lo que subió antes, y WordPress nunca estuvo en `dist/`. El workflow se detiene si `dist/` trae ese nombre. El criterio de aceptación lo comprueba tras el primer deploy. |
| Se pierde o se corrompe `.ftp-deploy-sync-state.json` | El siguiente deploy sube todo de nuevo y no borra nada. Los archivos que ya no existen quedan huérfanos hasta que se borran a mano. |
| `public_html` tiene contenido previo | Se revisa en el Administrador de archivos antes del primer deploy. Ningún archivo previo se borra, pero uno con el mismo nombre que un archivo de `dist/` se pisa. |
| Woo vacío o caído al compilar: el sitio se publica sin productos | El cron y el siguiente webhook lo reponen. La guía pide cargar el producto de prueba antes del primer deploy. |
| El front de Woo en `tienda.` queda accesible y alguien intenta comprar | Sin métodos de pago y con `noindex`. Ocultarlo del todo va en otra spec. |
| El token de GitHub vence | Fine-grained con vencimiento anotado en la guía. Mientras tanto, el cron diario sigue publicando. |

## Lo que **no** entra en esta spec

- Carrito, checkout, pagos y todo el flujo de venta de ERES.
- Borrar el proxy `woo-api.php` y su cliente.
- Precios y stock en el sitio.
- Carga masiva de productos.
- Ocultar el front de WordPress.
- Cloudflare, AIOSEO y sitio de prueba en el hosting.

Cada uno de esos puntos, si llega, va en su propia spec.
