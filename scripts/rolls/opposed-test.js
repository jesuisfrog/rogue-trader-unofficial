/**
 * rogue-trader-unofficial | opposed-test.js
 *
 * Opposed Tests (RT Core p.234)
 *
 * Both sides roll a d100 test against their relevant characteristic.
 * The winner is whoever:
 *   1. Succeeded while the other failed; OR
 *   2. Both succeeded — the one with more Degrees of Success wins
 *      (ties broken by the higher raw characteristic value).
 *   3. Both failed — the one with fewer Degrees of Failure wins
 *      (ties go to the defender / second party).
 *
 * Common Opposed Tests in RT:
 *   Deceive (Fel)      vs  Scrutiny (Per)
 *   Concealment (Ag)   vs  Awareness (Per)
 *   Intimidate (S/WP)  vs  WP
 *   Grapple (S)        vs  S or Ag
 *   Command (Fel)      vs  WP (boarding — attacker vs defender)
 *   Psyniscience (Per) vs  WP  (opposed psychic)
 */

import { rollCharacteristicTest } from "./characteristic-roll.js";

const SYSTEM_ID = "rogue-trader-unofficial";

const CHAR_LABELS = {
  ws: "Weapon Skill", bs: "Ballistic Skill", str: "Strength",
  t: "Toughness",     ag: "Agility",         int: "Intelligence",
  per: "Perception",  wp: "Willpower",        fel: "Fellowship",
};

// ---------------------------------------------------------------------------
// Main entry point — prompts both actors then resolves
// ---------------------------------------------------------------------------

/**
 * Run an Opposed Test between two actors.
 * Called from a macro or sheet button.
 *
 * @param {Actor} attacker   Initiating actor.
 * @param {Actor} defender   Resisting actor.
 * @param {object} [opts]
 * @param {string} [opts.attackerLabel]   e.g. "Deceive"
 * @param {string} [opts.defenderLabel]   e.g. "Scrutiny"
 */
export async function rollOpposedTest(attacker, defender, opts = {}) {
  const params = await _promptOpposedTest(attacker, defender, opts);
  if (!params) return;

  const { aChar, aMod, dChar, dMod, label } = params;

  // Roll both sides
  const [aResult, dResult] = await Promise.all([
    rollCharacteristicTest(_getCharValue(attacker, aChar), aMod),
    rollCharacteristicTest(_getCharValue(defender, dChar), dMod),
  ]);

  // Resolve outcome
  const outcome = _resolveOpposed(aResult, dResult, attacker, defender, aChar, dChar);

  // Send to chat
  await _sendOpposedChat(attacker, defender, {
    label,
    aChar, aMod, aResult,
    dChar, dMod, dResult,
    outcome,
  });
}

// ---------------------------------------------------------------------------
// Resolution logic
// ---------------------------------------------------------------------------

function _resolveOpposed(aResult, dResult, attacker, defender, aChar, dChar) {
  if (aResult.success && !dResult.success) {
    return {
      winner: "attacker",
      winnerName: attacker.name,
      loserName:  defender.name,
      margin:     aResult.degrees,
      reason:     "Attacker succeeded; defender failed.",
    };
  }

  if (!aResult.success && dResult.success) {
    return {
      winner: "defender",
      winnerName: defender.name,
      loserName:  attacker.name,
      margin:     Math.abs(dResult.degrees),
      reason:     "Defender succeeded; attacker failed.",
    };
  }

  if (!aResult.success && !dResult.success) {
    // Both failed — fewer DoF wins; ties go to defender
    const aDoF = Math.abs(aResult.degrees);
    const dDoF = Math.abs(dResult.degrees);
    if (aDoF < dDoF) {
      return {
        winner: "attacker",
        winnerName: attacker.name,
        loserName:  defender.name,
        margin:     dDoF - aDoF,
        reason:     "Both failed; attacker had fewer Degrees of Failure.",
      };
    }
    return {
      winner: "defender",
      winnerName: defender.name,
      loserName:  attacker.name,
      margin:     aDoF - dDoF,
      reason:     "Both failed; defender wins ties.",
    };
  }

  // Both succeeded — more DoS wins
  const aDoS = aResult.degrees;
  const dDoS = dResult.degrees;

  if (aDoS > dDoS) {
    return {
      winner: "attacker",
      winnerName: attacker.name,
      loserName:  defender.name,
      margin:     aDoS - dDoS,
      reason:     `Attacker won by ${aDoS - dDoS} Degree${aDoS - dDoS !== 1 ? "s" : ""} of Success.`,
    };
  }

  if (dDoS > aDoS) {
    return {
      winner: "defender",
      winnerName: defender.name,
      loserName:  attacker.name,
      margin:     dDoS - aDoS,
      reason:     `Defender won by ${dDoS - aDoS} Degree${dDoS - aDoS !== 1 ? "s" : ""} of Success.`,
    };
  }

  // Tied DoS — break by raw characteristic
  const aRaw = _getCharValue(attacker, aChar);
  const dRaw = _getCharValue(defender, dChar);

  if (aRaw > dRaw) {
    return {
      winner: "attacker",
      winnerName: attacker.name,
      loserName:  defender.name,
      margin:     0,
      reason:     `Tied DoS; attacker wins by higher characteristic (${aRaw} vs ${dRaw}).`,
    };
  }

  return {
    winner: "defender",
    winnerName: defender.name,
    loserName:  attacker.name,
    margin:     0,
    reason:     "Tied DoS; defender wins ties.",
  };
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

function _promptOpposedTest(attacker, defender, opts) {
  const charOpts = Object.entries(CHAR_LABELS)
    .map(([k, v]) => `<option value="${k}">${v}</option>`)
    .join("");

  const aDefault = opts.attackerChar || "fel";
  const dDefault = opts.defenderChar || "per";

  return new Promise((resolve) => {
    new Dialog({
      title:   `Opposed Test: ${attacker.name} vs ${defender.name}`,
      content: `
        <form class="rt-pf-dialog">
          <p style="font-weight:bold;margin-bottom:8px;">
            ${attacker.name} <span style="color:#888">vs</span> ${defender.name}
          </p>

          <div class="form-group">
            <label>Label / Context</label>
            <input type="text" name="label" value="${opts.label || 'Opposed Test'}" />
          </div>

          <hr style="margin:8px 0;" />
          <p style="font-size:11px;font-weight:bold;color:#555">ATTACKER — ${attacker.name}</p>

          <div class="form-group">
            <label>Characteristic</label>
            <select name="aChar">
              ${Object.entries(CHAR_LABELS).map(([k, v]) =>
                `<option value="${k}" ${k === aDefault ? "selected" : ""}>${v}</option>`
              ).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Modifier</label>
            <input type="number" name="aMod" value="${opts.attackerMod || 0}" />
          </div>

          <hr style="margin:8px 0;" />
          <p style="font-size:11px;font-weight:bold;color:#555">DEFENDER — ${defender.name}</p>

          <div class="form-group">
            <label>Characteristic</label>
            <select name="dChar">
              ${Object.entries(CHAR_LABELS).map(([k, v]) =>
                `<option value="${k}" ${k === dDefault ? "selected" : ""}>${v}</option>`
              ).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>Modifier</label>
            <input type="number" name="dMod" value="${opts.defenderMod || 0}" />
          </div>
        </form>`,
      buttons: {
        roll: {
          icon:  "<i class='fa-solid fa-dice-d20'></i>",
          label: "Roll Opposed Test",
          callback: (html) => resolve({
            label:  html.find("[name='label']").val()?.trim() || "Opposed Test",
            aChar:  html.find("[name='aChar']").val(),
            aMod:   parseInt(html.find("[name='aMod']").val(), 10) || 0,
            dChar:  html.find("[name='dChar']").val(),
            dMod:   parseInt(html.find("[name='dMod']").val(), 10) || 0,
          }),
        },
        cancel: { label: "Cancel", callback: () => resolve(null) },
      },
      default: "roll",
      close:   () => resolve(null),
    }).render(true);
  });
}

// ---------------------------------------------------------------------------
// Chat output
// ---------------------------------------------------------------------------

async function _sendOpposedChat(attacker, defender, data) {
  const template = `systems/${SYSTEM_ID}/templates/chat/opposed-test.hbs`;
  const content  = await renderTemplate(template, {
    attacker,
    defender,
    ...data,
    charLabels: CHAR_LABELS,
  });

  await ChatMessage.create({
    speaker: { alias: `${attacker.name} vs ${defender.name}` },
    content,
    rolls:   [data.aResult._roll, data.dResult._roll],
    type:    CONST.CHAT_MESSAGE_STYLES.ROLL,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _getCharValue(actor, key) {
  const char = actor.system.characteristics?.[key];
  if (!char) return 25;
  return (char.base || 0) + (char.advances || 0) * 5 + (char.modifier || 0);
}
