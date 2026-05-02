/**
 * rogue-trader-unofficial | actor-sheet.js
 * Character (Explorer) sheet for the Rogue Trader system.
 */

import {
  rollCharacteristicTest,
  rollDamage,
  sendTestToChat,
  sendDamageToChat,
  promptModifier,
} from "../rolls/characteristic-roll.js";
import { openXPDialog }       from "../rolls/xp-dialog.js";
import { rollProfitFactor }   from "../rolls/profit-factor.js";
import { rollFocusPower, promptFocusPower } from "../rolls/psychic-roll.js";
import { rollOpposedTest }    from "../rolls/opposed-test.js";
import {
  CareerSelectionDialog,
  CustomCareerEditorDialog,
  buildCareerTabData,
  isInCareer,
  outOfCareerCost,
  getCharAdvanceCost,
  rankFromXP,
  getRankName,
} from "../rolls/career-dialog.js";

const CHAR_LABELS = {
  ws:  "RT.Characteristics.ws",
  bs:  "RT.Characteristics.bs",
  str: "RT.Characteristics.str",
  t:   "RT.Characteristics.t",
  ag:  "RT.Characteristics.ag",
  int: "RT.Characteristics.int",
  per: "RT.Characteristics.per",
  wp:  "RT.Characteristics.wp",
  fel: "RT.Characteristics.fel",
};

export class RogueTraderCharacterSheet extends foundry.appv1.sheets.ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:   ["rogue-trader", "sheet", "actor", "character"],
      template:  "systems/rogue-trader-unofficial/templates/actors/character-sheet.hbs",
      width:     800,
      height:    720,
      tabs: [{
        navSelector:     ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial:         "main",
      }],
      scrollY:   [".sheet-body"],
      resizable: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Data preparation
  // ---------------------------------------------------------------------------

  getData() {
    const ctx  = super.getData();
    const sys  = this.actor.system;

    // Compute effective characteristic values and bonuses
    ctx.chars = {};
    for (const [key, char] of Object.entries(sys.characteristics)) {
      const value = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
      ctx.chars[key] = {
        ...char,
        value,
        bonus:    Math.floor(value / 10),
        label:    game.i18n.localize(CHAR_LABELS[key]),
        abbr:     game.i18n.localize(`RT.Characteristics.${key}Abbr`),
        key,
      };
    }

    // Movement derived from Agility Bonus
    const agBonus = ctx.chars.ag.bonus;
    ctx.movement = {
      half:   agBonus,
      full:   agBonus * 2,
      charge: agBonus * 3,
      run:    agBonus * 6,
    };

    // Unspent XP
    ctx.unspentXP = (sys.experience.total || 0) - (sys.experience.spent || 0);

    // Rank from spent XP
    ctx.rank = this._getRank(sys.experience.spent || 0);

    // Partition items by type
    ctx.weapons     = this.actor.items.filter(i => i.type === "weapon");
    ctx.armours     = this.actor.items.filter(i => i.type === "armour");
    ctx.gear        = this.actor.items.filter(i => i.type === "gear");
    ctx.talents     = this.actor.items.filter(i => i.type === "talent");
    ctx.skills      = this.actor.items.filter(i => i.type === "skill").sort((a, b) => a.name.localeCompare(b.name));
    ctx.psychic     = this.actor.items.filter(i => i.type === "psychicPower");
    ctx.cybernetics = this.actor.items.filter(i => i.type === "cybernetic");

    // Insanity bracket
    const ip = sys.insanity?.value ?? 0;
    if      (ip <= 9)  ctx.insanityBracket = "Unsettled";
    else if (ip <= 20) ctx.insanityBracket = "Troubled";
    else if (ip <= 40) ctx.insanityBracket = "Disturbed";
    else if (ip <= 60) ctx.insanityBracket = "Neurotic";
    else if (ip <= 80) ctx.insanityBracket = "Deranged";
    else               ctx.insanityBracket = "Unhinged";

    // Corruption bracket
    const cp = sys.corruption?.value ?? 0;
    if      (cp <= 30) ctx.corruptionBracket = "Tainted";
    else if (cp <= 60) ctx.corruptionBracket = "Soiled";
    else if (cp <= 90) ctx.corruptionBracket = "Debased";
    else if (cp <= 99) ctx.corruptionBracket = "Profane";
    else               ctx.corruptionBracket = "Damned";

    // Fate pip arrays for template rendering
    const fateMax = sys.fate?.max ?? 0;
    const fateVal = sys.fate?.value ?? 0;
    ctx.fatePips = Array.from({ length: fateMax }, (_, i) => ({ filled: i < fateVal, index: i }));

    // ── Career tab data ──────────────────────────────────────────────────────
    const careerData = buildCareerTabData(this.actor);
    ctx.career = careerData.career;
    ctx.allCareers = careerData.allCareers;
    ctx.rank = careerData.rank;
    ctx.rankName = careerData.rankName;
    ctx.nextThreshold = careerData.nextThreshold;
    ctx.xpToNextRank = careerData.xpToNextRank;
    ctx.advancesByRank = careerData.advancesByRank;
    ctx.charAdvances = careerData.charAdvances;
    ctx.hasCareer = careerData.hasCareer;
    ctx.customCareers = careerData.customCareers;

    // Rank progress bar percentage
    const prevThreshold = [5000, 7000, 10000, 13000, 17000, 21000, 25000, 30000][ctx.rank - 2] ?? 0;
    const nextT = ctx.nextThreshold ?? 35000;
    ctx.rankProgressPct = Math.min(100, Math.round(
      ((sys.experience?.spent ?? 0) - prevThreshold) / (nextT - prevThreshold) * 100
    ));

    // System reference shorthand
    ctx.system = sys;

    return ctx;
  }

  _getRank(spentXP) {
    if (spentXP < 7000)  return 1;
    if (spentXP < 10000) return 2;
    if (spentXP < 13000) return 3;
    if (spentXP < 17000) return 4;
    if (spentXP < 21000) return 5;
    if (spentXP < 25000) return 6;
    if (spentXP < 30000) return 7;
    return 8;
  }

  // ---------------------------------------------------------------------------
  // Listeners
  // ---------------------------------------------------------------------------

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    // ── Characteristic rolls ─────────────────────────────────────────────────
    html.find(".char-roll").on("click", this._onCharacteristicRoll.bind(this));

    // ── Skill rolls ──────────────────────────────────────────────────────────
    html.find(".skill-roll").on("click", this._onSkillRoll.bind(this));

    // ── Weapon attack + damage ───────────────────────────────────────────────
    html.find(".weapon-attack").on("click", this._onWeaponAttack.bind(this));
    html.find(".weapon-damage").on("click", this._onWeaponDamage.bind(this));

    // ── Fate point pips ──────────────────────────────────────────────────────
    html.find(".fate-pip").on("click", this._onFatePipClick.bind(this));

    // ── XP spend dialog ──────────────────────────────────────────────────────
    html.find(".xp-spend-btn").on("click", () => openXPDialog(this.actor));

    // ── Profit Factor acquisition roll ───────────────────────────────────────
    html.find(".pf-roll-btn").on("click", () => rollProfitFactor(this.actor));

    // ── Psychic power roll (from psychic tab) ─────────────────────────────────
    html.find(".psychic-power-roll").on("click", this._onFocusPower.bind(this));

    // ── Opposed test (context menu / button) ──────────────────────────────────
    html.find(".opposed-test-btn").on("click", this._onOpposedTest.bind(this));

    // ── Career tab ──────────────────────────────────────────────────────────
    html.find("[data-action='select-career']").on("click", () =>
      new CareerSelectionDialog(this.actor).render(true)
    );
    html.find("[data-action='new-custom-career']").on("click", () =>
      new CustomCareerEditorDialog(this.actor).render(true)
    );
    html.find("[data-action='edit-custom-career']").on("click", (e) => {
      const id = e.currentTarget.dataset.careerId;
      new CustomCareerEditorDialog(this.actor, id).render(true);
    });
    html.find("[data-action='delete-custom-career']").on("click", async (e) => {
      const id = e.currentTarget.dataset.careerId;
      const ok = await Dialog.confirm({
        title: "Delete Custom Career?",
        content: `<p>Permanently delete custom career <strong>${id}</strong>?</p>`,
      });
      if (!ok) return;
      const custom = foundry.utils.deepClone(this.actor.system.customCareers ?? {});
      delete custom[id];
      await this.actor.update({ "system.customCareers": custom });
    });


    // ── Wound / resource adjustment ──────────────────────────────────────────
    html.find(".resource-control").on("click", this._onResourceControl.bind(this));

    // ── Item controls ────────────────────────────────────────────────────────
    html.find(".item-create").on("click", this._onItemCreate.bind(this));
    html.find(".item-edit").on("click", this._onItemEdit.bind(this));
    html.find(".item-delete").on("click", this._onItemDelete.bind(this));
    html.find(".item-toggle-equip").on("click", this._onItemToggleEquip.bind(this));
  }

  // ---------------------------------------------------------------------------
  // Roll handlers
  // ---------------------------------------------------------------------------

  async _onCharacteristicRoll(event) {
    event.preventDefault();
    const key   = event.currentTarget.dataset.char;
    const char  = this.actor.system.characteristics[key];
    if (!char) return;

    const value  = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
    const label  = game.i18n.localize(CHAR_LABELS[key]);
    const mod    = await promptModifier(`${label} Test`);
    if (mod === null) return;

    const result = await rollCharacteristicTest(value, mod);
    await sendTestToChat(this.actor, label, result);
  }

  async _onSkillRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item   = this.actor.items.get(itemId);
    if (!item) return;

    const charKey = item.system.characteristic;
    const char    = this.actor.system.characteristics[charKey];
    if (!char) return;

    const baseVal   = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
    const skillMod  = item.system.level * 10;                    // 0 / +10 / +20
    const target    = baseVal + skillMod;
    const label     = item.name;

    const extra = await promptModifier(`${label} Skill Test`);
    if (extra === null) return;

    const result = await rollCharacteristicTest(target, extra);
    await sendTestToChat(this.actor, label, result);
  }

  async _onWeaponAttack(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item   = this.actor.items.get(itemId);
    if (!item) return;

    const isMelee = item.system.class === "melee";
    const charKey = isMelee ? "ws" : "bs";
    const char    = this.actor.system.characteristics[charKey];
    const value   = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
    const label   = `${item.name} — ${isMelee ? "Weapon Skill" : "Ballistic Skill"}`;

    const mod = await promptModifier(`${item.name} Attack`);
    if (mod === null) return;

    const result = await rollCharacteristicTest(value, mod);
    await sendTestToChat(this.actor, label, result);
  }

  async _onWeaponDamage(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item   = this.actor.items.get(itemId);
    if (!item) return;

    const { formula, type, special } = item.system.damage;
    const pen  = item.system.penetration ?? 0;
    const dmgResult = await rollDamage(formula, type, pen);
    await sendDamageToChat(this.actor, item.name, dmgResult);
  }

  // ---------------------------------------------------------------------------
  // Resource / fate controls
  // ---------------------------------------------------------------------------

  async _onFatePipClick(event) {
    event.preventDefault();
    const idx     = parseInt(event.currentTarget.dataset.index, 10);
    const current = this.actor.system.fate.value;
    // Clicking a filled pip = spend; clicking an empty pip = restore
    const newVal  = idx < current ? idx : idx + 1;
    await this.actor.update({ "system.fate.value": Math.clamp(newVal, 0, this.actor.system.fate.max) });
  }

  async _onResourceControl(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const field  = event.currentTarget.dataset.field;
    const current = foundry.utils.getProperty(this.actor, `system.${field}`) ?? 0;

    let newVal;
    if (action === "increase") newVal = current + 1;
    else if (action === "decrease") newVal = current - 1;
    else return;

    await this.actor.update({ [`system.${field}`]: newVal });
  }

  // ---------------------------------------------------------------------------
  // Item CRUD
  // ---------------------------------------------------------------------------

  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type ?? "gear";
    const name = `New ${game.i18n.localize(`RT.Items.Type${type.charAt(0).toUpperCase() + type.slice(1)}`)}`;
    await Item.create({ name, type }, { parent: this.actor });
  }

  _onItemEdit(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    this.actor.items.get(itemId)?.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item   = this.actor.items.get(itemId);
    if (!item) return;

    const confirmed = await Dialog.confirm({
      title:   `Delete ${item.name}?`,
      content: `<p>Remove <strong>${item.name}</strong> from this character?</p>`,
    });
    if (confirmed) await item.delete();
  }

  // ── Psychic power handler ────────────────────────────────────────────────

  async _onFocusPower(event) {
    event.preventDefault();
    const itemId  = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item    = this.actor.items.get(itemId);
    const prBase  = this.actor.system.psy?.rating ?? 0;
    if (prBase === 0) {
      ui.notifications.warn(`${this.actor.name} has no Psy Rating.`);
      return;
    }
    const powerName = item?.name ?? "Psychic Power";
    const opts = await promptFocusPower(this.actor, powerName);
    if (!opts) return;
    const isRenegade = (this.actor.system.psy?.class === "unbound");
    await rollFocusPower(this.actor, {
      powerName,
      ...opts,
      psykerClass: isRenegade ? "renegade" : "sanctioned",
    });
  }

  // ── Opposed test handler ─────────────────────────────────────────────────

  async _onOpposedTest(event) {
    event.preventDefault();
    const targets = [...game.user.targets];
    if (!targets.length) {
      ui.notifications.warn("Target a token to roll an Opposed Test against.");
      return;
    }
    const defender = targets[0].actor;
    if (!defender) return;
    await rollOpposedTest(this.actor, defender);
  }

  async _onItemToggleEquip(event) {
    event.preventDefault();
    const itemId  = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item    = this.actor.items.get(itemId);
    if (!item) return;
    await item.update({ "system.equipped": !item.system.equipped });
  }
}
