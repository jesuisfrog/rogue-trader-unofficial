/**
 * rogue-trader-unofficial | characteristic-roll.js
 *
 * Core test resolution for Rogue Trader / Dark Heresy family systems.
 *
 * HOW TESTS WORK:
 *   - Roll d100 (percentile: two d10, one = tens digit, one = units digit)
 *   - Result ≤ target number = success
 *   - Degrees of Success (DoS) = floor((target - roll) / 10)    [minimum 0]
 *   - Degrees of Failure (DoF) = floor((roll - target) / 10)    [minimum 0]
 *   - Roll of 01–05 = automatic success (no matter the target)
 *   - Roll of 96–00 = automatic failure (no matter the target)
 *   - Righteous Fury: on a damage roll result of "10" on any single die,
 *     reroll that die and add to damage (signalled by caller, not handled here)
 */

/**
 * @typedef {object} RTRollResult
 * @property {number}  roll          The d100 result (1-100)
 * @property {number}  target        Effective target number after modifier
 * @property {number}  modifier      Modifier applied
 * @property {boolean} success       True if the test passed
 * @property {boolean} autoCrit      True if result was 01-05
 * @property {boolean} autoFail      True if result was 96-100
 * @property {number}  degrees       Positive = DoS, negative = DoF
 */

/**
 * Roll a d100 Characteristic or Skill Test.
 *
 * @param {number} target    Base target (effective characteristic or skill value)
 * @param {number} modifier  Additional modifier (+/- applied to target)
 * @returns {RTRollResult}
 */
export async function rollCharacteristicTest(target, modifier = 0) {
  const roll = new Roll("1d100");
  await roll.evaluate();

  const result    = roll.total;
  const effective = target + modifier;
  const autoCrit  = result <= 5;
  const autoFail  = result >= 96;

  let success, degrees;

  if (autoCrit) {
    success = true;
    degrees = Math.max(1, Math.floor((effective - result) / 10));
  } else if (autoFail) {
    success = false;
    degrees = -Math.max(1, Math.floor((result - effective) / 10));
  } else if (result <= effective) {
    success = true;
    degrees = Math.max(1, Math.floor((effective - result) / 10));
  } else {
    success = false;
    degrees = -Math.max(1, Math.floor((result - effective) / 10));
  }

  return {
    roll: result,
    target,
    modifier,
    effective,
    success,
    autoCrit,
    autoFail,
    degrees,
    _roll: roll,
  };
}

/**
 * Roll damage (one or more dice of a given formula) and flag Righteous Fury.
 * Righteous Fury occurs when any individual die shows its maximum value (10 for d10).
 *
 * @param {string}  formula     e.g. "1d10+3", "2d10", "1d5+2"
 * @param {string}  damageType  "i" | "r" | "x" | "e"
 * @param {number}  pen         Penetration
 * @returns {{ total: number, formula: string, damageType: string, pen: number, righteousFury: boolean, _roll: Roll }}
 */
export async function rollDamage(formula, damageType, pen = 0) {
  const roll = new Roll(formula);
  await roll.evaluate();

  // Check any d10 showing max value
  const righteousFury = roll.dice.some(d => d.faces === 10 && d.results.some(r => r.result === 10));

  return {
    total: roll.total,
    formula,
    damageType,
    pen,
    righteousFury,
    _roll: roll,
  };
}

/**
 * Build and send the chat message for a Characteristic/Skill Test.
 *
 * @param {Actor}        actor     The rolling actor
 * @param {string}       label     Human-readable label (e.g. "Weapon Skill")
 * @param {RTRollResult} result    From rollCharacteristicTest()
 * @param {string}       [flavor]  Optional extra flavour text
 */
export async function sendTestToChat(actor, label, result, flavor = "") {
  const template = "systems/rogue-trader-unofficial/templates/chat/test-result.hbs";

  const content = await foundry.applications.handlebars.renderTemplate(template, {
    actor,
    label,
    result,
    flavor,
    i18n: {
      success:        game.i18n.localize("RT.Chat.Success"),
      failure:        game.i18n.localize("RT.Chat.Failure"),
      target:         game.i18n.localize("RT.Chat.Target"),
      roll:           game.i18n.localize("RT.Chat.Roll"),
      degreesSuccess: game.i18n.localize("RT.Chat.DegreesSuccess"),
      degreesFailure: game.i18n.localize("RT.Chat.DegreesFailure"),
      autoCrit:       game.i18n.localize("RT.Chat.CritText"),
      autoFail:       game.i18n.localize("RT.Chat.FumbleText"),
    },
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    rolls:   [result._roll],
  });
}

/**
 * Build and send the chat message for a Damage roll.
 */
export async function sendDamageToChat(actor, weaponName, damageResult) {
  const template = "systems/rogue-trader-unofficial/templates/chat/damage-result.hbs";

  const damageTypeLabels = {
    i: game.i18n.localize("RT.Items.DamageTypes.i"),
    r: game.i18n.localize("RT.Items.DamageTypes.r"),
    x: game.i18n.localize("RT.Items.DamageTypes.x"),
    e: game.i18n.localize("RT.Items.DamageTypes.e"),
  };

  const content = await renderTemplate(template, {
    actor,
    weaponName,
    damageResult,
    damageTypeLabel: damageTypeLabels[damageResult.damageType] ?? damageResult.damageType,
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    rolls:   [damageResult._roll],
    type:    CONST.CHAT_MESSAGE_STYLES.ROLL,
  });
}

/**
 * Present a quick dialog asking for an optional modifier before rolling.
 *
 * @param {string} title   Dialog title
 * @returns {Promise<number|null>} The modifier entered, or null if cancelled
 */
export function promptModifier(title) {
  return new Promise((resolve) => {
    const dialog = new Dialog({
      title,
      content: `
        <form class="rt-roll-dialog">
          <div class="form-group">
            <label>${game.i18n.localize("RT.Rolls.Modifier")}</label>
            <div class="form-fields">
              <input type="number" name="modifier" value="0" step="1" autofocus />
            </div>
            <p class="hint">${game.i18n.localize("RT.Rolls.ModifierHint")}</p>
          </div>
        </form>`,
      buttons: {
        roll: {
          icon:  "<i class='fa-solid fa-dice'></i>",
          label: "Roll",
          callback: (html) => {
            const val = parseInt(html.find("[name='modifier']").val(), 10);
            resolve(isNaN(val) ? 0 : val);
          },
        },
        cancel: {
          icon:  "<i class='fa-solid fa-times'></i>",
          label: "Cancel",
          callback: () => resolve(null),
        },
      },
      default: "roll",
      close:   () => resolve(null),
    });
    dialog.render(true);
  });
}
