/**
 * rogue-trader-unofficial | xp-dialog.js
 *
 * Dialog for spending XP on Characteristic advances or Skill / Talent
 * purchases. Enforces costs from the RT core rulebook (p.69–71):
 *
 * Characteristic advances (per +5 tier, within same career):
 *   Simple:    100 xp
 *   Trained:   250 xp
 *   Veteran:   500 xp
 *   Costs ×1.5 if outside career; round up to nearest 25.
 *
 * Skill acquisition:
 *   Basic skill (Trained → Known): 100 xp
 *   +10:                           100 xp
 *   +20:                           100 xp
 *   Advanced skill (first purchase): 200 xp
 *   Advanced +10:                  100 xp
 *   Advanced +20:                  100 xp
 *   Out-of-career: ×1.5
 *
 * Talent: 200 xp (in-career), 300 xp (out-of-career)
 *
 * This dialog provides a guided UI rather than free-text XP entry.
 */

const MODULE = "rogue-trader-unofficial";

import {
  getActorCareer,
  getAvailableAdvances,
  isInCareer,
  outOfCareerCost,
  getCharAdvanceCost,
} from "../careers.js";

/** Cost table for characteristic advances (advance number 1–4). */
const CHAR_ADVANCE_COSTS = [100, 250, 500, 750];

/** Build a dialog and return the chosen spend, or null if cancelled. */
export async function openXPDialog(actor) {
  return new Promise((resolve) => {
    const dlg = new XPSpendDialog(actor, resolve);
    dlg.render(true);
  });
}

// ---------------------------------------------------------------------------

class XPSpendDialog extends Application {

  constructor(actor, resolve, options = {}) {
    super(options);
    this._actor   = actor;
    this._resolve = resolve;
    this._type    = "characteristic"; // or "skill" | "talent" | "manual"
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id:        `${MODULE}-xp-dialog`,
      title:     "Spend Experience Points",
      template:  `systems/${MODULE}/templates/dialogs/xp-dialog.hbs`,
      width:     480,
      height:    "auto",
      resizable: false,
      classes:   ["rogue-trader", `${MODULE}-dialog`],
    });
  }

  getData() {
    const sys   = this._actor.system;
    const chars = sys.characteristics ?? {};
    const unspent = (sys.experience?.total ?? 0) - (sys.experience?.spent ?? 0);

    // Career awareness
    const career        = getActorCareer(this._actor);
    const careerAdvances = career ? getAvailableAdvances(this._actor) : [];

    // Build characteristic options — show current value and next advance cost
    const charOptions = Object.entries(chars).map(([key, char]) => {
      const advNum   = Math.min(char.advances ?? 0, 3);
      // Use career-specific cost if available, else fall back to generic table
      const careerCost    = getCharAdvanceCost(this._actor, key, advNum);
      const genericCost   = CHAR_ADVANCE_COSTS[advNum] ?? 750;
      const inCareerCost  = careerCost ?? genericCost;
      const oocCost       = outOfCareerCost(inCareerCost);
      const hasCareer     = !!career;
      const cost          = hasCareer ? inCareerCost : genericCost;
      const maxed         = (char.advances ?? 0) >= 4;
      const canAfford     = unspent >= cost;
      return {
        key,
        label:         game.i18n.localize(`RT.Characteristics.${key}Abbr`),
        fullName:      game.i18n.localize(`RT.Characteristics.${key}`),
        current:       char.value,
        advances:      char.advances ?? 0,
        nextCost:      cost,
        oocCost,
        hasCareer,
        maxed,
        canAfford: !maxed && canAfford,
      };
    });

    // Build skill options
    const skillItems = this._actor.items.filter(i => i.type === "skill");
    const skillOptions = skillItems.map(item => {
      const level        = item.system.level ?? 0;
      const isAdv        = item.system.type === "advanced";
      const inC          = isInCareer(this._actor, item.name);
      const baseCost     = level === 0 ? (isAdv ? 200 : 100) : 100;
      const cost         = (career && !inC) ? outOfCareerCost(baseCost) : baseCost;
      const maxed        = level >= 2;
      return {
        id:           item.id,
        name:         item.name,
        level,
        levelLabel:   ["Trained", "+10", "+20"][level] ?? "+20",
        nextLabel:    level < 2 ? ["+10", "+20"][level] : "Mastered",
        cost,
        baseCost,
        inCareer:     !career || inC,
        outOfCareer:  !!career && !inC,
        maxed,
        canAfford:    !maxed && unspent >= cost,
      };
    });

    return {
      actor:        this._actor,
      unspent,
      charOptions,
      skillOptions,
      type:         this._type,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Tab switching
    html.find(".xp-tab-btn").on("click", (e) => {
      this._type = e.currentTarget.dataset.tab;
      this.render(false);
    });

    // Characteristic advance button
    html.find(".char-advance-btn").on("click", async (e) => {
      const key = e.currentTarget.dataset.char;
      await this._spendOnCharacteristic(key);
    });

    // Skill advance button
    html.find(".skill-advance-btn").on("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      await this._spendOnSkill(id);
    });

    // Manual XP entry
    html.find("[data-action='manual-spend']").on("click", async () => {
      await this._manualSpend(html);
    });

    html.find("[data-action='close']").on("click", () => {
      this._resolve(null);
      this.close();
    });
  }

  async _spendOnCharacteristic(key) {
    const sys     = this._actor.system;
    const char    = sys.characteristics[key];
    const unspent = (sys.experience.total ?? 0) - (sys.experience.spent ?? 0);
    const advNum    = Math.min(char.advances ?? 0, 3);
    const careerCost = getCharAdvanceCost(this._actor, key, advNum);
    const cost       = careerCost ?? CHAR_ADVANCE_COSTS[advNum];

    if (unspent < cost) {
      ui.notifications.warn(`Not enough XP. Need ${cost}, have ${unspent}.`);
      return;
    }

    if ((char.advances ?? 0) >= 4) {
      ui.notifications.warn("This characteristic is already fully advanced.");
      return;
    }

    const label = game.i18n.localize(`RT.Characteristics.${key}`);
    const confirmed = await Dialog.confirm({
      title:   `Advance ${label}?`,
      content: `<p>Spend <strong>${cost} XP</strong> to advance <strong>${label}</strong> by +5?</p>
                <p>New value: ${char.value + 5}</p>`,
    });
    if (!confirmed) return;

    await this._actor.update({
      [`system.characteristics.${key}.advances`]: (char.advances ?? 0) + 1,
      "system.experience.spent": (sys.experience.spent ?? 0) + cost,
    });

    ui.notifications.info(`${label} advanced to ${char.value + 5}. (${cost} XP spent)`);
    this.render(false);
  }

  async _spendOnSkill(id) {
    const item    = this._actor.items.get(id);
    if (!item) return;

    const sys     = this._actor.system;
    const unspent = (sys.experience.total ?? 0) - (sys.experience.spent ?? 0);
    const level    = item.system.level ?? 0;
    const isAdv    = item.system.type === "advanced";
    const baseCost = level === 0 ? (isAdv ? 200 : 100) : 100;
    const inC      = isInCareer(this._actor, item.name);
    const cost     = (getActorCareer(this._actor) && !inC) ? outOfCareerCost(baseCost) : baseCost;
    const nextLbl = ["+10", "+20"][level] ?? "";

    if (level >= 2) {
      ui.notifications.warn("This skill is already at maximum training level (+20).");
      return;
    }

    if (unspent < cost) {
      ui.notifications.warn(`Not enough XP. Need ${cost}, have ${unspent}.`);
      return;
    }

    const ooc     = !!getActorCareer(this._actor) && !isInCareer(this._actor, item.name);
    const oocWarn = ooc
      ? `<p class="ooc-warning"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Out-of-career advance</strong> — costs ×1.5 (${cost} XP instead of ${baseCost} XP).</p>`
      : "";
    const confirmed = await Dialog.confirm({
      title:   `Train ${item.name} ${nextLbl}?`,
      content: `${oocWarn}<p>Spend <strong>${cost} XP</strong> to improve <strong>${item.name}</strong> to ${nextLbl}?</p>`,
    });
    if (!confirmed) return;

    await item.update({ "system.level": level + 1 });
    await this._actor.update({
      "system.experience.spent": (sys.experience.spent ?? 0) + cost,
    });

    ui.notifications.info(`${item.name} improved to ${nextLbl}. (${cost} XP spent)`);
    this.render(false);
  }

  async _manualSpend(html) {
    const amount = parseInt(html.find("[name='manual-xp']").val(), 10);
    const note   = html.find("[name='manual-note']").val()?.trim();

    if (isNaN(amount) || amount === 0) {
      ui.notifications.warn("Enter a non-zero XP amount (negative to refund).");
      return;
    }

    const sys     = this._actor.system;
    const unspent = (sys.experience.total ?? 0) - (sys.experience.spent ?? 0);

    if (amount > 0 && amount > unspent) {
      ui.notifications.warn(`Not enough unspent XP (have ${unspent}, need ${amount}).`);
      return;
    }

    const confirmed = await Dialog.confirm({
      title:   amount > 0 ? `Spend ${amount} XP?` : `Refund ${Math.abs(amount)} XP?`,
      content: `<p>${note ? `<em>${note}</em><br>` : ""}
                ${amount > 0 ? `Deduct` : `Restore`} <strong>${Math.abs(amount)} XP</strong>?</p>`,
    });
    if (!confirmed) return;

    await this._actor.update({
      "system.experience.spent": (sys.experience.spent ?? 0) + amount,
    });

    ui.notifications.info(`${Math.abs(amount)} XP ${amount > 0 ? "spent" : "refunded"}.`);
    this.render(false);
  }
}
