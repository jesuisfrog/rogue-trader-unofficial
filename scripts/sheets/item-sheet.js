/**
 * rogue-trader-unofficial | item-sheet.js
 * Generic Item sheet — the template switches on item.type for layout.
 */

export class RogueTraderItemSheet extends foundry.appv1.sheets.ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes:   ["rogue-trader", "sheet", "item"],
      template:  "systems/rogue-trader-unofficial/templates/items/item-sheet.hbs",
      width:     520,
      height:    "auto",
      resizable: true,
    });
  }

  getData() {
    const ctx  = super.getData();
    const sys  = this.item.system;
    ctx.system = sys;

    // Build select option maps for templates
    ctx.weaponClasses = {
      pistol: game.i18n.localize("RT.Items.WeaponClasses.pistol"),
      basic:  game.i18n.localize("RT.Items.WeaponClasses.basic"),
      heavy:  game.i18n.localize("RT.Items.WeaponClasses.heavy"),
      melee:  game.i18n.localize("RT.Items.WeaponClasses.melee"),
      thrown: game.i18n.localize("RT.Items.WeaponClasses.thrown"),
      exotic: game.i18n.localize("RT.Items.WeaponClasses.exotic"),
    };

    ctx.damageTypes = {
      i: game.i18n.localize("RT.Items.DamageTypes.i"),
      r: game.i18n.localize("RT.Items.DamageTypes.r"),
      x: game.i18n.localize("RT.Items.DamageTypes.x"),
      e: game.i18n.localize("RT.Items.DamageTypes.e"),
    };

    ctx.armourTypes = {
      none:      game.i18n.localize("RT.Items.ArmourTypes.none"),
      primitive: game.i18n.localize("RT.Items.ArmourTypes.primitive"),
      light:     game.i18n.localize("RT.Items.ArmourTypes.light"),
      heavy:     game.i18n.localize("RT.Items.ArmourTypes.heavy"),
      powered:   game.i18n.localize("RT.Items.ArmourTypes.powered"),
    };

    ctx.craftsmanships = {
      poor:   game.i18n.localize("RT.Items.Craftsmanships.poor"),
      common: game.i18n.localize("RT.Items.Craftsmanships.common"),
      good:   game.i18n.localize("RT.Items.Craftsmanships.good"),
      best:   game.i18n.localize("RT.Items.Craftsmanships.best"),
    };

    ctx.availabilities = {
      plentiful:  game.i18n.localize("RT.Items.Availabilities.plentiful"),
      common:     game.i18n.localize("RT.Items.Availabilities.common"),
      average:    game.i18n.localize("RT.Items.Availabilities.average"),
      scarce:     game.i18n.localize("RT.Items.Availabilities.scarce"),
      rare:       game.i18n.localize("RT.Items.Availabilities.rare"),
      veryRare:   game.i18n.localize("RT.Items.Availabilities.veryRare"),
      nearUnique: game.i18n.localize("RT.Items.Availabilities.nearUnique"),
      unique:     game.i18n.localize("RT.Items.Availabilities.unique"),
    };

    ctx.characteristics = {
      ws:  game.i18n.localize("RT.Characteristics.ws"),
      bs:  game.i18n.localize("RT.Characteristics.bs"),
      str: game.i18n.localize("RT.Characteristics.str"),
      t:   game.i18n.localize("RT.Characteristics.t"),
      ag:  game.i18n.localize("RT.Characteristics.ag"),
      int: game.i18n.localize("RT.Characteristics.int"),
      per: game.i18n.localize("RT.Characteristics.per"),
      wp:  game.i18n.localize("RT.Characteristics.wp"),
      fel: game.i18n.localize("RT.Characteristics.fel"),
    };

    ctx.disciplines = {
      telepathy:   game.i18n.localize("RT.Items.PsyDisciplines.telepathy"),
      divination:  game.i18n.localize("RT.Items.PsyDisciplines.divination"),
      telekinesis: game.i18n.localize("RT.Items.PsyDisciplines.telekinesis"),
      biomancy:    game.i18n.localize("RT.Items.PsyDisciplines.biomancy"),
      pyromancy:   game.i18n.localize("RT.Items.PsyDisciplines.pyromancy"),
      sanctic:     game.i18n.localize("RT.Items.PsyDisciplines.sanctic"),
    };

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
