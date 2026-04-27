/**
 * rogue-trader-unofficial | profit-factor.js
 *
 * Profit Factor (PF) system from RT Core Rulebook Chapter VI (pp.242–247).
 *
 * ACQUISITION ROLL
 *   Target = (PF × 5) + Modifiers
 *   Roll d100 equal-or-under to acquire.
 *   If the item's Availability rating is SCARCE or worse, acquiring it
 *   permanently lowers PF by 1d5 (rolled secretly by the GM, but we let the
 *   player roll it here for transparency). This is called "PF Strain".
 *
 * COMMERCE SKILL MODIFIER
 *   Degrees of Success on a Fel-based Commerce Test grant +10 per DoS (max +30).
 *   Degrees of Failure apply –10 per DoF.
 *
 * AVAILABILITY TARGET MODIFIERS (p.243, Table 6-1)
 *   Plentiful:   +30
 *   Common:      +20
 *   Average:     +10
 *   Scarce:        0
 *   Rare:        –10
 *   Very Rare:   –20
 *   Near Unique: –30
 *   Unique:      Roleplaying only; no roll
 *
 * PF STRAIN (items Scarce or worse)
 *   After a successful acquisition of a Scarce/Rare/Very Rare/Near-Unique item,
 *   roll 1d5 and subtract from current PF.
 */

import { sendTestToChat } from "./characteristic-roll.js";

const AVAILABILITY_MODS = {
  plentiful:  +30,
  common:     +20,
  average:    +10,
  scarce:       0,
  rare:       -10,
  veryRare:   -20,
  nearUnique: -30,
  unique:     null,   // null = no acquisition roll; must roleplay
};

const STRAIN_AVAILABILITIES = new Set(["scarce", "rare", "veryRare", "nearUnique"]);

/**
 * Run a full Profit Factor Acquisition roll.
 * Presents a dialog for availability and optional modifier, then resolves.
 *
 * @param {Actor} actor  The Explorer whose PF is used.
 */
export async function rollProfitFactor(actor) {
  const pf = actor.system.profitFactor?.total ?? 40;

  // ── Step 1: Show the acquisition parameters dialog ─────────────────────────
  const params = await _acquisitionDialog(actor, pf);
  if (!params) return;

  const { availability, commerceMod, miscMod, itemName } = params;

  if (availability === "unique") {
    ui.notifications.info("Unique items cannot be acquired by roll — speak to your GM.");
    return;
  }

  const avMod   = AVAILABILITY_MODS[availability] ?? 0;
  const totalMod = avMod + commerceMod + miscMod;
  const target   = (pf * 5) + totalMod;

  // ── Step 2: Roll d100 ───────────────────────────────────────────────────────
  const roll = new Roll("1d100");
  await roll.evaluate();
  const result = roll.total;

  const success = result <= Math.max(target, 1);
  const autoCrit = result <= 5;
  const autoFail = result >= 96;

  let degrees;
  if (autoCrit)           degrees = +1;
  else if (autoFail)      degrees = -1;
  else if (result <= target) degrees = Math.max(1, Math.floor((target - result) / 10));
  else                    degrees = -Math.max(1, Math.floor((result - target) / 10));

  // ── Step 3: PF Strain on scarce+ acquisitions ───────────────────────────────
  let strainRoll  = null;
  let strainAmount = 0;

  if (success && STRAIN_AVAILABILITIES.has(availability)) {
    const sr = new Roll("1d5");
    await sr.evaluate();
    strainRoll   = sr;
    strainAmount = sr.total;

    const newPF = Math.max(0, pf - strainAmount);
    await actor.update({ "system.profitFactor.total": newPF });
  }

  // ── Step 4: Chat message ────────────────────────────────────────────────────
  await _sendPFChatMessage(actor, {
    itemName:     itemName || "Item",
    availability,
    pf,
    target,
    totalMod,
    avMod,
    commerceMod,
    miscMod,
    result,
    success,
    autoCrit,
    autoFail,
    degrees,
    strainRoll,
    strainAmount,
    roll,
  });
}

// ---------------------------------------------------------------------------
// Acquisition parameters dialog
// ---------------------------------------------------------------------------

function _acquisitionDialog(actor, pf) {
  return new Promise((resolve) => {
    const availabilityOptions = Object.entries({
      plentiful:  "Plentiful (+30)",
      common:     "Common (+20)",
      average:    "Average (+10)",
      scarce:     "Scarce (±0) ⚠ PF Strain",
      rare:       "Rare (–10) ⚠ PF Strain",
      veryRare:   "Very Rare (–20) ⚠ PF Strain",
      nearUnique: "Near Unique (–30) ⚠ PF Strain",
      unique:     "Unique (Roleplay only)",
    }).map(([v, l]) => `<option value="${v}">${l}</option>`).join("");

    const content = `
      <form class="rt-pf-dialog">
        <div class="form-group">
          <label>Item Name (optional)</label>
          <input type="text" name="itemName" placeholder="e.g. Plasma Pistol" />
        </div>
        <div class="form-group">
          <label>Availability</label>
          <select name="availability">${availabilityOptions}</select>
        </div>
        <div class="form-group">
          <label>Commerce Test Modifier</label>
          <input type="number" name="commerceMod" value="0" step="10" />
          <p class="hint">+10 per DoS on a Commerce test (max +30), –10 per DoF.</p>
        </div>
        <div class="form-group">
          <label>Other Modifier</label>
          <input type="number" name="miscMod" value="0" />
          <p class="hint">GM-assigned situational modifiers.</p>
        </div>
        <p class="pf-summary">
          Current PF: <strong>${pf}</strong> — Base target: <strong>${pf * 5}%</strong>
        </p>
      </form>`;

    new Dialog({
      title:   "Profit Factor — Acquisition Roll",
      content,
      buttons: {
        roll: {
          icon:  "<i class='fa-solid fa-coins'></i>",
          label: "Roll Acquisition",
          callback: (html) => {
            resolve({
              itemName:    html.find("[name='itemName']").val()?.trim(),
              availability: html.find("[name='availability']").val(),
              commerceMod:  parseInt(html.find("[name='commerceMod']").val(), 10) || 0,
              miscMod:      parseInt(html.find("[name='miscMod']").val(), 10) || 0,
            });
          },
        },
        cancel: {
          label: "Cancel",
          callback: () => resolve(null),
        },
      },
      default: "roll",
      close:   () => resolve(null),
    }).render(true);
  });
}

// ---------------------------------------------------------------------------
// Chat message
// ---------------------------------------------------------------------------

async function _sendPFChatMessage(actor, data) {
  const template = `systems/rogue-trader-unofficial/templates/chat/profit-factor.hbs`;
  const content  = await renderTemplate(template, data);

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    rolls:   data.strainRoll
               ? [data.roll, data.strainRoll]
               : [data.roll],
    type: CONST.CHAT_MESSAGE_STYLES.ROLL,
  });
}
