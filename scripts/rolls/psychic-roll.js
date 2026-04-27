/**
 * rogue-trader-unofficial | psychic-roll.js
 *
 * Focus Power resolution for Rogue Trader psykers (Table 6-1 — 6-3).
 *
 * HOW FOCUS POWER WORKS (p.157-160)
 *
 * Focus Power Score = Willpower + (Psy Rating × 5)
 * Roll d100 equal-or-under to succeed. A result of 100 always fails.
 *
 * PSYCHIC STRENGTH modes:
 *   Fettered:   PR/2 (round up) — no phenomena check ever.
 *   Unfettered: Full PR — phenomena on doubles (matching tens/units digit).
 *   Push:       PR + 1–3 — always rolls on phenomena table (+5 per extra PR).
 *
 * PSYCHIC PHENOMENA (Table 6-2, p.160)
 *   Roll 1d100. 01-74 = minor phenomena. 75+ = Perils of the Warp.
 *   Multiple sustained powers: +10 per additional sustained power.
 *   Renegade psykers: +5 per PR used (unfettered), +10 per PR (pushed).
 *
 * PERILS OF THE WARP (Table 6-3, p.161)
 *   Roll 1d100 when phenomena result is 75+.
 */

// ---------------------------------------------------------------------------
// Tables (verbatim from rulebook)
// ---------------------------------------------------------------------------

export const PSYCHIC_PHENOMENA = [
  { min: 1,  max: 3,  name: "Dark Foreboding",         effect: "A faint breeze blows past. Everyone gets the feeling that somewhere in the galaxy, something unfortunate just happened." },
  { min: 4,  max: 5,  name: "Warp Echo",                effect: "For a few seconds, all noises cause echoes, regardless of the surroundings." },
  { min: 6,  max: 8,  name: "Unholy Stench",            effect: "The air around the psyker becomes permeated with a bizarre and foul smell." },
  { min: 9,  max: 11, name: "Mind Warp",                effect: "The psyker suffers 1 Insanity Point as phobias, suspicions, and hatreds surge to the surface of their mind." },
  { min: 12, max: 14, name: "Hoarfrost",                effect: "The temperature plummets; a thin coating of frost covers everything within 3d10 metres." },
  { min: 15, max: 17, name: "Aura of Taint",            effect: "All animals within 1d100 metres become spooked and agitated. Characters with Psyniscience can pinpoint the psyker." },
  { min: 18, max: 20, name: "Memory Worm",              effect: "All people within line of sight of the psyker forget something trivial." },
  { min: 21, max: 23, name: "Spoilage",                 effect: "Food and drink go bad in a 5d10 metre radius." },
  { min: 24, max: 26, name: "Haunting Breeze",          effect: "Winds whip up for a few seconds, blowing light objects about and guttering fires within 3d10 metres." },
  { min: 27, max: 29, name: "Veil of Darkness",         effect: "The area within 3d10 metres is plunged into immediate darkness for the remainder of the round." },
  { min: 30, max: 32, name: "Distorted Reflections",    effect: "Mirrors and reflective surfaces within 5d10 metres distort or shatter." },
  { min: 33, max: 35, name: "Breath Leech",             effect: "Everyone (including the psyker) becomes short of breath for one round and cannot Run or Charge." },
  { min: 36, max: 38, name: "Daemonic Mask",            effect: "The psyker takes on a daemonic appearance, gaining Fear (1) for the rest of the round and 1 Corruption Point." },
  { min: 39, max: 41, name: "Unnatural Decay",          effect: "All plant-life within 3d10 metres of the psyker withers and dies." },
  { min: 42, max: 44, name: "Spectral Gale",            effect: "Howling winds erupt. Everyone within 4d10 metres must make an Easy (+30) Agility or Strength Test or be knocked down." },
  { min: 45, max: 47, name: "Bloody Tears",             effect: "Blood weeps from stone and wood within 3d10 metres. Statues and pictures appear to cry blood." },
  { min: 48, max: 50, name: "The Earth Protests",       effect: "The ground shakes. Everyone within 5d10 metres must pass a Routine (+10) Agility Test or be knocked down." },
  { min: 51, max: 53, name: "Psy Discharge",            effect: "Static electricity fills 5d10 metres, shorting unprotected electronics, while the psyker is illuminated by eldritch light." },
  { min: 54, max: 56, name: "Warp Ghosts",              effect: "Ghostly apparitions fill 3d10 metres, howling. Everyone in the radius (except the psyker) must test against Fear (1)." },
  { min: 57, max: 59, name: "Falling Upwards",          effect: "Everything within 2d10 metres rises 1d10 metres as gravity briefly ceases, then crashes back." },
  { min: 60, max: 62, name: "Banshee Howl",             effect: "A shrill keening shatters glass. Every mortal creature within earshot must pass a Toughness Test (+0) or be deafened for 1d10 rounds." },
  { min: 63, max: 65, name: "The Furies",               effect: "The psyker is assailed by unseen horrors, slammed to the ground and suffers 1d5 Wounds (Toughness protects, unwarded armour does not). Must test against Fear (2)." },
  { min: 66, max: 68, name: "Shadow of the Warp",       effect: "The world briefly shows its warp-shadow. Everyone within 1d100 metres must pass a Difficult (–10) Willpower Test or gain 1d5 Insanity Points." },
  { min: 69, max: 71, name: "Tech Scorn",               effect: "Machine spirits reject the psyker's ways. All un-warded tech devices within 5d10 metres malfunction; all ranged weapons Jam; cybernetic users must pass Toughness (+10) Test or suffer 1d5 damage." },
  { min: 72, max: 74, name: "Warp Madness",             effect: "All creatures within 2d10 metres (except the psyker) become Frenzied for one Round and suffer 1d5 Corruption Points unless they pass a Difficult (–10) Willpower Test." },
  { min: 75, max: 100, name: "Perils of the Warp",      effect: "The warp opens in a maelstrom of energy. Roll on the Perils of the Warp table." },
];

export const PERILS_OF_THE_WARP = [
  { min: 1,  max: 5,  name: "The Gibbering",             effect: "The psyker screams as warp energies surge through them. Must pass a Challenging (+0) Willpower Test or suffer 1d5+1 Insanity Points and is Stunned for 1d5 rounds." },
  { min: 6,  max: 9,  name: "Warp Burn",                 effect: "A violent burst of energy smashes the psyker's mind. Suffers 1d5 Wounds and is Stunned for 1d5 Rounds." },
  { min: 10, max: 13, name: "Psychic Concussion",        effect: "Knocked unconscious for 1d5 Rounds with a crack of energy. Everyone within 3d10 metres must pass a Routine (+10) Willpower Test or be Stunned for one Round." },
  { min: 14, max: 18, name: "Psy-Blast",                 effect: "An explosion of power throws the psyker 1d10 metres into the air, then falling to the ground (see Falling Damage)." },
  { min: 19, max: 24, name: "Soul Sear",                 effect: "Warp power scorches the psyker's soul. They cannot use any psychic powers for one hour and suffer 5 Corruption Points." },
  { min: 25, max: 30, name: "Locked In",                 effect: "The psyker falls into a catatonic state. Each Round they must use a Full Action to Test Willpower. On a success their mind is freed." },
  { min: 31, max: 38, name: "Chronological Incontinence",effect: "Time warps around the psyker. They vanish and reappear in 1d10 Rounds (or 1 minute narrative time), suffering 1d5 Insanity and 1d5 permanent Toughness damage." },
  { min: 39, max: 46, name: "Psychic Mirror",            effect: "The psyker's power is turned back on them. Resolve as normal but targeting the psyker. If beneficial, deals 1d10+5 Energy Damage instead (armour ignored unless warded)." },
  { min: 47, max: 55, name: "Warp Whispers",             effect: "Daemon voices fill 4d10 metres. Everyone (including the psyker) must pass a Hard (–20) Willpower Test or suffer 1d10 Corruption Points." },
  { min: 56, max: 58, name: "Vice Versa",                effect: "The psyker's mind is thrown into another creature within 50 metres; consciousnesses swap for 1d10 Rounds. Both suffer 1d5 Insanity. If no valid target, the psyker must Test Willpower or become catatonic for 1d5 Rounds (gaining 2d10 Insanity)." },
  { min: 59, max: 67, name: "Dark Summoning",            effect: "A Warp Predator rips into existence within 3d10 metres for 1d10 rounds (or until slain). It detests the psyker and focuses attacks on them." },
  { min: 68, max: 72, name: "Rending the Veil",          effect: "Cackling daemons appear; the warp is made visible. All sentient creatures within 1d100 metres must test against Fear (3). Lasts 1d5 rounds." },
  { min: 73, max: 78, name: "Blood Rain",                effect: "A psychic storm covers 5d10 metres. Everyone must pass a Challenging (+0) Strength Test or be knocked down. Any powers used in the area auto-invoke Perils for 1d5 Rounds." },
  { min: 79, max: 82, name: "Cataclysmic Blast",         effect: "Power overloads in great bolts. Anyone within 1d10 metres (including psyker) takes 1d10+5 Energy Damage. All psyker's gear is destroyed. No further powers for 1d5 hours." },
  { min: 83, max: 86, name: "Mass Possession",           effect: "Daemons ravage every living thing within 1d100 metres. Each character must resist as if attacked by Puppet Master (attacker's WP/Int/Fel = 60) for 2d10 rounds." },
  { min: 87, max: 100,name: "Reality Quake",             effect: "Reality buckles in a 3d10 metre radius; solid matter shifts. GM determines precise effects — structures may collapse, floors open, or worse." },
];

// ---------------------------------------------------------------------------
// Table lookup helpers
// ---------------------------------------------------------------------------

export function lookupPhenomena(roll) {
  return PSYCHIC_PHENOMENA.find(e => roll >= e.min && roll <= e.max) ?? PSYCHIC_PHENOMENA.at(-1);
}

export function lookupPerils(roll) {
  return PERILS_OF_THE_WARP.find(e => roll >= e.min && roll <= e.max) ?? PERILS_OF_THE_WARP.at(-1);
}

/** True if the two digits of a d100 roll are identical (doubles). */
export function isDoubles(roll) {
  const r = roll === 100 ? 100 : roll;
  const tens  = Math.floor(r / 10);
  const units = r % 10;
  // 11, 22, 33 … 99 are doubles; 00 (=100) counts as doubles
  return (r === 100) || (tens === units && tens !== 0);
}

// ---------------------------------------------------------------------------
// Main Focus Power roll function
// ---------------------------------------------------------------------------

/**
 * Roll a Focus Power Test for a psyker.
 *
 * @param {Actor}  actor     The psyker actor.
 * @param {object} opts
 * @param {string} opts.powerName       Display name of the power.
 * @param {string} opts.strength        "fettered" | "unfettered" | "push"
 * @param {number} opts.pushAmount      Extra PR added when pushing (1–3 sanctioned, 1–4 renegade).
 * @param {string} opts.psykerClass     "sanctioned" | "renegade"
 * @param {number} opts.sustainedCount  Number of OTHER powers currently sustained.
 * @param {number} opts.modifier        Extra modifier to Focus Power score.
 */
export async function rollFocusPower(actor, opts = {}) {
  const {
    powerName     = "Psychic Power",
    strength      = "unfettered",
    pushAmount    = 0,
    psykerClass   = "sanctioned",
    sustainedCount = 0,
    modifier       = 0,
  } = opts;

  const sys = actor.system;
  const wpBase   = sys.characteristics?.wp;
  const wpValue  = wpBase
    ? (wpBase.base || 0) + (wpBase.advances || 0) * 5 + (wpBase.modifier || 0)
    : 30;
  const prBase   = sys.psy?.rating ?? 1;

  // Effective PR by mode
  let effectivePR;
  if (strength === "fettered") {
    effectivePR = Math.ceil(prBase / 2);
  } else if (strength === "push") {
    effectivePR = prBase + Math.min(pushAmount, psykerClass === "renegade" ? 4 : 3);
  } else {
    effectivePR = prBase;
  }

  // Focus Power score = WP + (effectivePR × 5)
  const baseScore = wpValue + effectivePR * 5 + modifier;
  const focusScore = Math.min(baseScore, 99); // 100 always fails

  // ---------------------------------------------------------------------------
  // Roll the d100
  // ---------------------------------------------------------------------------
  const roll = new Roll("1d100");
  await roll.evaluate();
  const result = roll.total;

  const autoCrit = result <= 5;
  const autoFail = result === 100;
  const success  = autoCrit || (!autoFail && result <= focusScore);
  const degrees  = success
    ? Math.max(1, Math.floor((focusScore - result) / 10))
    : -Math.max(1, Math.floor((result - focusScore) / 10));

  // ---------------------------------------------------------------------------
  // Psychic Phenomena check
  // ---------------------------------------------------------------------------
  let phenomenaRoll   = null;
  let phenomenaResult = null;
  let perilsRoll      = null;
  let perilsResult    = null;

  const needsPhenomenaCheck = (() => {
    if (strength === "fettered") return false;
    if (strength === "push")     return true;
    // Unfettered: phenomena on doubles
    return isDoubles(result);
  })();

  if (needsPhenomenaCheck) {
    // Base phenomena roll
    let phenModifier = 0;

    // Sustained powers: +10 per additional sustained power
    phenModifier += sustainedCount * 10;

    // Push modifier: +5 per extra PR (sanctioned), +10 per extra PR (renegade)
    if (strength === "push" && pushAmount > 0) {
      phenModifier += pushAmount * (psykerClass === "renegade" ? 10 : 5);
    }

    // Renegade at unfettered: +5 per PR used
    if (strength === "unfettered" && psykerClass === "renegade") {
      phenModifier += effectivePR * 5;
    }

    const phenRoll = new Roll("1d100");
    await phenRoll.evaluate();
    phenomenaRoll   = phenRoll.total + phenModifier;
    phenomenaResult = lookupPhenomena(Math.min(phenomenaRoll, 100));

    // Perils triggered
    if (phenomenaRoll >= 75) {
      const perilsRollObj = new Roll("1d100");
      await perilsRollObj.evaluate();
      perilsRoll   = perilsRollObj.total;
      perilsResult = lookupPerils(perilsRoll);
    }
  }

  // ---------------------------------------------------------------------------
  // Send to chat
  // ---------------------------------------------------------------------------
  await _sendFocusPowerChat(actor, {
    powerName,
    strength,
    effectivePR,
    wpValue,
    focusScore,
    result,
    success,
    autoCrit,
    autoFail,
    degrees,
    phenomenaRoll,
    phenomenaResult,
    perilsRoll,
    perilsResult,
    roll,
  });

  return { success, degrees, phenomenaResult, perilsResult };
}

// ---------------------------------------------------------------------------
// Focus Power dialog
// ---------------------------------------------------------------------------

export function promptFocusPower(actor, powerName = "Psychic Power") {
  const prBase = actor.system.psy?.rating ?? 1;
  const psyClass = actor.system.psy?.class ?? "bound";
  const isRenegade = psyClass === "unbound";

  return new Promise((resolve) => {
    new Dialog({
      title: `Focus Power — ${powerName}`,
      content: `
        <form class="rt-pf-dialog">
          <div class="form-group">
            <label>Psychic Strength</label>
            <select name="strength">
              <option value="fettered">Fettered (PR/2 = ${Math.ceil(prBase/2)}, no phenomena)</option>
              <option value="unfettered" selected>Unfettered (PR ${prBase}, phenomena on doubles)</option>
              <option value="push">Push (PR +1 to +${isRenegade ? 4 : 3}, always roll phenomena)</option>
            </select>
          </div>
          <div class="form-group push-row" style="display:none">
            <label>Push Amount (+PR)</label>
            <input type="number" name="pushAmount" value="1" min="1" max="${isRenegade ? 4 : 3}" step="1" />
          </div>
          <div class="form-group">
            <label>Sustained Powers (others)</label>
            <input type="number" name="sustained" value="0" min="0" max="5" />
            <p class="hint">+10 to phenomena roll per sustained power.</p>
          </div>
          <div class="form-group">
            <label>Additional Modifier</label>
            <input type="number" name="modifier" value="0" />
            <p class="hint">Positive = easier, negative = harder.</p>
          </div>
          <p style="margin-top:6px;font-size:11px;color:#666;">
            Psy Rating: <strong>${prBase}</strong> &nbsp;|&nbsp;
            Psyker class: <strong>${isRenegade ? "Renegade" : "Sanctioned"}</strong>
          </p>
        </form>`,
      render: (html) => {
        html.find("[name='strength']").on("change", (e) => {
          html.find(".push-row").toggle(e.target.value === "push");
        });
      },
      buttons: {
        roll: {
          icon:  "<i class='fa-solid fa-brain'></i>",
          label: "Focus Power",
          callback: (html) => resolve({
            strength:      html.find("[name='strength']").val(),
            pushAmount:    parseInt(html.find("[name='pushAmount']").val(), 10) || 1,
            sustainedCount:parseInt(html.find("[name='sustained']").val(), 10)  || 0,
            modifier:      parseInt(html.find("[name='modifier']").val(), 10)   || 0,
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
// Chat message
// ---------------------------------------------------------------------------

async function _sendFocusPowerChat(actor, data) {
  const SYSTEM_ID = "rogue-trader-unofficial";
  const template  = `systems/${SYSTEM_ID}/templates/chat/psychic-power.hbs`;
  const content   = await renderTemplate(template, { actor, ...data });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content,
    rolls:   [data.roll],
    type:    CONST.CHAT_MESSAGE_STYLES.ROLL,
  });
}
