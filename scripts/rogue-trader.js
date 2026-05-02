/**
 * rogue-trader-unofficial | rogue-trader.js
 * Main system entry point — Foundry v13 ESModule.
 */

import { RogueTraderActor } from "./actor.js";
import { RogueTraderItem } from "./item.js";
import { RogueTraderCharacterSheet } from "./sheets/actor-sheet.js";
import { RogueTraderNPCSheet } from "./sheets/npc-sheet.js";
import { RogueTraderItemSheet } from "./sheets/item-sheet.js";
import { RogueTraderVoidshipSheet } from "./sheets/voidship-sheet.js";
import { RogueTraderCombatant } from "./combatant.js";
import {
  macroRollOpposed,
  macroRollFocusPower,
  macroRollAcquisition,
  macroRollCharacteristic,
  macroSpendXP,
  macroGenerateCharacteristics,
} from "./macros.js";
import { registerHandlebarsHelpers } from "./helpers/handlebars.js";

const SYSTEM_ID = "rogue-trader-unofficial";

// ── init ────────────────────────────────────────────────────────────────────

Hooks.once("init", async () => {
  console.log("Rogue Trader | Initialising");

  // Expose namespace for macros / modules
  game.rogueTrader = {};

  // Register custom Actor and Item document classes
  CONFIG.Actor.documentClass = RogueTraderActor;
  CONFIG.Item.documentClass = RogueTraderItem;

  // Register sheet classes
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(SYSTEM_ID, RogueTraderCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Explorer Sheet",
  });
  foundry.documents.collections.Actors.registerSheet(SYSTEM_ID, RogueTraderNPCSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "NPC / Adversary Sheet",
  });

  foundry.documents.collections.Actors.registerSheet(SYSTEM_ID, RogueTraderVoidshipSheet, {
    types: ["voidship"],
    makeDefault: true,
    label: "Voidship Sheet",
  });

  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);
  foundry.documents.collections.Items.registerSheet(SYSTEM_ID, RogueTraderItemSheet, {
    makeDefault: true,
    label: "Rogue Trader Item Sheet",
  });

  // Register custom Combatant class — this is where initiative formula lives
  CONFIG.Combatant.documentClass = RogueTraderCombatant;

  // Initiative display: 2 decimals so the Ag/1000 tiebreaker is visible to GMs
  // but small enough that it looks like a decimal, not a separate number.
  CONFIG.Combat.initiative = {
    formula: "1d10",   // fallback only; RogueTraderCombatant overrides per-actor
    decimals: 0,
  };

  // Handlebars helpers
  registerHandlebarsHelpers();

  // Settings
  _registerSettings();

  // Pre-load templates
  await _preloadTemplates();
});

// ── ready ────────────────────────────────────────────────────────────────────

Hooks.once("ready", () => {
  console.log("Rogue Trader | Ready");

  // Expose macro functions for compendium macros and the console
  game.rogueTrader = {
    rollOpposed: macroRollOpposed,
    rollFocusPower: macroRollFocusPower,
    rollAcquisition: macroRollAcquisition,
    rollCharacteristic: macroRollCharacteristic,
    spendXP: macroSpendXP,
    generateCharacteristics: macroGenerateCharacteristics,
  };

  console.log("Rogue Trader | Macros available on game.rogueTrader");
});

// ── Initiative ───────────────────────────────────────────────────────────────
//
// RT initiative = Agility Bonus (tens digit of Ag).
// Ties broken by full Ag value — encode as (AB * 100) + Ag so Foundry's
// numeric sort naturally resolves ties correctly.

Hooks.once("init", () => {
  CONFIG.Combat.initiative = {
    formula: "1d10",    // overridden below; kept as fallback
    decimals: 0,
  };
});

Hooks.on("getCombatantInitiativeFormula", (combatant) => {
  const actor = combatant?.actor;
  if (!actor) return "1d10";

  const ag = actor.system?.characteristics?.ag;
  if (!ag) return "1d10";

  const value = ag.value ?? ((ag.base || 0) + (ag.advances || 0) * 5 + (ag.modifier || 0));
  const bonus = Math.floor(value / 10);

  // Return the flat AB value; Foundry uses this as the roll total.
  // Tiebreaker: add Ag/1000 so full Ag sorts higher without affecting the integer display.
  return `${bonus} + ${value} / 1000`;
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function _registerSettings() {
  game.settings.register(SYSTEM_ID, "autoCalcMovement", {
    name: "Auto-Calculate Movement",
    hint: "Derive Movement from Agility Bonus automatically.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(SYSTEM_ID, "showModifierDialog", {
    name: "Always Show Modifier Prompt",
    hint: "Show the modifier dialog before every characteristic or skill roll.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });
}

async function _preloadTemplates() {
  return foundry.applications.handlebars.loadTemplates([
    // Actor sheets
    `systems/${SYSTEM_ID}/templates/actors/character-sheet.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/npc-sheet.hbs`,
    // Partials
    `systems/${SYSTEM_ID}/templates/actors/partials/characteristics.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/skills-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/talents-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/gear-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/wounds-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/psychic-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/biography-tab.hbs`,
    // Item sheets
    `systems/${SYSTEM_ID}/templates/items/item-sheet.hbs`,
    `systems/${SYSTEM_ID}/templates/items/partials/weapon-fields.hbs`,
    `systems/${SYSTEM_ID}/templates/items/partials/armour-fields.hbs`,
    `systems/${SYSTEM_ID}/templates/items/partials/skill-fields.hbs`,
    `systems/${SYSTEM_ID}/templates/items/partials/talent-fields.hbs`,
    `systems/${SYSTEM_ID}/templates/items/partials/psychic-fields.hbs`,
    // Chat cards
    `systems/${SYSTEM_ID}/templates/chat/test-result.hbs`,
    `systems/${SYSTEM_ID}/templates/chat/damage-result.hbs`,
    `systems/${SYSTEM_ID}/templates/chat/profit-factor.hbs`,
    // Dialogs
    `systems/${SYSTEM_ID}/templates/dialogs/xp-dialog.hbs`,
    // Career tab + dialogs
    `systems/${SYSTEM_ID}/templates/actors/partials/career-tab.hbs`,
    `systems/${SYSTEM_ID}/templates/dialogs/career-select.hbs`,
    `systems/${SYSTEM_ID}/templates/dialogs/custom-career.hbs`,
    // Voidship sheets
    `systems/${SYSTEM_ID}/templates/actors/voidship-sheet.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/voidship-overview.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/voidship-weapons.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/voidship-components.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/voidship-crew.hbs`,
    `systems/${SYSTEM_ID}/templates/actors/partials/voidship-biography.hbs`,
    // Voidship chat
    `systems/${SYSTEM_ID}/templates/chat/voidship-weapon.hbs`,
    // Psychic power and opposed test
    `systems/${SYSTEM_ID}/templates/chat/psychic-power.hbs`,
    `systems/${SYSTEM_ID}/templates/chat/opposed-test.hbs`,
  ]);
}
