import { describe, it, expect } from "vitest";
import { sanitizeText, sanitizeRichHtml } from "./sanitizeInput";

describe("sanitizeInput", () => {
  it("sanitizeText should remove all HTML tags", () => {
    const dirty = "<b>Bonjour</b><script>alert('x')</script>";
    const clean = sanitizeText(dirty);
    expect(clean).toBe("Bonjour");
  });

  it("sanitizeRichHtml should keep allowed tags", () => {
    const dirty = "<p>Texte <b>gras</b> <script>hack()</script></p>";
    const clean = sanitizeRichHtml(dirty);
    expect(clean).toBe("<p>Texte <b>gras</b> </p>");
  });

  it("sanitizeRichHtml should keep links but strip dangerous ones", () => {
    const dirty = `
      <a href="https://safe.com">OK</a>
      <a href="javascript:alert('xss')">BAD</a>
    `;
    const clean = sanitizeRichHtml(dirty);
    expect(clean).toContain('href="https://safe.com"');
    expect(clean).not.toContain("javascript:");
  });
});
