import sanitizeHtml from "sanitize-html";

/**
 * Nettoie une chaîne de texte en supprimant toute balise HTML ou attribut dangereux.
 * À utiliser pour les sujets, adresses email, textes simples, etc.
 */
export function sanitizeText(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

/**
 * Nettoie un contenu HTML tout en autorisant une mise en forme basique.
 * À utiliser uniquement si tu veux envoyer des emails HTML enrichis.
 */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "p", "a", "br", "ul", "li", "ol"],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  }).trim();
}
