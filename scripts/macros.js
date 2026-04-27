/**
 * rogue-trader-unofficial | macros.js
 *
 * Pre-built macro functions registered on game.rogueTrader.
 * These are called by compendium macros and can also be used directly
 * from the Foundry macro console.
 *
 * Usage from a macro:
 *   game.rogueTrader.rollOpposed();
 *   game.rogueTrader.rollFocusPower();
 *   game.rogueTrader.rollAcquisition();
 *   game.rogueTrader.rollCharacteristic();
 *   game.rogueTrader.spendXP();
 */

import { rollOpposedTest }            from "./rolls/opposed-test.js";
import { rollFocusPower, promptFocusPower } from "./rolls/psychic-roll.js";
import { rollProfitFactor }            from "./rolls/profit-factor.js";
import { rollCharacteristicTest, sendTestToChat, promptModifier } from "./rolls/characteristic-roll.js";
import { openXPDialog }                from "./rolls/xp-dialog.js";

const CHAR_LABELS = {
  ws: "Weapon Skill", bs: "Ballistic Skill", str: "Strength",
  t: "Toughness",     ag: "Agility",         int: "Intelligence",
  per: "Perception",  wp: "Willpower",        fel: "Fellowship",
};

// ---------------------------------------------------------------------------
// Macro entry points
// ---------------------------------------------------------------------------

/**
 * Roll an Opposed Test between two selected/targeted tokens.
 * Requires exactly one controlled token (attacker) and one targeted token (defender).
 */
export async function macroRollOpposed() {
  const attacker = _getControlledActor("Select your character's token to initiate an Opposed Test.");
  if (!attacker) return;

  const targets = [...game.user.targets];
  if (targets.length !== 1) {
    ui.notifications.warn("Target exactly one token for the opposing party.");
    return;
  }

  const defender = targets[0].actor;
  if (!defender) {
    ui.notifications.warn("Target token has no linked actor.");
    return;
  }

  await rollOpposedTest(attacker, defender);
}

/**
 * Roll a Focus Power test for the selected psyker token.
 * Opens a dialog to choose strength, push amount, and modifiers.
 */
export async function macroRollFocusPower() {
  const actor = _getControlledActor("Select your psyker's token to use a psychic power.");
  if (!actor) return;

  const pr = actor.system.psy?.rating ?? 0;
  if (pr === 0) {
    ui.notifications.warn(`${actor.name} has no Psy Rating and cannot use psychic powers.`);
    return;
  }

  // Pick the power
  const powerName = await _promptText("Psychic Power", "Power Name:", "Psychic Power");
  if (powerName === null) return;

  const opts = await promptFocusPower(actor, powerName);
  if (!opts) return;

  await rollFocusPower(actor, { powerName, ...opts,
    psykerClass: (actor.system.psy?.class === "unbound") ? "renegade" : "sanctioned" });
}

/**
 * Roll a Profit Factor Acquisition test for the selected actor.
 */
export async function macroRollAcquisition() {
  const actor = _getControlledActor("Select your Explorer's token to roll an Acquisition.");
  if (!actor) return;

  await rollProfitFactor(actor);
}

/**
 * Roll a specific characteristic test for the selected actor.
 * Opens a quick picker for which characteristic to test.
 */
export async function macroRollCharacteristic() {
  const actor = _getControlledActor("Select a token to make a Characteristic Test.");
  if (!actor) return;

  const charKey = await _promptCharSelect();
  if (!charKey) return;

  const char  = actor.system.characteristics?.[charKey];
  if (!char)  return;

  const value  = (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
  const label  = CHAR_LABELS[charKey] ?? charKey;
  const mod    = await promptModifier(`${label} Test`);
  if (mod === null) return;

  const result = await rollCharacteristicTest(value, mod);
  await sendTestToChat(actor, label, result);
}

/**
 * Open the XP Spend dialog for the selected actor.
 */
export async function macroSpendXP() {
  const actor = _getControlledActor("Select your Explorer's token to spend XP.");
  if (!actor) return;

  if (actor.type !== "character") {
    ui.notifications.warn("XP can only be spent on Explorer characters.");
    return;
  }

  await openXPDialog(actor);
}

/**
 * Roll 2d10+25 for all nine characteristics (character creation helper).
 */
export async function macroGenerateCharacteristics() {
  const roll = new Roll("9d10");
  await roll.evaluate();

  const results = roll.dice[0].results.map(r => r.result + 25);
  const labels  = Object.values(CHAR_LABELS);

  const rows = labels.map((label, i) =>
    `<tr><td>${label}</td><td style="font-weight:bold;text-align:center">${results[i] ?? "—"}</td></tr>`
  ).join("");

  const content = `
    <div class="rt-chat-card">
      <div class="card-header" style="padding:8px 10px;background:var(--rt-dark,#1a1512);border-bottom:2px solid #b8882a">
        <div class="card-title-block">
          <span style="color:#b8882a;font-size:12px;text-transform:uppercase">Character Creation</span>
          <span style="color:#e8d9b4;font-weight:bold">Characteristic Rolls (2d10+25)</span>
        </div>
      </div>
      <div class="card-body" style="padding:8px 12px">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr>
              <th style="border-bottom:1px solid #b8882a;text-align:left;padding:2px 4px;color:#888">Characteristic</th>
              <th style="border-bottom:1px solid #b8882a;text-align:center;padding:2px 4px;color:#888">Value</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin:6px 0 0;font-size:11px;color:#888;font-style:italic">
          Assign these values to characteristics as desired per character concept.
          Note: The rules use 2d10+25; re-roll any result of 1.
        </p>
      </div>
    </div>`;

  await ChatMessage.create({ content });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _getControlledActor(warningMsg) {
  const controlled = canvas.tokens?.controlled;
  if (!controlled?.length) {
    // Fall back to assigned character
    if (game.user.character) return game.user.character;
    ui.notifications.warn(warningMsg);
    return null;
  }
  if (controlled.length > 1) {
    ui.notifications.warn("Select exactly one token.");
    return null;
  }
  const actor = controlled[0].actor;
  if (!actor) {
    ui.notifications.warn("Selected token has no linked actor.");
    return null;
  }
  return actor;
}

function _promptText(title, label, defaultValue = "") {
  return new Promise((resolve) => {
    new Dialog({
      title,
      content: `<div class="form-group" style="padding:6px">
        <label>${label}</label>
        <input type="text" name="value" value="${defaultValue}" autofocus />
      </div>`,
      buttons: {
        ok:     { label: "OK",     callback: (html) => resolve(html.find("[name='value']").val()?.trim() || defaultValue) },
        cancel: { label: "Cancel", callback: () => resolve(null) },
      },
      default: "ok",
      close:   () => resolve(null),
    }).render(true);
  });
}

function _promptCharSelect() {
  const opts = Object.entries(CHAR_LABELS)
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join("");

  return new Promise((resolve) => {
    new Dialog({
      title:   "Select Characteristic",
      content: `<div class="form-group" style="padding:6px">
        <label>Characteristic</label>
        <select name="char">${opts}</select>
      </div>`,
      buttons: {
        ok:     { label: "Roll",   callback: (html) => resolve(html.find("[name='char']").val()) },
        cancel: { label: "Cancel", callback: () => resolve(null) },
      },
      default: "ok",
      close:   () => resolve(null),
    }).render(true);
  });
}
