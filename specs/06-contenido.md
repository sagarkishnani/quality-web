# SPEC 06 — Contenido y QA final

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03, SPEC 04, SPEC 05
> **Fecha:** 2026-11-01
> **Objetivo:** Validar las 8 pantallas a 1440 px contra la referencia y corregir los errores claros antes de publicar.

## Alcance

**Entra:**

- QA a 1440 px de Inicio, Nosotros, Productos, Detalle de producto, Servicios, Detalle de servicio, Medioambiente y Contacto.
- Corrección de errores claros: desbordes, enlaces rotos, y textos o imágenes equivocados.
- Lista de diferencias de diseño en el PR, para que decida Sagar.
- Pasar a "Implementado" la hoja de ruta de esta spec y registrar las diferencias aceptadas.

**No entra:**

- Cambiar `order` de los servicios: el bento conserva el orden de `/servicios`.
- Quitar `15038` de la dirección del footer: `contact.address` es un solo dato.
- URLs de redes sociales: quedan como dato pendiente del cliente y se cargan desde Tina.
- Acortar el resumen de Mantenimiento preventivo en el bento: `summary` también se usa en `/servicios`.
- Campos nuevos en Tina.
- Igualar diferencias de diseño: lo nuevo se queda.
- Mobile: no hay referencia.

## Modelo de datos

Esta spec no agrega ni cambia estructuras de datos. Reutiliza las colecciones de las specs anteriores.

## Plan de implementación

1. **Rama.** Basar `feat/spec-06-contenido` en `feat/spec-05-medioambiente`. Tras el merge del PR #6, actualizarla con `staging`, y solo entonces abrir el PR.
2. **Comparación.** Levantar `npm run dev` con `WOO_SAMPLE_CATALOG=true`. Tomar capturas a 1440 px de las 8 pantallas, en el sitio y en la referencia.
3. **Revisión funcional.** Recorrer en cada pantalla los enlaces internos, las imágenes y la consola. Probar a 1440 px el megamenú, los filtros, la galería, el explorador de servicios y el formulario.
4. **Clasificación.** Separar cada hallazgo en error claro o diferencia de diseño. Un error claro es un desborde, un enlace roto, o un texto o una imagen equivocados.
5. **Correcciones.** Corregir los errores claros, con un commit `fix` por pantalla.
6. **Registro.** Anotar en `specs/06-contenido.md` los hallazgos, las correcciones y las diferencias de diseño, y copiar estas últimas en la descripción del PR.
7. **Cierre.** Ejecutar `npm run typecheck`, `astro build` contra el servidor local de Tina y `npm run check:standard` sin catálogo de muestra. Repetir la comprobación de las pantallas corregidas.

## Criterios de aceptación

**Comparación**

- [ ] Hay capturas a 1440 px del sitio y de la referencia para las 8 pantallas.
- [ ] Cada diferencia encontrada figura en esta spec como corregida o como diferencia de diseño.

**Funcionamiento a 1440 px**

- [ ] Ninguna de las 8 pantallas tiene scroll horizontal.
- [ ] Ningún enlace interno de las 8 pantallas, el header o el footer responde 404.
- [ ] Ninguna imagen de las 8 pantallas falla al cargar.
- [ ] Ninguna de las 8 pantallas registra errores en la consola, salvo los del captcha o el backend simulados.
- [ ] El megamenú de Servicios y el de Productos abren y sus enlaces llevan a páginas existentes.
- [ ] Los filtros de `/productos` cambian los productos listados.
- [ ] La galería de la ficha cambia la imagen principal.
- [ ] El explorador de servicios cambia el servicio mostrado.
- [ ] "Ver cotización" lleva a `/contacto` con el campo `requerimiento` precargado.

**Decisiones de contenido**

- [ ] `order` de los 7 servicios, `contact.address` y `summary` no cambian.
- [ ] El footer no muestra iconos de redes mientras sus URLs estén vacías.
- [ ] El schema de Tina no tiene campos nuevos.

**Cierre**

- [ ] `npm run typecheck` termina sin errores.
- [ ] `npm run build:local` termina sin errores.
- [ ] `npm run check:standard` da 0 errores con un build sin catálogo de muestra.
- [ ] La descripción del PR lista las diferencias de diseño para Sagar.
- [ ] La descripción del PR indica que las URLs de redes siguen pendientes.

## Decisiones

- **Sí:** el bento conserva el orden de `/servicios`. La referencia usa dos órdenes, y `order` es un solo campo. Así coinciden `/servicios` y el megamenú, y solo se invierten dos tarjetas pequeñas del bento.
- **No:** intercambiar `order`, aunque la hoja de ruta lo pedía. Igualaba el bento, pero desigualaba `/servicios` y el megamenú.
- **No:** un orden propio del bento. Suma schema a una spec de contenido.
- **Sí:** el footer conserva `15038`. La dirección es correcta y es la misma en todo el sitio.
- **No:** quitar `15038` de `contact.address`. Desigualaría `/contacto` y perdería el código postal.
- **No:** un campo de dirección propio del footer. Obliga a mantener el dato en dos lugares.
- **Sí:** el bento conserva el `summary` completo de Mantenimiento preventivo. La referencia lo acorta solo ahí, y el campo también alimenta `/servicios`.
- **Sí:** cerrar la spec sin las URLs de redes. El footer oculta las redes sin URL, y las URLs se cargan desde Tina sin tocar código.
- **No:** esperar las URLs. Bloquearía el cierre por un dato que no cambia el código.
- **Sí:** corregir solo errores claros y listar las diferencias de diseño para Sagar. Respeta la regla de que lo nuevo se queda.
- **No:** igualar todo a la referencia. Es el mayor alcance y deshace decisiones aprobadas.
- **No:** limitar la spec a un informe. Dejaría errores claros abiertos antes de publicar.
- **Sí:** los textos no cambian. La comparación del 2026-11-01 encontró los textos del sitio en la referencia, y las únicas diferencias de contenido son las decididas aquí.
- **Sí:** empezar sobre `feat/spec-05-medioambiente`, sin esperar el merge del PR #6. Es una excepción a salir de `staging`, decidida por Esteban el 2026-11-01. Si Sagar pide cambios en el PR #6, se repite el QA de Medioambiente.
- **Sí:** QA de Productos y Detalle de producto con catálogo de muestra, porque WooCommerce aún no existe.
- **Sí:** cierre con `npm run build:local`, porque `npm run build` requiere credenciales de TinaCloud.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| La comparación de textos comprobó que cada texto existe, no que esté en su lugar. | Revisar los textos pantalla por pantalla en las capturas del paso 2. |
| El catálogo de muestra oculta errores de datos reales de WooCommerce. | Repetir el QA de Productos y Detalle de producto cuando exista la tienda. Queda fuera de esta spec. |
| `npm run build` puede fallar con TinaCloud aunque pase `build:local`. | Avisarlo en el PR. Sagar debe ejecutarlo antes de publicar. |
| Un error clasificado como claro puede ser una decisión de diseño aprobada. | Revisar antes "Decisiones" de las specs 01 a 05. En caso de duda, va a la lista para Sagar. |

## Qué no entra en esta spec

- Cambios de `order`, de `contact.address` y de `summary`.
- URLs de redes sociales.
- Campos nuevos en Tina.
- Igualar diferencias de diseño con la referencia.
- Mobile.
- QA con datos reales de WooCommerce.

Si alguno de estos entra, va en su propia spec.
