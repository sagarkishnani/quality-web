<?php
// Se sube como woo-config.php en la raíz pública, junto a rebuild-hook.php, fuera del repo y de dist/. Nunca con valores reales en git.
return [
  // URL base del WordPress, sin barra final. Debe ser https: las claves viajan en Basic Auth.
  'store_url'       => 'https://tienda.qualitysumprintpe.com',

  // Claves de la API REST de WooCommerce con permiso de SOLO LECTURA.
  'consumer_key'    => 'ck_CHANGE-ME',
  'consumer_secret' => 'cs_CHANGE-ME',

  // Orígenes autorizados a llamar al proxy. Vacío = cualquiera (no recomendado en producción).
  'allowed_origins' => [
    'https://qualitysumprintpe.com',
    'http://localhost:4321',
  ],

  // Segundos de caché en disco por tipo de respuesta.
  'cache_ttl'       => [
    'products'   => 300,
    'product'    => 300,
    'categories' => 900,
    'stock'      => 15,
  ],

  // Máximo de peticiones por IP y por minuto.
  'rate_limit'      => 120,

  // Secreto compartido con los webhooks de producto de WooCommerce (openssl rand -hex 32).
  'webhook_secret'  => 'CHANGE-ME',

  // Repo que recibe el repository_dispatch de rebuild-hook.php.
  'github_repo'     => 'sagarkishnani/quality-web',

  // Fine-grained token con Contents: Read and write, solo sobre github_repo.
  'github_token'    => 'github_pat_CHANGE-ME',
];
