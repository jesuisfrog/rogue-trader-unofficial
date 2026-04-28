/**
 * rogue-trader-unofficial | handlebars.js
 * Register all Handlebars helpers used by sheet templates.
 */

export function registerHandlebarsHelpers() {

  // ── Basic comparison helpers ───────────────────────────────────────────────

  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("neq", (a, b) => a !== b);
  Handlebars.registerHelper("lt", (a, b) => a < b);
  Handlebars.registerHelper("lte", (a, b) => a <= b);
  Handlebars.registerHelper("gt", (a, b) => a > b);
  Handlebars.registerHelper("gte", (a, b) => a >= b);

  // ── Math helpers ───────────────────────────────────────────────────────────

  Handlebars.registerHelper("add", (a, b) => Number(a) + Number(b));
  Handlebars.registerHelper("sub", (a, b) => Number(a) - Number(b));

  // ── Characteristic helpers ─────────────────────────────────────────────────

  /**
   * Returns the effective value of a characteristic (base + advances + modifier).
   * Each "advance" represents one purchase of +5; modifier is free-form.
   */
  Handlebars.registerHelper("charValue", (char) => {
    if (!char) return 0;
    return (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
  });

  /**
   * Returns the Characteristic Bonus (tens digit of effective value).
   */
  Handlebars.registerHelper("charBonus", (char) => {
    if (!char) return 0;
    const val = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
    return Math.floor(val / 10);
  });

  // ── Degree helpers ─────────────────────────────────────────────────────────

  /**
   * Returns descriptive text for insanity bracket.
   * Thresholds per rules: 0-9 Unsettled, 10-20 Troubled, 21-40 Disturbed,
   * 41-60 Neurotic, 61-80 Deranged, 81+ Unhinged.
   */
  Handlebars.registerHelper("insanityBracket", (ip) => {
    if (ip <= 9) return "Unsettled";
    if (ip <= 20) return "Troubled";
    if (ip <= 40) return "Disturbed";
    if (ip <= 60) return "Neurotic";
    if (ip <= 80) return "Deranged";
    return "Unhinged";
  });

  /**
   * Returns descriptive text for corruption bracket.
   */
  Handlebars.registerHelper("corruptionBracket", (cp) => {
    if (cp <= 30) return "Tainted";
    if (cp <= 60) return "Soiled";
    if (cp <= 90) return "Debased";
    if (cp <= 99) return "Profane";
    return "Damned";
  });

  // ── Localize with fallback ──────────────────────────────────────────────────

  Handlebars.registerHelper("loc", (key) => game.i18n.localize(key));

  // ── Math helpers used by chat cards and dialogs ────────────────────────────

  Handlebars.registerHelper("absVal", (n) => Math.abs(Number(n)));
  Handlebars.registerHelper("negate", (n) => -Number(n));
  Handlebars.registerHelper("multiply", (a, b) => Number(a) * Number(b));
  Handlebars.registerHelper("subtract", (a, b) => Number(a) - Number(b));

  // ── Voidship helpers ──────────────────────────────────────────────────────

  /** Capitalize first letter */
  Handlebars.registerHelper("capitalize", (s) =>
    typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s
  );

  /** Math: min of two values (used in budget bars) */
  Handlebars.registerHelper("min", (a, b) => Math.min(Number(a), Number(b)));

  /** Math: divide (used in budget bar width %) */
  Handlebars.registerHelper("divide", (a, b) => (b === 0 ? 0 : Number(a) / Number(b)));

  /** Zero-indexed range array, e.g. {{#each (range 5)}} gives 0,1,2,3,4 */
  Handlebars.registerHelper("range", (n) => Array.from({ length: Number(n) }, (_, i) => i));

  /** Absolute value of a negative number, for displaying DoF as positive. */
  Handlebars.registerHelper("absVal", (n) => Math.abs(Number(n)));

  // ── Select option helper ───────────────────────────────────────────────────

  Handlebars.registerHelper("selectOptionsRT", (choices, selected) => {
    let html = "";
    for (const [value, label] of Object.entries(choices)) {
      const sel = value === selected ? " selected" : "";
      html += `<option value="${value}"${sel}>${label}</option>`;
    }
    return new Handlebars.SafeString(html);
  });

  // ── Skill level label ──────────────────────────────────────────────────────

  Handlebars.registerHelper("skillLevelLabel", (level) => {
    const labels = { 0: "◆", 1: "+10", 2: "+20" };
    return labels[level] ?? "◆";
  });

  // ── Fate point pips ────────────────────────────────────────────────────────

  Handlebars.registerHelper("fatePointPips", (current, max) => {
    let html = "";
    for (let i = 0; i < max; i++) {
      const cls = i < current ? "fate-pip filled" : "fate-pip";
      html += `<span class="${cls}" data-index="${i}">✦</span>`;
    }
    return new Handlebars.SafeString(html);
  });
}
