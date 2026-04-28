/**
 * rogue-trader-unofficial | combatant.js
 *
 * Overrides _getInitiativeFormula() so every combatant in the tracker
 * rolls their Agility Bonus as a flat number rather than 1d10.
 *
 * RT Initiative (Core p.234):
 *   Each participant rolls 1d10 and adds their Agility Bonus.
 *   The participant with the highest total acts first.
 *   Ties broken by the higher full Agility value.
 *
 * We encode this as:   1d10 + AB + (Ag / 1000)
 *
 * The /1000 fraction means full Ag silently breaks ties without
 * visually changing the displayed initiative value.
 */

export class RogueTraderCombatant extends Combatant {

  /** @override */
  _getInitiativeFormula() {
    const actor = this.actor;
    if (!actor) return "1d10";

    const ag = actor.system?.characteristics?.ag;
    if (!ag) return "1d10";

    // Use the pre-computed value from prepareData if available,
    // otherwise calculate it directly.
    const agValue = ag.value
      ?? (ag.base || 0) + (ag.advances || 0) * 5 + (ag.modifier || 0);

    const agBonus = Math.floor(agValue / 10);

    // 1d10 + AB + Ag/1000 (tiebreaker, invisible on the tracker)
    return `1d10 + ${agBonus} + ${agValue} / 1000`;
  }
}
