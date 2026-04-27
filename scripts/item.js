/**
 * rogue-trader-unofficial | item.js
 *
 * Extends the core Item class.
 * Currently light — the main logic is in the Actor's prepareData (AP summing).
 * This file is the right place to add per-item derived values in future
 * (e.g. damage bonus from Strength for melee weapons).
 */

export class RogueTraderItem extends Item {

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();

    if (this.type === "weapon") this._prepareWeapon();
    if (this.type === "skill")  this._prepareSkill();
  }

  _prepareWeapon() {
    const sys = this.system;

    // Build a display string for Rate of Fire (e.g. "S/3/–" or "S/–/–")
    const s  = sys.rateOfFire?.single ? "S"   : "–";
    const sm = sys.rateOfFire?.semi   ? String(sys.rateOfFire.semi) : "–";
    const au = sys.rateOfFire?.auto   ? String(sys.rateOfFire.auto) : "–";
    sys.rofDisplay = `${s}/${sm}/${au}`;

    // Full damage string including type abbreviation for display
    const typeLabel = { i: "I", r: "R", x: "X", e: "E" }[sys.damage?.type] ?? "";
    sys.damageDisplay = `${sys.damage?.formula ?? ""}${typeLabel}`;
  }

  _prepareSkill() {
    const sys = this.system;
    // Bonus from training level: 0 = +0, 1 = +10, 2 = +20
    sys.levelBonus = (sys.level ?? 0) * 10;
  }
}
