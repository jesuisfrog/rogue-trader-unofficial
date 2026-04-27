/**
 * rogue-trader-unofficial | actor.js
 *
 * Extends the core Actor class to add:
 *  - prepareData()  — computes all derived values so templates never do raw math
 *  - Auto-sum of equipped armour AP per hit location
 *  - Movement from Agility Bonus
 *  - Rank from spent XP
 *  - Fatigue threshold
 */

export class RogueTraderActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override — called after base data is ready */
  prepareDerivedData() {
    const sys = this.system;

    this._prepareCharacteristics(sys);

    if (this.type === "character") this._prepareCharacterData(sys);
    if (this.type === "npc")       this._prepareNPCData(sys);
  }

  // ---------------------------------------------------------------------------
  // Shared — characteristics
  // ---------------------------------------------------------------------------

  _prepareCharacteristics(sys) {
    if (!sys.characteristics) return;

    for (const [key, char] of Object.entries(sys.characteristics)) {
      // Effective value: base + (advances × 5) + freeform modifier
      char.value = (char.base  || 0)
                 + (char.advances || 0) * 5
                 + (char.modifier || 0);
      // Characteristic Bonus (tens digit)
      char.bonus = Math.floor(char.value / 10);
    }
  }

  // ---------------------------------------------------------------------------
  // Character (Explorer)
  // ---------------------------------------------------------------------------

  _prepareCharacterData(sys) {
    const chars = sys.characteristics;

    // ── Movement (from Agility Bonus) ────────────────────────────────────────
    const ab = chars.ag?.bonus ?? 3;
    sys.movement = {
      half:   ab,
      full:   ab * 2,
      charge: ab * 3,
      run:    ab * 6,
    };

    // ── Rank from spent XP ───────────────────────────────────────────────────
    const spent = sys.experience?.spent ?? 0;
    sys.rank = RogueTraderActor.rankFromXP(spent);

    // ── Unspent XP ───────────────────────────────────────────────────────────
    sys.experience.unspent = Math.max(0, (sys.experience.total ?? 0) - spent);

    // ── Fatigue threshold (Toughness Bonus) ──────────────────────────────────
    sys.fatigueThreshold = chars.t?.bonus ?? 3;

    // ── Insanity bracket ─────────────────────────────────────────────────────
    sys.insanityBracket = RogueTraderActor.insanityBracket(sys.insanity?.value ?? 0);

    // ── Corruption bracket ───────────────────────────────────────────────────
    sys.corruptionBracket = RogueTraderActor.corruptionBracket(sys.corruption?.value ?? 0);

    // ── Auto-sum armour from equipped items ──────────────────────────────────
    this._sumEquippedArmour(sys);
  }

  // ---------------------------------------------------------------------------
  // NPC
  // ---------------------------------------------------------------------------

  _prepareNPCData(sys) {
    const chars = sys.characteristics;

    const ab = chars.ag?.bonus ?? 3;
    sys.movement = {
      half:   ab,
      full:   ab * 2,
      charge: ab * 3,
      run:    ab * 6,
    };

    this._sumEquippedArmour(sys);
  }

  // ---------------------------------------------------------------------------
  // AP auto-calculation
  // ---------------------------------------------------------------------------

  /**
   * Sum the AP values across all equipped armour items, one value per location.
   * Multiple pieces can cover different locations (e.g. a helmet + body armour).
   * The highest AP value per location wins (armour doesn't stack in RT rules).
   */
  _sumEquippedArmour(sys) {
    const locations = ["head", "body", "arms", "legs"];
    const ap = { head: 0, body: 0, arms: 0, legs: 0, all: 0 };

    const equippedArmour = this.items?.filter(
      i => i.type === "armour" && i.system.equipped
    ) ?? [];

    for (const item of equippedArmour) {
      for (const loc of locations) {
        const val = item.system.ap?.[loc] ?? 0;
        // Use highest AP per location (pieces don't stack)
        if (val > ap[loc]) ap[loc] = val;
      }
    }

    ap.all = Math.min(ap.head, ap.body, ap.arms, ap.legs);
    sys.armourPoints = ap;
  }

  // ---------------------------------------------------------------------------
  // Static helpers
  // ---------------------------------------------------------------------------

  /**
   * Return the Explorer's rank number (1–8) from total XP spent.
   * Thresholds from the RT core rulebook career rank tables.
   */
  static rankFromXP(spent) {
    if (spent <  7000) return 1;
    if (spent < 10000) return 2;
    if (spent < 13000) return 3;
    if (spent < 17000) return 4;
    if (spent < 21000) return 5;
    if (spent < 25000) return 6;
    if (spent < 30000) return 7;
    return 8;
  }

  static insanityBracket(ip) {
    if (ip <=  9) return "Unsettled";
    if (ip <= 20) return "Troubled";
    if (ip <= 40) return "Disturbed";
    if (ip <= 60) return "Neurotic";
    if (ip <= 80) return "Deranged";
    return "Unhinged";
  }

  static corruptionBracket(cp) {
    if (cp <= 30) return "Tainted";
    if (cp <= 60) return "Soiled";
    if (cp <= 90) return "Debased";
    if (cp <= 99) return "Profane";
    return "Damned";
  }
}
