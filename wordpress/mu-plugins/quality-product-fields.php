<?php
/**
 * Plugin Name: Quality · Ficha técnica del producto
 * Description: Agrega "Ficha técnica (PDF)" a la edición del producto. Elige un PDF de Medios y guarda su URL en el meta ficha_tecnica, que el sitio en Astro lee de meta_data en la API REST.
 * Version: 1.0.0
 * Requires PHP: 8.0
 */

defined('ABSPATH') || exit;

const QUALITY_DATASHEET_META_KEY = 'ficha_tecnica';
const QUALITY_DATASHEET_ALLOWED_PROTOCOLS = ['http', 'https'];

add_action('woocommerce_product_options_general_product_data', 'quality_datasheet_render');
add_action('woocommerce_admin_process_product_object', 'quality_datasheet_save');
add_action('admin_enqueue_scripts', 'quality_datasheet_enqueue');

function quality_datasheet_render(): void
{
    global $product_object;
    $url = $product_object instanceof WC_Product ? (string)$product_object->get_meta(QUALITY_DATASHEET_META_KEY) : '';

    echo '<div class="options_group">';
    woocommerce_wp_text_input([
        'id' => QUALITY_DATASHEET_META_KEY,
        'label' => 'Ficha técnica (PDF)',
        'value' => $url,
        'type' => 'url',
        'placeholder' => 'https://…/ficha.pdf',
        'description' => 'Elige un PDF de Medios. El botón "Descargar ficha técnica" aparece en el sitio tras el rebuild.',
        'desc_tip' => true,
    ]);
    echo '<p class="form-field"><label></label>';
    echo '<button type="button" class="button" data-quality-datasheet-pick>Elegir PDF</button> ';
    echo '<button type="button" class="button-link-delete" data-quality-datasheet-clear>Quitar</button>';
    echo '</p></div>';
}

// Se escribe sobre el objeto antes de su save(): así el webhook product.updated ya lleva el valor nuevo.
function quality_datasheet_save(WC_Product $product): void
{
    if (!isset($_POST[QUALITY_DATASHEET_META_KEY])) {
        return;
    }

    $url = esc_url_raw(trim(wp_unslash($_POST[QUALITY_DATASHEET_META_KEY])), QUALITY_DATASHEET_ALLOWED_PROTOCOLS);
    if ($url === '') {
        $product->delete_meta_data(QUALITY_DATASHEET_META_KEY);
        return;
    }

    $product->update_meta_data(QUALITY_DATASHEET_META_KEY, $url);
}

function quality_datasheet_enqueue(string $hook): void
{
    $screen = get_current_screen();
    if (!in_array($hook, ['post.php', 'post-new.php'], true) || $screen?->post_type !== 'product') {
        return;
    }

    wp_enqueue_media();
    wp_add_inline_script('media-editor', quality_datasheet_script());
}

function quality_datasheet_script(): string
{
    $fieldId = QUALITY_DATASHEET_META_KEY;

    return <<<JS
document.addEventListener('click', (event) => {
  const input = document.getElementById('{$fieldId}');
  if (!input) return;

  if (event.target.closest('[data-quality-datasheet-clear]')) {
    input.value = '';
    return;
  }

  if (!event.target.closest('[data-quality-datasheet-pick]')) return;

  const frame = wp.media({
    title: 'Ficha técnica (PDF)',
    button: { text: 'Usar este PDF' },
    library: { type: 'application/pdf' },
    multiple: false,
  });
  frame.on('select', () => {
    input.value = frame.state().get('selection').first().get('url');
  });
  frame.open();
});
JS;
}
