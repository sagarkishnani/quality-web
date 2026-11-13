<?php
/**
 * Plugin Name: Quality · Rebuild al editar marcas, categorías, etiquetas y atributos
 * Description: Avisa a rebuild-hook.php del sitio Astro cuando se crea, edita o borra una marca, una categoría, una etiqueta o un término de atributo (Segmento…), porque WooCommerce no tiene webhooks para esos términos. Usa la URL y el secreto del primer webhook activo que apunte a rebuild-hook.php (sin ninguno = sin aviso).
 * Version: 1.1.0
 * Requires PHP: 8.0
 */

defined('ABSPATH') || exit;

const QUALITY_TERM_REBUILD_TAXONOMIES = ['product_cat', 'product_tag', 'product_brand'];
const QUALITY_TERM_REBUILD_ATTRIBUTE_PREFIX = 'pa_';
const QUALITY_TERM_REBUILD_TOPIC = 'product_term.updated';
const QUALITY_TERM_REBUILD_HOOK_PATH = '/rebuild-hook.php';
const QUALITY_TERM_REBUILD_ACTION = 'quality_term_rebuild_deliver';
const QUALITY_TERM_REBUILD_GROUP = 'quality-term-rebuild';
// Agrupa en un solo deploy los cambios seguidos (renombrar varias marcas, borrar en lote).
const QUALITY_TERM_REBUILD_DELAY_SECONDS = 60;

foreach (['created_term', 'edited_term', 'delete_term'] as $termEvent) {
    add_action($termEvent, 'quality_term_rebuild_schedule', 10, 3);
}
add_action(QUALITY_TERM_REBUILD_ACTION, 'quality_term_rebuild_deliver');

function quality_term_rebuild_watches(string $taxonomy): bool
{
    return in_array($taxonomy, QUALITY_TERM_REBUILD_TAXONOMIES, true)
        || str_starts_with($taxonomy, QUALITY_TERM_REBUILD_ATTRIBUTE_PREFIX);
}

function quality_term_rebuild_schedule(int $termId, int $termTaxonomyId, string $taxonomy): void
{
    if (!quality_term_rebuild_watches($taxonomy)) {
        return;
    }
    if (!function_exists('as_schedule_single_action') || quality_term_rebuild_webhook() === null) {
        return;
    }
    if (as_has_scheduled_action(QUALITY_TERM_REBUILD_ACTION, [], QUALITY_TERM_REBUILD_GROUP)) {
        return;
    }

    as_schedule_single_action(time() + QUALITY_TERM_REBUILD_DELAY_SECONDS, QUALITY_TERM_REBUILD_ACTION, [], QUALITY_TERM_REBUILD_GROUP);
}

function quality_term_rebuild_deliver(): void
{
    $webhook = quality_term_rebuild_webhook();
    if ($webhook === null) {
        throw new RuntimeException('No hay un webhook activo hacia ' . QUALITY_TERM_REBUILD_HOOK_PATH);
    }

    $body = (string)wp_json_encode(['topic' => QUALITY_TERM_REBUILD_TOPIC]);
    $response = wp_remote_post($webhook->get_delivery_url(), [
        'timeout' => 20,
        'body'    => $body,
        'headers' => [
            'Content-Type'           => 'application/json',
            'X-WC-Webhook-Topic'     => QUALITY_TERM_REBUILD_TOPIC,
            'X-WC-Webhook-Signature' => base64_encode(hash_hmac('sha256', $body, $webhook->get_secret(), true)),
        ],
    ]);

    $status = is_wp_error($response) ? $response->get_error_message() : wp_remote_retrieve_response_code($response);
    if ($status !== 200) {
        throw new RuntimeException("rebuild-hook.php respondió: $status");
    }
}

function quality_term_rebuild_webhook(): ?WC_Webhook
{
    if (!class_exists('WC_Data_Store')) {
        return null;
    }

    $webhookIds = WC_Data_Store::load('webhook')->search_webhooks(['status' => 'active', 'limit' => -1]);
    foreach ($webhookIds as $webhookId) {
        $webhook = wc_get_webhook($webhookId);
        $path = (string)wp_parse_url($webhook?->get_delivery_url() ?? '', PHP_URL_PATH);
        if ($webhook !== null && $webhook->get_secret() !== '' && str_ends_with($path, QUALITY_TERM_REBUILD_HOOK_PATH)) {
            return $webhook;
        }
    }

    return null;
}
