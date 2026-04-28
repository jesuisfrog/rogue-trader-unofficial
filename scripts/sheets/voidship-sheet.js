/**
 * rogue-trader-unofficial | voidship-sheet.js
 *
 * Sheet for the Voidship actor type.
 *
 * VOID COMBAT MECHANICS (RT Core pp.210–221)
 *
 * Ships roll d100 equal-or-under a characteristic — same base resolution
 * as personal combat. Voidship-specific tests:
 *
 *   Ballistic Skill (crew rating as %)   — firing weapons
 *   Pilot (Space Craft) + Manoeuvrability — manoeuvre actions
 *   Scrutiny + Detection                 — augury / sensor tests
 *   Tech-Use (crew rating %)             — emergency repairs, flank speed
 *   Command (crew rating %)              — boarding actions
 *
 * MACROBATTERY FIRING
 *   - Roll BS test (crew rating + modifiers)
 *   - Hits = 1 (base) + 1 per DoS, capped at weapon Strength
 *   - Void Shields cancel hits equal to their rating (overloads after)
 *   - Each remaining hit rolls weapon Damage; sum vs target Armour
 *   - Excess damage = Hull Integrity loss
 *
 * LANCE FIRING
 *   - Roll BS test same as macro
 *   - Hits = 1 + 1 per 3 DoS
 *   - Each hit ignores Armour, deals damage directly to Hull Integrity
 *   - Damage from multiple lance hits is NOT combined
 *
 * CRITICAL HITS
 *   - Triggered when DoS equals weapon's Crit Rating
 *   - Also when a crippled ship (HI 0) takes any damage past its Armour
 *   - Roll 1d5 on Critical Hit table
 *
 * HULL INTEGRITY DAMAGE
 *   - Each HI lost = –1 Crew Population, –1 Morale
 *
 * CREW RATINGS → Skill %
 *   Incompetent 20 / Competent 30 / Crack 40 / Veteran 50 / Elite 60
 */

import { rollCharacteristicTest, sendTestToChat, promptModifier } from "../rolls/characteristic-roll.js";
import { openXPDialog } from "../rolls/xp-dialog.js";

const SYSTEM_ID = "rogue-trader-unofficial";

const CREW_RATING_VALUES = {
  incompetent: 20,
  competent: 30,
  crack: 40,
  veteran: 50,
  elite: 60,
};

// Weapon location labels
const WEAPON_ARCS = {
  prow: "Prow",
  dorsal: "Dorsal",
  port: "Port",
  starboard: "Starboard",
  keel: "Keel",
  aft: "Aft",
};

export class RogueTraderVoidshipSheet extends foundry.appv1.sheets.ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rogue-trader", "sheet", "actor", "voidship"],
      template: `systems/${SYSTEM_ID}/templates/actors/voidship-sheet.hbs`,
      width: 860,
      height: 740,
      resizable: true,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "overview",
      }],
      scrollY: [".sheet-body"],
    });
  }

  // ---------------------------------------------------------------------------
  // Data preparation
  // ---------------------------------------------------------------------------

  getData() {
    const ctx = super.getData();
    const sys = this.actor.system;

    // Crew rating numeric value
    const crewRating = CREW_RATING_VALUES[sys.crew?.rating] ?? 30;
    ctx.crewRatingValue = crewRating;

    // Power budget
    const components = sys.components ?? {};
    const powerUsed = this._sumComponentPower(components, sys.supplementalComponents ?? []);
    const powerGen = sys.hull?.powerCurrent ?? 0;
    ctx.powerUsed = powerUsed;
    ctx.powerFree = powerGen - powerUsed;
    ctx.powerOverload = ctx.powerFree < 0;

    // Space budget
    const spaceUsed = this._sumComponentSpace(components, sys.supplementalComponents ?? []);
    ctx.spaceUsed = spaceUsed;
    ctx.spaceFree = (sys.hull?.spaceTotal ?? 40) - spaceUsed;

    // Weapon arcs as list for template iteration
    ctx.weaponArcs = Object.entries(WEAPON_ARCS).map(([key, label]) => ({
      key,
      label,
      weapons: sys.weapons?.[key] ?? [],
    })).filter(arc => arc.weapons.length > 0 || true); // always show all arcs

    // Flatten all weapons for the quick-fire tab
    ctx.allWeapons = Object.entries(WEAPON_ARCS).flatMap(([arc, arcLabel]) =>
      (sys.weapons?.[arc] ?? []).map((w, i) => ({ ...w, arc, arcLabel, index: i }))
    );

    // Hull percentage for the integrity bar
    const hiMax = sys.hull?.integrity?.max ?? 1;
    const hiVal = sys.hull?.integrity?.value ?? hiMax;
    ctx.integrityPct = Math.round((hiVal / hiMax) * 100);
    ctx.isCrippled = hiVal <= 0;

    // Morale / crew pct bars
    const popMax = sys.crew?.population?.max ?? 100;
    const popVal = sys.crew?.population?.value ?? popMax;
    ctx.popPct = Math.round((popVal / popMax) * 100);
    const morMax = sys.crew?.morale?.max ?? 100;
    const morVal = sys.crew?.morale?.value ?? morMax;
    ctx.moralePct = Math.round((morVal / morMax) * 100);

    // Supplemental components for display
    ctx.supplementalComponents = sys.supplementalComponents ?? [];

    // Crew rating options
    ctx.crewRatingOptions = Object.entries(CREW_RATING_VALUES).map(([key, val]) => ({
      value: key,
      label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${val}%)`,
      selected: key === sys.crew?.rating,
    }));

    // Hull types
    ctx.hullTypes = [
      { value: "transport", label: "Transport" },
      { value: "raider", label: "Raider" },
      { value: "frigate", label: "Frigate" },
      { value: "lightCruiser", label: "Light Cruiser" },
      { value: "cruiser", label: "Cruiser" },
    ];

    ctx.system = sys;
    return ctx;
  }

  _sumComponentPower(essential, supplemental) {
    let total = 0;
    for (const comp of Object.values(essential)) {
      total += Number(comp.power) || 0;
    }
    for (const comp of supplemental) {
      total += Number(comp.power) || 0;
    }
    return total;
  }

  _sumComponentSpace(essential, supplemental) {
    let total = 0;
    for (const comp of Object.values(essential)) {
      total += Number(comp.space) || 0;
    }
    for (const comp of supplemental) {
      total += Number(comp.space) || 0;
    }
    return total;
  }

  // ---------------------------------------------------------------------------
  // Listeners
  // ---------------------------------------------------------------------------

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // ── Void combat rolls ────────────────────────────────────────────────────
    html.find("[data-action='roll-bs']").on("click", () => this._onRollBS());
    html.find("[data-action='roll-pilot']").on("click", () => this._onRollPilot());
    html.find("[data-action='roll-augury']").on("click", () => this._onRollAugury());
    html.find("[data-action='roll-tech']").on("click", () => this._onRollTechUse());
    html.find("[data-action='roll-command']").on("click", () => this._onRollCommand());
    html.find(".weapon-fire-btn").on("click", this._onFireWeapon.bind(this));

    // ── Resource controls ────────────────────────────────────────────────────
    html.find(".resource-control").on("click", this._onResourceControl.bind(this));

    // ── Supplemental components ──────────────────────────────────────────────
    html.find("[data-action='add-component']").on("click", this._onAddComponent.bind(this));
    html.find("[data-action='remove-component']").on("click", this._onRemoveComponent.bind(this));

    // ── Weapon management ────────────────────────────────────────────────────
    html.find("[data-action='add-weapon']").on("click", this._onAddWeapon.bind(this));
    html.find("[data-action='remove-weapon']").on("click", this._onRemoveWeapon.bind(this));

    // ── Inline editing (components / weapons) ────────────────────────────────
    html.find(".component-input").on("change", this._onComponentEdit.bind(this));
    html.find(".weapon-input").on("change", this._onWeaponEdit.bind(this));

    // ── Fate / void shields pips ─────────────────────────────────────────────
    html.find(".void-shield-pip").on("click", this._onShieldPipClick.bind(this));
  }

  // ---------------------------------------------------------------------------
  // Void combat roll handlers
  // ---------------------------------------------------------------------------

  async _onRollBS(extraLabel = "") {
    const crewVal = CREW_RATING_VALUES[this.actor.system.crew?.rating] ?? 30;
    const label = extraLabel || "Ballistic Skill (Firing)";
    const mod = await promptModifier(`${label} Test`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(crewVal, mod);
    await sendTestToChat(this.actor, label, result);
  }

  async _onRollPilot() {
    const sys = this.actor.system;
    const crew = CREW_RATING_VALUES[sys.crew?.rating] ?? 30;
    const manoeu = sys.hull?.manoeuvrability ?? 0;
    // Pilot (Space Craft) + Manoeuvrability as bonus
    const base = crew;
    const label = "Pilot (Space Craft)";
    const mod = await promptModifier(`${label} Test (Manoeuvrability: +${manoeu})`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(base, mod + manoeu);
    await sendTestToChat(this.actor, label, result, `Manoeuvrability bonus: +${manoeu}`);
  }

  async _onRollAugury() {
    const sys = this.actor.system;
    const crew = CREW_RATING_VALUES[sys.crew?.rating] ?? 30;
    const detection = sys.hull?.detection ?? 0;
    const label = "Scrutiny + Detection (Augury)";
    const mod = await promptModifier(`${label} (Detection bonus: +${detection})`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(crew, mod + detection);
    await sendTestToChat(this.actor, label, result, `Detection bonus: +${detection}`);
  }

  async _onRollTechUse() {
    const crew = CREW_RATING_VALUES[this.actor.system.crew?.rating] ?? 30;
    const label = "Tech-Use";
    const mod = await promptModifier(`${label} Test`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(crew, mod);
    await sendTestToChat(this.actor, label, result);
  }

  async _onRollCommand() {
    const crew = CREW_RATING_VALUES[this.actor.system.crew?.rating] ?? 30;
    const label = "Command";
    const mod = await promptModifier(`${label} Test`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(crew, mod);
    await sendTestToChat(this.actor, label, result);
  }

  /** Fire a specific weapon — macrobattery or lance resolution. */
  async _onFireWeapon(event) {
    event.preventDefault();
    const arc = event.currentTarget.dataset.arc;
    const index = parseInt(event.currentTarget.dataset.index, 10);
    const weapon = this.actor.system.weapons?.[arc]?.[index];
    if (!weapon) return;

    await this._fireWeapon(weapon);
  }

  async _fireWeapon(weapon) {
    const sys = this.actor.system;
    const crewVal = CREW_RATING_VALUES[sys.crew?.rating] ?? 30;
    const isLance = weapon.type === "lance";
    const label = `${weapon.name} (${isLance ? "Lance" : "Macrobattery"})`;

    const mod = await promptModifier(`Fire ${label}`);
    if (mod === null) return;

    // Roll BS test
    const testResult = await rollCharacteristicTest(crewVal, mod);

    // Calculate hits
    let hits = 0;
    if (testResult.success) {
      if (isLance) {
        // Lances: 1 hit + 1 per 3 DoS
        hits = 1 + Math.floor(Math.max(0, testResult.degrees) / 3);
      } else {
        // Macrobattery: 1 + DoS, capped at Strength
        const strength = parseInt(weapon.strength) || 1;
        hits = Math.min(1 + Math.max(0, testResult.degrees), strength);
      }
    }

    // Check for critical hit
    const critRating = parseInt(weapon.critRating) || 4;
    const crit = testResult.success && testResult.degrees >= critRating;

    // Roll damage for each hit
    const dmgFormula = weapon.damage || "1d10";
    const dmgRolls = [];
    for (let i = 0; i < hits; i++) {
      const r = new Roll(dmgFormula);
      await r.evaluate();
      dmgRolls.push(r.total);
    }

    // Roll crit if triggered
    let critRoll = null;
    if (crit || (hits > 0 && testResult.success)) {
      // Crit on DoS ≥ critRating
      if (crit) {
        const cr = new Roll("1d5");
        await cr.evaluate();
        critRoll = cr.total;
      }
    }

    // Build total damage (macros combine; lances keep separate)
    const totalDmg = isLance ? dmgRolls : [dmgRolls.reduce((a, b) => a + b, 0)];

    // Send to chat
    await this._sendWeaponChatMessage(weapon, testResult, hits, totalDmg, critRoll, isLance);
  }

  async _sendWeaponChatMessage(weapon, testResult, hits, dmgTotals, critRoll, isLance) {
    const template = `systems/${SYSTEM_ID}/templates/chat/voidship-weapon.hbs`;
    const content = await renderTemplate(template, {
      actor: this.actor,
      weapon,
      testResult,
      hits,
      dmgTotals,
      critRoll,
      isLance,
      armourNote: isLance
        ? "Lance damage ignores Armour — applied directly to Hull Integrity."
        : "Subtract target Armour from combined damage total. Excess = Hull Integrity loss.",
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content,
      type: CONST.CHAT_MESSAGE_STYLES.ROLL,
    });
  }

  // ---------------------------------------------------------------------------
  // Resource controls
  // ---------------------------------------------------------------------------

  async _onResourceControl(event) {
    event.preventDefault();
    const { action, field } = event.currentTarget.dataset;
    const current = foundry.utils.getProperty(this.actor, `system.${field}`) ?? 0;
    const newVal = action === "increase" ? current + 1 : current - 1;

    // If decreasing hull integrity, also decrease crew population and morale
    if (field === "hull.integrity.value" && action === "decrease") {
      const updates = {
        "system.hull.integrity.value": Math.max(0, newVal),
        "system.crew.population.value": Math.max(0, (this.actor.system.crew?.population?.value ?? 0) - 1),
        "system.crew.morale.value": Math.max(0, (this.actor.system.crew?.morale?.value ?? 0) - 1),
      };
      await this.actor.update(updates);
    } else {
      await this.actor.update({ [`system.${field}`]: newVal });
    }
  }

  // ---------------------------------------------------------------------------
  // Void shield pips
  // ---------------------------------------------------------------------------

  async _onShieldPipClick(event) {
    event.preventDefault();
    const idx = parseInt(event.currentTarget.dataset.index, 10);
    const current = this.actor.system.hull?.voidShields?.value ?? 0;
    const newVal = idx < current ? idx : idx + 1;
    await this.actor.update({
      "system.hull.voidShields.value": Math.clamp(newVal, 0, this.actor.system.hull?.voidShields?.max ?? 2),
    });
  }

  // ---------------------------------------------------------------------------
  // Supplemental components
  // ---------------------------------------------------------------------------

  async _onAddComponent(event) {
    event.preventDefault();
    const components = foundry.utils.deepClone(this.actor.system.supplementalComponents ?? []);
    components.push({ name: "New Component", power: 0, space: 0, sp: 0, notes: "" });
    await this.actor.update({ "system.supplementalComponents": components });
  }

  async _onRemoveComponent(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index, 10);
    const components = foundry.utils.deepClone(this.actor.system.supplementalComponents ?? []);
    components.splice(index, 1);
    await this.actor.update({ "system.supplementalComponents": components });
  }

  async _onComponentEdit(event) {
    event.preventDefault();
    const el = event.currentTarget;
    const index = parseInt(el.dataset.index, 10);
    const field = el.dataset.field;
    const value = el.type === "number" ? (parseFloat(el.value) || 0) : el.value;

    const components = foundry.utils.deepClone(this.actor.system.supplementalComponents ?? []);
    if (!components[index]) return;
    components[index][field] = value;
    await this.actor.update({ "system.supplementalComponents": components });
  }

  // ---------------------------------------------------------------------------
  // Weapon management
  // ---------------------------------------------------------------------------

  async _onAddWeapon(event) {
    event.preventDefault();
    const arc = event.currentTarget.dataset.arc;
    const weapons = foundry.utils.deepClone(this.actor.system.weapons ?? {});
    if (!weapons[arc]) weapons[arc] = [];
    weapons[arc].push({
      name: "New Weapon",
      type: "macrobattery",
      strength: 3,
      damage: "1d10+2",
      critRating: 5,
      range: 6,
      power: 4,
      space: 2,
      sp: 1,
      qualities: "",
    });
    await this.actor.update({ "system.weapons": weapons });
  }

  async _onRemoveWeapon(event) {
    event.preventDefault();
    const arc = event.currentTarget.dataset.arc;
    const index = parseInt(event.currentTarget.dataset.index, 10);
    const weapons = foundry.utils.deepClone(this.actor.system.weapons ?? {});
    weapons[arc]?.splice(index, 1);
    await this.actor.update({ "system.weapons": weapons });
  }

  async _onWeaponEdit(event) {
    event.preventDefault();
    const el = event.currentTarget;
    const arc = el.dataset.arc;
    const index = parseInt(el.dataset.index, 10);
    const field = el.dataset.field;
    const value = el.type === "number" ? (parseFloat(el.value) || 0) : el.value;

    const weapons = foundry.utils.deepClone(this.actor.system.weapons ?? {});
    if (!weapons[arc]?.[index]) return;
    weapons[arc][index][field] = value;
    await this.actor.update({ "system.weapons": weapons });
  }
}
