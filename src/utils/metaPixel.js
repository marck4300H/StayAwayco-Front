/**
 * metaPixel.js — Utilidad centralizada para eventos del Pixel de Meta
 * ID: 1270248191863856
 */

/**
 * Dispara PageView manual — útil para rastrear navegación SPA.
 */
export const trackPageView = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

/**
 * Dispara el evento Purchase de Meta Pixel.
 *
 * @param {Object} params
 * @param {number} params.value         - Valor total en COP
 * @param {string} params.currency      - Siempre "COP"
 * @param {string} params.content_name  - Nombre de la rifa
 * @param {number} params.num_items     - Cantidad de boletos
 * @param {string} [params.content_ids] - ID de la rifa (opcional)
 */
export const trackPurchase = ({ value, currency = "COP", content_name, num_items, content_ids }) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: value,
      currency: currency,
      content_name: content_name,
      content_type: "product",
      num_items: num_items,
      ...(content_ids ? { content_ids: [content_ids] } : {}),
    });
  }
};