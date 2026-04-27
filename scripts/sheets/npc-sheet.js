/**
 * rogue-trader-unofficial | npc-sheet.js
 * NPC / Adversary sheet.
 */

import {
  rollCharacteristicTest,
  sendTestToChat,
  rollDamage,
  sendDamageToChat,
  promptModifier,
} from "../rolls/characteristic-roll.js";

const CHAR_LABELS = {
  ws: "RT.Characteristics.ws", bs: "RT.Characteristics.bs",
  str: "RT.Characteristics.str", t: "RT.Characteristics.t",
  ag: "RT.Characteristics.ag", int: "RT.Characteristics.int",
  per: "RT.Characteristics.per", wp: "RT.Characteristics.wp",
  fel: "RT.Characteristics.fel",
};

export class RogueTraderNPCSheet extends foundry.appv1.sheets.ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:   ["rogue-trader", "sheet", "actor", "npc"],
      template:  "systems/rogue-trader-unofficial/templates/actors/npc-sheet.hbs",
      width:     650,
      height:    560,
      tabs: [{
        navSelector:     ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial:         "main",
      }],
      resizable: true,
    });
  }

  getData() {
    const ctx = super.getData();
    const sys = this.actor.system;

    ctx.chars = {};
    for (const [key, char] of Object.entries(sys.characteristics)) {
      const value = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
      ctx.chars[key] = {
        ...char,
        value,
        bonus:  Math.floor(value / 10),
        label:  game.i18n.localize(CHAR_LABELS[key]),
        abbr:   game.i18n.localize(`RT.Characteristics.${key}Abbr`),
        key,
      };
    }

    const agBonus = ctx.chars.ag.bonus;
    ctx.movement = {
      half:   agBonus,
      full:   agBonus * 2,
      charge: agBonus * 3,
      run:    agBonus * 6,
    };

    ctx.weapons  = this.actor.items.filter(i => i.type === "weapon");
    ctx.system   = sys;

    ctx.sizeOptions = {
      miniscule: game.i18n.localize("RT.NPC.Sizes.miniscule"),
      puny:      game.i18n.localize("RT.NPC.Sizes.puny"),
      scrawny:   game.i18n.localize("RT.NPC.Sizes.scrawny"),
      average:   game.i18n.localize("RT.NPC.Sizes.average"),
      hulking:   game.i18n.localize("RT.NPC.Sizes.hulking"),
      enormous:  game.i18n.localize("RT.NPC.Sizes.enormous"),
      massive:   game.i18n.localize("RT.NPC.Sizes.massive"),
    };

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find(".char-roll").on("click",       this._onCharRoll.bind(this));
    html.find(".weapon-attack").on("click",   this._onWeaponAttack.bind(this));
    html.find(".weapon-damage").on("click",   this._onWeaponDamage.bind(this));
    html.find(".item-create").on("click",     this._onItemCreate.bind(this));
    html.find(".item-edit").on("click",       this._onItemEdit.bind(this));
    html.find(".item-delete").on("click",     this._onItemDelete.bind(this));
    html.find(".resource-control").on("click", this._onResourceControl.bind(this));
  }

  async _onCharRoll(event) {
    event.preventDefault();
    const key  = event.currentTarget.dataset.char;
    const char = this.actor.system.characteristics[key];
    const val  = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
    const label = game.i18n.localize(CHAR_LABELS[key]);
    const mod  = await promptModifier(`${label} Test`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(val, mod);
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
    const mod     = await promptModifier(`${item.name} Attack`);
    if (mod === null) return;
    const result = await rollCharacteristicTest(value, mod);
    await sendTestToChat(this.actor, `${item.name} — ${isMelee ? "WS" : "BS"}`, result);
  }

  async _onWeaponDamage(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item   = this.actor.items.get(itemId);
    if (!item) return;
    const dmgResult = await rollDamage(item.system.damage.formula, item.system.damage.type, item.system.penetration);
    await sendDamageToChat(this.actor, item.name, dmgResult);
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type ?? "weapon";
    await Item.create({ name: `New ${type}`, type }, { parent: this.actor });
  }

  _onItemEdit(event) {
    event.preventDefault();
    const id = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    this.actor.items.get(id)?.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const id   = event.currentTarget.closest("[data-item-id]")?.dataset.itemId;
    const item = this.actor.items.get(id);
    if (!item) return;
    const ok = await Dialog.confirm({ title: `Delete ${item.name}?`, content: `<p>Remove <strong>${item.name}</strong>?</p>` });
    if (ok) await item.delete();
  }

  async _onResourceControl(event) {
    event.preventDefault();
    const { action, field } = event.currentTarget.dataset;
    const current = foundry.utils.getProperty(this.actor, `system.${field}`) ?? 0;
    await this.actor.update({ [`system.${field}`]: current + (action === "increase" ? 1 : -1) });
  }
}
