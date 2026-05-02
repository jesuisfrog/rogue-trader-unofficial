/**
 * rogue-trader-unofficial | careers.js
 *
 * Complete career definitions for all eight core Rogue Trader career paths.
 *
 * DATA STRUCTURE
 * --------------
 * Each career has:
 *   id          Unique slug
 *   name        Display name
 *   description Short flavour description
 *   rankNames   Array of 8 rank title strings (index 0 = Rank 1)
 *
 *   startingSkills    Array of skill name strings
 *   startingTalents   Array of talent name strings
 *   startingGear      Free-text description
 *
 *   characteristicAdvances
 *     Object keyed by characteristic slug (ws/bs/str/t/ag/int/per/wp/fel)
 *     Each value is [simple, intermediate, trained, expert] XP cost
 *
 *   ranks   Array of 8 rank objects, each containing:
 *     rank    Number (1-8)
 *     advances  Array of advance objects:
 *       name          Display name
 *       cost          XP cost
 *       type          "skill" | "talent"
 *       prerequisites String (empty string = none)
 *       multiplier    Max purchases (default 1)
 *
 * CUSTOM CAREERS
 * --------------
 * Custom careers follow the exact same structure and are stored in
 * actor.system.customCareers (merged at runtime via CareerSystem.getAllCareers).
 */

export const CAREERS = {

  // ── ROGUE TRADER ──────────────────────────────────────────────────────────
  rogueTrader: {
    id: "rogueTrader",
    name: "Rogue Trader",
    description: "Master of a Warrant of Trade. Diplomat, commander, and rogue in the spaces between the stars.",
    rankNames: [
      "Freeman of the Void",      // Rank 1
      "Trader",                   // Rank 2
      "Merchant Venturer",        // Rank 3
      "Trade Master",             // Rank 4
      "Lord-Captain",             // Rank 5
      "High Master of Trade",     // Rank 6
      "Grand Master of Trade",    // Rank 7
      "Rogue Trader",             // Rank 8
    ],
    startingSkills: [
      "Command","Commerce","Charm",
      "Common Lore (Imperium)","Evaluate","Literacy",
      "Scholastic Lore (Astromancy)","Speak Language (High Gothic)","Speak Language (Low Gothic)"
    ],
    startingTalents: ["Air of Authority","Pistol Weapon Training (Universal)","Melee Weapon Training (Universal)"],
    startingGear: "Best-Craftsmanship laspistol or plasma pistol. Best-Craftsmanship mono-sword or power sword. Micro-bead, void suit, fine clothing, xeno-pelt cloak, enforcer light carapace.",
    characteristicAdvances: {
      ws:  [100, 250, 500, 750],
      bs:  [250, 500, 750, 1000],
      str: [500, 750, 1000, 2500],
      t:   [500, 750, 1000, 2500],
      ag:  [250, 500, 750, 1000],
      int: [100, 250, 500, 750],
      per: [250, 500, 750, 1000],
      wp:  [250, 500, 750, 1000],
      fel: [100, 250, 500, 750],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Command", cost: 100, type: "skill", prerequisites: "" },
        { name: "Commerce", cost: 100, type: "skill", prerequisites: "" },
        { name: "Charm", cost: 100, type: "skill", prerequisites: "" },
        { name: "Ciphers (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperium)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Rogue Traders)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 100, type: "skill", prerequisites: "" },
        { name: "Evaluate", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Pilot (Space Craft)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Speak Language (Trader's Cant)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Air of Authority", cost: 100, type: "talent", prerequisites: "Fel 30" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Melee Weapon Training (Primitive)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Renowned Warrant", cost: 200, type: "talent", prerequisites: "" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Barter", cost: 200, type: "skill", prerequisites: "" },
        { name: "Blather", cost: 200, type: "skill", prerequisites: "" },
        { name: "Carouse", cost: 200, type: "skill", prerequisites: "" },
        { name: "Charm +10", cost: 200, type: "skill", prerequisites: "Charm" },
        { name: "Command +10", cost: 200, type: "skill", prerequisites: "Command" },
        { name: "Common Lore (Koronus Expanse)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Deceive", cost: 200, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Xenos)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Gamble", cost: 200, type: "skill", prerequisites: "" },
        { name: "Intimidate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Performer (Choose One)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Pilot (Flyers)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Imperial Warrants)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Iron Discipline", cost: 200, type: "talent", prerequisites: "WP 30, Command" },
        { name: "Jaded", cost: 200, type: "talent", prerequisites: "WP 30" },
        { name: "Leap Up", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Quick Draw", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Two-Weapon Wielder (Melee)", cost: 300, type: "talent", prerequisites: "WS 35, Ag 35" },
        { name: "Exotic Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Two-Weapon Wielder (Ballistic)", cost: 500, type: "talent", prerequisites: "BS 35, Ag 35" },
      ]},
      { rank: 3, advances: [
        { name: "Acrobatics", cost: 200, type: "skill", prerequisites: "" },
        { name: "Charm +20", cost: 200, type: "skill", prerequisites: "Charm +10" },
        { name: "Command +20", cost: 200, type: "skill", prerequisites: "Command +10" },
        { name: "Common Lore (Imperial Navy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Drive (Ground Vehicle)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Heraldry)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Legend)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scrutiny", cost: 200, type: "skill", prerequisites: "" },
        { name: "Search", cost: 200, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Underdeck)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Security", cost: 200, type: "skill", prerequisites: "" },
        { name: "Sleight of Hand", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dark Soul", cost: 200, type: "talent", prerequisites: "" },
        { name: "Decadence", cost: 200, type: "talent", prerequisites: "T 30" },
        { name: "Foresight", cost: 200, type: "talent", prerequisites: "Int 30" },
        { name: "Resistance (Fear)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Exotic Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Gunslinger", cost: 500, type: "talent", prerequisites: "BS 40, Two-Weapon Wielder (Ballistic)" },
      ]},
      { rank: 4, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Climb", cost: 200, type: "skill", prerequisites: "" },
        { name: "Commerce +10", cost: 200, type: "skill", prerequisites: "Commerce" },
        { name: "Common Lore (Imperium) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium)" },
        { name: "Common Lore (Rogue Traders) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Rogue Traders)" },
        { name: "Dodge +20", cost: 200, type: "skill", prerequisites: "Dodge +10" },
        { name: "Drive (Skimmer/Hover)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Speak Language (Eldar)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Tech-Use", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Voidfarer)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Catfall", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Double Team", cost: 200, type: "talent", prerequisites: "" },
        { name: "Rapid Reaction", cost: 200, type: "talent", prerequisites: "Ag 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Counter Attack", cost: 500, type: "talent", prerequisites: "WS 40" },
        { name: "Crushing Blow", cost: 500, type: "talent", prerequisites: "S 40" },
        { name: "Into the Jaws of Hell", cost: 500, type: "talent", prerequisites: "Iron Discipline" },
        { name: "Sprint", cost: 500, type: "talent", prerequisites: "" },
        { name: "Swift Attack", cost: 500, type: "talent", prerequisites: "WS 35" },
      ]},
      { rank: 5, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Barter +10", cost: 200, type: "skill", prerequisites: "Barter" },
        { name: "Blather +10", cost: 200, type: "skill", prerequisites: "Blather" },
        { name: "Carouse +10", cost: 200, type: "skill", prerequisites: "Carouse" },
        { name: "Ciphers (Underworld)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Commerce +20", cost: 200, type: "skill", prerequisites: "Commerce +10" },
        { name: "Common Lore (Imperium) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium) +10" },
        { name: "Common Lore (Koronus Expanse) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse)" },
        { name: "Common Lore (Rogue Traders) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Rogue Traders) +10" },
        { name: "Deceive +10", cost: 200, type: "skill", prerequisites: "Deceive" },
        { name: "Evaluate +10", cost: 200, type: "skill", prerequisites: "Evaluate" },
        { name: "Navigation (Stellar)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Disarm", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Blademaster", cost: 500, type: "talent", prerequisites: "WS 30, Melee Weapon Training (any)" },
        { name: "Combat Master", cost: 500, type: "talent", prerequisites: "WS 30" },
        { name: "Lightning Attack", cost: 500, type: "talent", prerequisites: "Swift Attack" },
        { name: "Master & Commander", cost: 500, type: "talent", prerequisites: "Int 35, Fel 35" },
        { name: "Sure Strike", cost: 500, type: "talent", prerequisites: "WS 30" },
      ]},
      { rank: 6, advances: [
        { name: "Barter +20", cost: 200, type: "skill", prerequisites: "Barter +10" },
        { name: "Blather +20", cost: 200, type: "skill", prerequisites: "Blather +10" },
        { name: "Carouse +20", cost: 200, type: "skill", prerequisites: "Carouse +10" },
        { name: "Common Lore (Koronus Expanse) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse) +10" },
        { name: "Deceive +20", cost: 200, type: "skill", prerequisites: "Deceive +10" },
        { name: "Forbidden Lore (Xenos) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Xenos)" },
        { name: "Gamble +10", cost: 200, type: "skill", prerequisites: "Gamble" },
        { name: "Evaluate +20", cost: 200, type: "skill", prerequisites: "Evaluate +10" },
        { name: "Intimidate +10", cost: 200, type: "skill", prerequisites: "Intimidate" },
        { name: "Navigation (Stellar) +10", cost: 200, type: "skill", prerequisites: "Navigation (Stellar)" },
        { name: "Scholastic Lore (Imperial Warrants) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Imperial Warrants)" },
        { name: "Security +10", cost: 200, type: "skill", prerequisites: "Security" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Paranoia", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Hip Shooting", cost: 500, type: "talent", prerequisites: "BS 40, Ag 40" },
        { name: "Master Orator", cost: 500, type: "talent", prerequisites: "Fel 30" },
        { name: "Precise Blow", cost: 500, type: "talent", prerequisites: "WS 40, Sure Strike" },
        { name: "True Grit", cost: 500, type: "talent", prerequisites: "T 40" },
        { name: "Wall of Steel", cost: 500, type: "talent", prerequisites: "Ag 35" },
      ]},
      { rank: 7, advances: [
        { name: "Acrobatics +10", cost: 200, type: "skill", prerequisites: "Acrobatics" },
        { name: "Climb +10", cost: 200, type: "skill", prerequisites: "Climb" },
        { name: "Forbidden Lore (Xenos) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Xenos) +10" },
        { name: "Gamble +20", cost: 200, type: "skill", prerequisites: "Gamble +10" },
        { name: "Scholastic Lore (Imperial Warrants) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Imperial Warrants) +10" },
        { name: "Scholastic Lore (Legend) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Legend)" },
        { name: "Scrutiny +10", cost: 200, type: "skill", prerequisites: "Scrutiny" },
        { name: "Search +10", cost: 200, type: "skill", prerequisites: "Search" },
        { name: "Security +20", cost: 200, type: "skill", prerequisites: "Security +10" },
        { name: "Sleight of Hand +10", cost: 200, type: "skill", prerequisites: "Sleight of Hand" },
        { name: "Swim", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Voidfarer) +10", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer)" },
        { name: "Armour of Contempt", cost: 200, type: "talent", prerequisites: "WP 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Fearless", cost: 500, type: "talent", prerequisites: "" },
        { name: "Hard Bargain", cost: 500, type: "talent", prerequisites: "" },
        { name: "Dual Strike", cost: 500, type: "talent", prerequisites: "Ag 40, Two-Weapon Wielder (Melee)" },
        { name: "Duty Unto Death", cost: 500, type: "talent", prerequisites: "WP 45" },
        { name: "Flame Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Step Aside", cost: 500, type: "talent", prerequisites: "Ag 40, Dodge" },
      ]},
      { rank: 8, advances: [
        { name: "Acrobatics +20", cost: 200, type: "skill", prerequisites: "Acrobatics +10" },
        { name: "Climb +20", cost: 200, type: "skill", prerequisites: "Climb +10" },
        { name: "Scholastic Lore (Legend) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Legend) +10" },
        { name: "Scrutiny +20", cost: 200, type: "skill", prerequisites: "Scrutiny +10" },
        { name: "Search +20", cost: 200, type: "skill", prerequisites: "Search +10" },
        { name: "Sleight of Hand +20", cost: 200, type: "skill", prerequisites: "Sleight of Hand +10" },
        { name: "Swim +10", cost: 200, type: "skill", prerequisites: "Swim" },
        { name: "Trade (Voidfarer) +20", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer) +10" },
        { name: "Resistance (Psychic Powers)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Assassin Strike", cost: 500, type: "talent", prerequisites: "Ag 40, Acrobatics" },
        { name: "Deadeye Shot", cost: 500, type: "talent", prerequisites: "BS 30" },
        { name: "Dual Shot", cost: 500, type: "talent", prerequisites: "Ag 40, Two-Weapon Wielder (Ballistic)" },
        { name: "Exotic Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Independent Targeting", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Mighty Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Lightning Reflexes", cost: 500, type: "talent", prerequisites: "" },
        { name: "Thrown Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Void Tactician", cost: 500, type: "talent", prerequisites: "Int 35" },
      ]},
    ],
  },

  // ── ARCH-MILITANT ─────────────────────────────────────────────────────────
  archMilitant: {
    id: "archMilitant",
    name: "Arch-Militant",
    description: "Warrior without peer. Master of every form of combat and weapon, shaped by war into something barely human.",
    rankNames: [
      "Trooper",         // 1
      "Skirmisher",      // 2
      "Fighter",         // 3
      "Warrior",         // 4
      "Veteran",         // 5
      "Elite Trooper",   // 6
      "War-Captain",     // 7
      "Arch-Militant",   // 8
    ],
    startingSkills: ["Common Lore (War)","Dodge","Intimidate","Scholastic Lore (Tactica Imperialis)","Secret Tongue (Military)","Speak Language (Low Gothic)"],
    startingTalents: ["Basic Weapon Training (Universal)","Pistol Weapon Training (Universal)","Melee Weapon Training (Universal)","Thrown Weapon Training (Universal)","Sound Constitution"],
    startingGear: "Good-Craftsmanship hellgun or best-Craftsmanship hunting rifle or two bolt pistols. Mono primitive melee weapon. Micro-bead, void suit, enforcer light carapace, bolt shell keepsake, medikit, manacles.",
    characteristicAdvances: {
      ws:  [250, 500, 750, 1000],
      bs:  [100, 250, 500, 750],
      str: [100, 250, 500, 750],
      t:   [250, 500, 750, 1000],
      ag:  [100, 250, 500, 750],
      int: [500, 750, 1000, 2500],
      per: [500, 750, 1000, 2500],
      wp:  [500, 750, 1000, 2500],
      fel: [250, 500, 750, 1000],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Guard)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (War)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 100, type: "skill", prerequisites: "" },
        { name: "Intimidate", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Pirates)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Medicae", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Tactica Imperialis)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Military)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Quick Draw", cost: 200, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Primitive)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Bloodtracker", cost: 500, type: "talent", prerequisites: "" },
        { name: "Guardian", cost: 500, type: "talent", prerequisites: "Ag 40" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Thrown Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Acrobatics", cost: 200, type: "skill", prerequisites: "" },
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Common Lore (War) +10", cost: 200, type: "skill", prerequisites: "Common Lore (War)" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Intimidate +10", cost: 200, type: "skill", prerequisites: "Intimidate" },
        { name: "Scholastic Lore (Tactica Imperialis) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Tactica Imperialis)" },
        { name: "Tracking", cost: 200, type: "skill", prerequisites: "" },
        { name: "Basic Weapon Training (Primitive)", cost: 100, type: "talent", prerequisites: "" },
        { name: "Pistol Weapon Training (Primitive)", cost: 100, type: "talent", prerequisites: "" },
        { name: "Thrown Weapon Training (Primitive)", cost: 100, type: "talent", prerequisites: "" },
        { name: "Catfall", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Leap Up", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Rapid Reload", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Takedown", cost: 200, type: "talent", prerequisites: "" },
        { name: "Two-Weapon Wielder (Ballistic)", cost: 200, type: "talent", prerequisites: "BS 35, Ag 35" },
        { name: "True Grit", cost: 200, type: "talent", prerequisites: "T 40" },
        { name: "Combat Formation", cost: 500, type: "talent", prerequisites: "Int 40" },
        { name: "Crushing Blow", cost: 500, type: "talent", prerequisites: "S 40" },
        { name: "Flame Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 3, advances: [
        { name: "Acrobatics +10", cost: 200, type: "skill", prerequisites: "Acrobatics" },
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Command", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Navy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (War) +20", cost: 300, type: "skill", prerequisites: "Common Lore (War) +10" },
        { name: "Dodge +20", cost: 300, type: "skill", prerequisites: "Dodge +10" },
        { name: "Drive (Ground Vehicles)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Interrogation", cost: 200, type: "skill", prerequisites: "" },
        { name: "Intimidate +20", cost: 200, type: "skill", prerequisites: "Intimidate +10" },
        { name: "Scholastic Lore (Tactica Imperialis) +20", cost: 300, type: "skill", prerequisites: "Scholastic Lore (Tactica Imperialis) +10" },
        { name: "Tracking +10", cost: 200, type: "skill", prerequisites: "Tracking" },
        { name: "Die Hard", cost: 200, type: "talent", prerequisites: "WP 40" },
        { name: "Double Team", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hatred (Pirates)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Rapid Reaction", cost: 200, type: "talent", prerequisites: "Ag 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Crack Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Frenzy", cost: 500, type: "talent", prerequisites: "" },
        { name: "Furious Assault", cost: 500, type: "talent", prerequisites: "WS 35" },
        { name: "Sure Strike", cost: 500, type: "talent", prerequisites: "WS 30" },
      ]},
      { rank: 4, advances: [
        { name: "Acrobatics +20", cost: 200, type: "skill", prerequisites: "Acrobatics +10" },
        { name: "Carouse", cost: 200, type: "skill", prerequisites: "" },
        { name: "Ciphers (Mercenary Cant)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Command +10", cost: 200, type: "skill", prerequisites: "Command" },
        { name: "Common Lore (Imperial Guard) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard)" },
        { name: "Concealment", cost: 200, type: "skill", prerequisites: "" },
        { name: "Demolition", cost: 200, type: "skill", prerequisites: "" },
        { name: "Drive (Ground Vehicles) +10", cost: 300, type: "skill", prerequisites: "Drive (Ground Vehicles)" },
        { name: "Interrogation +10", cost: 200, type: "skill", prerequisites: "Interrogation" },
        { name: "Security", cost: 200, type: "skill", prerequisites: "" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Deadeye Shot", cost: 200, type: "talent", prerequisites: "BS 30" },
        { name: "Exotic Weapon Training (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Heavy Weapon Training (Choose One)", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Hip Shooting", cost: 200, type: "talent", prerequisites: "BS 40, Ag 40" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Battle Rage", cost: 500, type: "talent", prerequisites: "Frenzy" },
        { name: "Bulging Biceps", cost: 500, type: "talent", prerequisites: "S 45" },
        { name: "Dual Shot", cost: 500, type: "talent", prerequisites: "Ag 40, Two-Weapon Wielder (Ballistic)" },
      ]},
      { rank: 5, advances: [
        { name: "Carouse +10", cost: 200, type: "skill", prerequisites: "Carouse" },
        { name: "Climb", cost: 200, type: "skill", prerequisites: "" },
        { name: "Command +20", cost: 200, type: "skill", prerequisites: "Command +10" },
        { name: "Concealment +10", cost: 200, type: "skill", prerequisites: "Concealment" },
        { name: "Demolition +10", cost: 200, type: "skill", prerequisites: "Demolition" },
        { name: "Drive (Ground Vehicles) +20", cost: 200, type: "skill", prerequisites: "Drive (Ground Vehicles) +10" },
        { name: "Interrogation +20", cost: 200, type: "skill", prerequisites: "Interrogation +10" },
        { name: "Shadowing", cost: 200, type: "skill", prerequisites: "" },
        { name: "Nerves of Steel", cost: 200, type: "talent", prerequisites: "" },
        { name: "Paranoia", cost: 200, type: "talent", prerequisites: "" },
        { name: "Resistance (Fear)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hardy", cost: 200, type: "talent", prerequisites: "T 40" },
        { name: "Berserk Charge", cost: 500, type: "talent", prerequisites: "" },
        { name: "Combat Master", cost: 500, type: "talent", prerequisites: "WS 30" },
        { name: "Gunslinger", cost: 500, type: "talent", prerequisites: "BS 40, Two-Weapon Wielder (Ballistic)" },
        { name: "Independent Targeting", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Jaded", cost: 500, type: "talent", prerequisites: "WP 30" },
        { name: "Marksman", cost: 500, type: "talent", prerequisites: "BS 35" },
        { name: "Mighty Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Unarmed Warrior", cost: 500, type: "talent", prerequisites: "WS 35, Ag 35" },
      ]},
      { rank: 6, advances: [
        { name: "Concealment +20", cost: 200, type: "skill", prerequisites: "Concealment +10" },
        { name: "Contortionist", cost: 200, type: "skill", prerequisites: "" },
        { name: "Climb +10", cost: 200, type: "skill", prerequisites: "Climb" },
        { name: "Demolition +20", cost: 200, type: "skill", prerequisites: "Demolition +10" },
        { name: "Forbidden Lore (Pirates) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Pirates)" },
        { name: "Search", cost: 200, type: "skill", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Blademaster", cost: 500, type: "talent", prerequisites: "WS 30, Melee Weapon Training (any)" },
        { name: "Dual Strike", cost: 500, type: "talent", prerequisites: "Ag 40, WS 40, Two-Weapon Wielder (Melee)" },
        { name: "Lightning Attack", cost: 500, type: "talent", prerequisites: "Swift Attack" },
        { name: "Step Aside", cost: 500, type: "talent", prerequisites: "Ag 40, Dodge" },
        { name: "Swift Attack", cost: 500, type: "talent", prerequisites: "WS 35" },
      ]},
      { rank: 7, advances: [
        { name: "Climb +20", cost: 200, type: "skill", prerequisites: "Climb +10" },
        { name: "Forbidden Lore (Pirates) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Pirates) +10" },
        { name: "Search +10", cost: 200, type: "skill", prerequisites: "Search" },
        { name: "Shadowing +10", cost: 200, type: "skill", prerequisites: "Shadowing" },
        { name: "Survival", cost: 200, type: "skill", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Fearless", cost: 500, type: "talent", prerequisites: "" },
        { name: "Hard Target", cost: 500, type: "talent", prerequisites: "Ag 40" },
        { name: "Iron Jaw", cost: 500, type: "talent", prerequisites: "T 40" },
      ]},
      { rank: 8, advances: [
        { name: "Search +20", cost: 200, type: "skill", prerequisites: "Search +10" },
        { name: "Shadowing +20", cost: 200, type: "skill", prerequisites: "Shadowing +10" },
        { name: "Survival +10", cost: 200, type: "skill", prerequisites: "Survival" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Assassin Strike", cost: 500, type: "talent", prerequisites: "Ag 40, Acrobatics" },
        { name: "Into the Jaws of Hell", cost: 500, type: "talent", prerequisites: "Iron Discipline" },
        { name: "Mighty Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Sharpshooter", cost: 500, type: "talent", prerequisites: "BS 40, Deadeye Shot" },
        { name: "Wall of Steel", cost: 500, type: "talent", prerequisites: "Ag 35" },
      ]},
    ],
  },

  // ── ASTROPATH TRANSCENDENT ─────────────────────────────────────────────────
  astropathTranscendent: {
    id: "astropathTranscendent",
    name: "Astropath Transcendent",
    description: "Soul-bound to the Emperor, these psychic communicators bridge the voids between stars.",
    rankNames: [
      "Choir Member",          // 1
      "Astropath Initiate",    // 2
      "Astropath",             // 3
      "Senior Astropath",      // 4
      "Choir Master",          // 5
      "Astropath Transcendent",// 6
      "Master Astropath",      // 7
      "Grand Astropath",       // 8
    ],
    startingSkills: ["Awareness","Common Lore (Adeptus Astra Telepathica)","Forbidden Lore (Psykers)","Invocation","Psyniscience","Scholastic Lore (Cryptology)","Speak Language (High Gothic)","Speak Language (Low Gothic)"],
    startingTalents: ["Pistol Weapon Training (Universal)","Heightened Senses (Sound)","Psy Rating 2"],
    startingGear: "Best-Craftsmanship laspistol or stub automatic. Best-Craftsmanship mono-sword or shock staff. Guard flak armour, charm, void suit, micro-bead, psy-focus.",
    characteristicAdvances: {
      ws:  [500, 750, 1000, 2500],
      bs:  [500, 750, 1000, 2500],
      str: [250, 500, 750, 1000],
      t:   [250, 500, 750, 1000],
      ag:  [250, 500, 750, 1000],
      int: [100, 250, 500, 750],
      per: [250, 500, 750, 1000],
      wp:  [100, 250, 500, 750],
      fel: [500, 750, 1000, 2500],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Ciphers (Astropath Sign)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Administratum)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Adeptus Astra Telepathica)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Psykers)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Warp)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Invocation", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Psyniscience", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Cryptology)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Occult)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 200, type: "skill", prerequisites: "" },
        { name: "Psychic Technique", cost: 100, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Heightened Senses (Sound)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psy Rating 2", cost: 200, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Primitive)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Rite of Sanctioning", cost: 500, type: "talent", prerequisites: "Psy Rating, Special" },
        { name: "Warp Affinity", cost: 500, type: "talent", prerequisites: "Psy Rating, Special" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Ciphers (Astropath Sign) +10", cost: 200, type: "skill", prerequisites: "Ciphers (Astropath Sign)" },
        { name: "Common Lore (Administratum) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Administratum)" },
        { name: "Common Lore (Adeptus Astra Telepathica) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Adeptus Astra Telepathica)" },
        { name: "Forbidden Lore (Psykers) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Psykers)" },
        { name: "Invocation +10", cost: 200, type: "skill", prerequisites: "Invocation" },
        { name: "Psyniscience +10", cost: 200, type: "skill", prerequisites: "Psyniscience" },
        { name: "Scholastic Lore (Cryptology) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Cryptology)" },
        { name: "Scholastic Lore (Occult) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Occult)" },
        { name: "Scrutiny", cost: 200, type: "skill", prerequisites: "" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Combat Sense", cost: 200, type: "talent", prerequisites: "Per 40" },
        { name: "Psychic Technique", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Dark Soul", cost: 200, type: "talent", prerequisites: "" },
        { name: "Foresight", cost: 200, type: "talent", prerequisites: "Int 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Total Recall", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psy Rating 3", cost: 300, type: "talent", prerequisites: "Psy Rating 2" },
        { name: "Resistance (Psychic Powers)", cost: 300, type: "talent", prerequisites: "" },
      ]},
      { rank: 3, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Ciphers (Astropath Sign) +10", cost: 200, type: "skill", prerequisites: "Ciphers (Astropath Sign)" },
        { name: "Common Lore (Administratum) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Administratum) +10" },
        { name: "Common Lore (Adeptus Astra Telepathica) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Adeptus Astra Telepathica) +10" },
        { name: "Common Lore (Imperial Guard)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Navy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Deceive", cost: 200, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Psykers) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Psykers) +10" },
        { name: "Forbidden Lore (Warp) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Warp)" },
        { name: "Invocation +20", cost: 200, type: "skill", prerequisites: "Invocation +10" },
        { name: "Psyniscience +20", cost: 200, type: "skill", prerequisites: "Psyniscience +10" },
        { name: "Scholastic Lore (Cryptology) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Cryptology) +10" },
        { name: "Scholastic Lore (Occult) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Occult) +10" },
        { name: "Scrutiny +10", cost: 200, type: "skill", prerequisites: "Scrutiny" },
        { name: "Chem Geld", cost: 200, type: "talent", prerequisites: "" },
        { name: "Peer (Astropaths)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Psy Rating 4", cost: 200, type: "talent", prerequisites: "Psy Rating 3" },
        { name: "Psychic Technique", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Psychic Discipline", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 4, advances: [
        { name: "Blather", cost: 200, type: "skill", prerequisites: "" },
        { name: "Ciphers (Astropath Sign) +20", cost: 200, type: "skill", prerequisites: "Ciphers (Astropath Sign) +10" },
        { name: "Common Lore (Imperial Guard) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard)" },
        { name: "Common Lore (Imperial Navy) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy)" },
        { name: "Common Lore (Imperium)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Deceive +10", cost: 200, type: "skill", prerequisites: "Deceive" },
        { name: "Scholastic Lore (Heraldry)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scrutiny +20", cost: 200, type: "skill", prerequisites: "Scrutiny +10" },
        { name: "Secret Tongue (Administratum)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Armour of Contempt", cost: 200, type: "talent", prerequisites: "WP 40" },
        { name: "Orthoproxy", cost: 200, type: "talent", prerequisites: "" },
        { name: "Paranoia", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hatred (Daemons)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Heightened Senses (Touch)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Meditation", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psy Rating 5", cost: 200, type: "talent", prerequisites: "Psy Rating 4" },
        { name: "Psychic Technique", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Strong Minded", cost: 500, type: "talent", prerequisites: "WP 30, Resistance (Psychic Powers)" },
      ]},
      { rank: 5, advances: [
        { name: "Charm", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Guard) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard) +10" },
        { name: "Common Lore (Imperial Navy) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy) +10" },
        { name: "Common Lore (Imperium) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium)" },
        { name: "Deceive +20", cost: 200, type: "skill", prerequisites: "Deceive +10" },
        { name: "Forbidden Lore (Warp) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Warp) +10" },
        { name: "Logic", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Heraldry) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Heraldry)" },
        { name: "Good Reputation (Astropaths)", cost: 200, type: "talent", prerequisites: "Fel 50, Peer (Astropaths)" },
        { name: "Heightened Senses (Taste)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Peer (Imperial Guard)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Psy Rating 6", cost: 200, type: "talent", prerequisites: "Psy Rating 5" },
        { name: "Rapid Reload", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Unshakeable Faith", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psychic Technique", cost: 300, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Infused Knowledge", cost: 500, type: "talent", prerequisites: "Int 40" },
        { name: "Warp Sense", cost: 500, type: "talent", prerequisites: "Psy Rating, Per 30" },
        { name: "Favoured by the Warp", cost: 500, type: "talent", prerequisites: "WP 35" },
      ]},
      { rank: 6, advances: [
        { name: "Charm +10", cost: 200, type: "skill", prerequisites: "Charm" },
        { name: "Command", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperium) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium) +10" },
        { name: "Evaluate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Intimidate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Logic +10", cost: 200, type: "skill", prerequisites: "Logic" },
        { name: "Scholastic Lore (Heraldry) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Heraldry) +10" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Heightened Senses (Smell)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Jaded", cost: 200, type: "talent", prerequisites: "WP 30" },
        { name: "Peer (Imperial Navy)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Psychic Technique", cost: 300, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Bastion of Iron Will", cost: 500, type: "talent", prerequisites: "Psy Rating, Strong Minded, WP 40" },
        { name: "Exotic Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Improved Warp Sense", cost: 500, type: "talent", prerequisites: "Warp Sense" },
        { name: "Psychic Discipline", cost: 500, type: "talent", prerequisites: "" },
        { name: "Thrown Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 7, advances: [
        { name: "Blather +10", cost: 200, type: "skill", prerequisites: "Blather" },
        { name: "Charm +20", cost: 200, type: "skill", prerequisites: "Charm +10" },
        { name: "Chem-Use", cost: 200, type: "skill", prerequisites: "" },
        { name: "Command +10", cost: 200, type: "skill", prerequisites: "Command" },
        { name: "Evaluate +10", cost: 200, type: "skill", prerequisites: "Evaluate" },
        { name: "Intimidate +10", cost: 200, type: "skill", prerequisites: "Intimidate" },
        { name: "Logic +20", cost: 200, type: "skill", prerequisites: "Logic +10" },
        { name: "Scholastic Lore (Legend)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Air of Authority", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Quick Draw", cost: 200, type: "talent", prerequisites: "" },
        { name: "Rapid Reaction", cost: 200, type: "talent", prerequisites: "Ag 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psychic Technique", cost: 500, type: "talent", prerequisites: "", multiplier: 2 },
      ]},
      { rank: 8, advances: [
        { name: "Command +20", cost: 200, type: "skill", prerequisites: "Command +10" },
        { name: "Evaluate +20", cost: 200, type: "skill", prerequisites: "Evaluate +10" },
        { name: "Intimidate +20", cost: 200, type: "skill", prerequisites: "Intimidate +10" },
        { name: "Scholastic Lore (Legend) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Legend)" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Psychic Technique", cost: 500, type: "talent", prerequisites: "", multiplier: 3 },
        { name: "Psychic Discipline", cost: 500, type: "talent", prerequisites: "" },
        { name: "Warp Lock", cost: 500, type: "talent", prerequisites: "WP 50, Bastion of Iron Will" },
      ]},
    ],
  },

  // ── EXPLORATOR ────────────────────────────────────────────────────────────
  explorator: {
    id: "explorator",
    name: "Explorator",
    description: "Servant of the Omnissiah seeking ancient technology and sacred knowledge in the void.",
    rankNames: [
      "Technician",           // 1
      "Enginseer",            // 2
      "Senior Enginseer",     // 3
      "Magos Explorate",      // 4
      "Magos",                // 5
      "Senior Magos",         // 6
      "Arch-Magos",           // 7
      "Explorator",           // 8
    ],
    startingSkills: ["Common Lore (Machine Cult)","Common Lore (Tech)","Forbidden Lore (Archeotech)","Forbidden Lore (Adeptus Mechanicus)","Literacy","Logic","Speak Language (Explorator Binary)","Speak Language (Low Gothic)","Speak Language (Techna-lingua)","Tech-Use","Trade (Technomat)"],
    startingTalents: ["Basic Weapon Training (Universal)","Melee Weapon Training (Universal)","Logis Implant"],
    startingGear: "Boltgun or best-Craftsmanship lasgun. Best-Craftsmanship shock staff or power axe. Enforcer light carapace, multikey, void suit, injector, sacred unguents, micro-bead, combi-tool, dataslate, servo-skull familiar.",
    characteristicAdvances: {
      ws:  [250, 500, 750, 1000],
      bs:  [250, 500, 750, 1000],
      str: [100, 250, 500, 750],
      t:   [100, 250, 500, 750],
      ag:  [500, 750, 1000, 2500],
      int: [100, 250, 500, 750],
      per: [500, 750, 1000, 2500],
      wp:  [250, 500, 750, 1000],
      fel: [500, 750, 1000, 2500],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Machine Cult)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Tech)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Drive (Ground Vehicle)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Archeotech)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Adeptus Mechanicus)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Logic", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Tech)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Tech-Use", cost: 100, type: "skill", prerequisites: "" },
        { name: "Trade (Armourer)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Trade (Technomat)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Autosanguine", cost: 200, type: "talent", prerequisites: "" },
        { name: "Logis Implant", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Mechadendrite Use (Utility)", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Common Lore (Machine Cult) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Machine Cult)" },
        { name: "Common Lore (Tech) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Tech)" },
        { name: "Forbidden Lore (Archeotech) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Archeotech)" },
        { name: "Forbidden Lore (Adeptus Mechanicus) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Adeptus Mechanicus)" },
        { name: "Dodge", cost: 200, type: "skill", prerequisites: "" },
        { name: "Logic +10", cost: 200, type: "skill", prerequisites: "Logic" },
        { name: "Medicae", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy)" },
        { name: "Tech-Use +10", cost: 200, type: "skill", prerequisites: "Tech-Use" },
        { name: "Binary Chatter", cost: 200, type: "talent", prerequisites: "" },
        { name: "Electro Graft Use", cost: 200, type: "talent", prerequisites: "" },
        { name: "Ferric Lure", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Luminen Charge", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Prosanguine", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Technical Knock", cost: 200, type: "talent", prerequisites: "Int 30" },
        { name: "Total Recall", cost: 200, type: "talent", prerequisites: "Int 30" },
        { name: "Maglev Grace", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 3, advances: [
        { name: "Chem-Use", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Koronus Expanse)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Machine Cult) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Machine Cult) +10" },
        { name: "Common Lore (Tech) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Tech) +10" },
        { name: "Common Lore (War)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Forbidden Lore (Adeptus Mechanicus) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Adeptus Mechanicus) +10" },
        { name: "Forbidden Lore (Archeotech) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Archeotech) +10" },
        { name: "Medicae +10", cost: 200, type: "skill", prerequisites: "Medicae" },
        { name: "Navigation (Surface)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Tech-Use +20", cost: 200, type: "skill", prerequisites: "Tech-Use +10" },
        { name: "Trade (Explorator)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Feedback Screech", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Luminen Shock", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Nerves of Steel", cost: 200, type: "talent", prerequisites: "" },
        { name: "Peer (Adeptus Mechanicus)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Gun Blessing", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "The Flesh is Weak 1", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Maglev Transcendence", cost: 500, type: "talent", prerequisites: "Maglev Grace, Mechanicus Implants" },
      ]},
      { rank: 4, advances: [
        { name: "Chem-Use +10", cost: 200, type: "skill", prerequisites: "Chem-Use" },
        { name: "Common Lore (Imperial Guard)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Koronus Expanse) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse)" },
        { name: "Common Lore (War) +10", cost: 200, type: "skill", prerequisites: "Common Lore (War)" },
        { name: "Drive (Ground Vehicle) +10", cost: 200, type: "skill", prerequisites: "Drive (Ground Vehicle)" },
        { name: "Drive (Skimmer/Hover)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Medicae +20", cost: 200, type: "skill", prerequisites: "Medicae +10" },
        { name: "Scholastic Lore (Astromancy) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy)" },
        { name: "Scholastic Lore (Chymistry)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Voidfarer)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Concealed Cavity", cost: 200, type: "talent", prerequisites: "" },
        { name: "Luminen Blast", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Tech-Use)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Exotic Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Ferric Summons", cost: 500, type: "talent", prerequisites: "Mechanicus Implants, Ferric Lure" },
        { name: "The Flesh is Weak 2", cost: 500, type: "talent", prerequisites: "The Flesh is Weak 1" },
        { name: "Machinator Array", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Mechadendrite Use (Weapon)", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Rite of Awe", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
      ]},
      { rank: 5, advances: [
        { name: "Chem-Use +20", cost: 200, type: "skill", prerequisites: "Chem-Use +10" },
        { name: "Common Lore (Imperial Guard) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard)" },
        { name: "Common Lore (Imperial Navy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Navigation (Surface) +10", cost: 200, type: "skill", prerequisites: "Navigation (Surface)" },
        { name: "Pilot (Flyers)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy) +10" },
        { name: "Scholastic Lore (Chymistry) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Chymistry)" },
        { name: "Scholastic Lore (Tactica Imperialis)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Archaeologist)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Explorator) +10", cost: 200, type: "skill", prerequisites: "Trade (Explorator)" },
        { name: "Trade (Voidfarer) +10", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer)" },
        { name: "Electrical Succour", cost: 200, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Rapid Reload", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "The Flesh is Weak 3", cost: 500, type: "talent", prerequisites: "The Flesh is Weak 2" },
        { name: "Heavy Weapon Training (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Infused Knowledge", cost: 500, type: "talent", prerequisites: "Int 40" },
        { name: "Master Enginseer", cost: 500, type: "talent", prerequisites: "Tech-Use +10, Mechanicus Implants" },
        { name: "Mimic", cost: 500, type: "talent", prerequisites: "" },
        { name: "Rite of Fear", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
      ]},
      { rank: 6, advances: [
        { name: "Common Lore (Imperial Guard) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard) +10" },
        { name: "Common Lore (Imperial Navy) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy)" },
        { name: "Navigation (Surface) +20", cost: 200, type: "skill", prerequisites: "Navigation (Surface) +10" },
        { name: "Pilot (Flyers) +10", cost: 200, type: "skill", prerequisites: "Pilot (Flyers)" },
        { name: "Pilot (Space Craft)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Chymistry) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Chymistry) +10" },
        { name: "Scholastic Lore (Tactica Imperialis) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Tactica Imperialis)" },
        { name: "Trade (Archaeologist) +10", cost: 200, type: "skill", prerequisites: "Trade (Archaeologist)" },
        { name: "Trade (Explorator) +20", cost: 200, type: "skill", prerequisites: "Trade (Explorator) +10" },
        { name: "Trade (Shipwright)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Trade (Voidfarer) +20", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer) +10" },
        { name: "Counter Attack", cost: 200, type: "talent", prerequisites: "WS 40" },
        { name: "Iron Jaw", cost: 200, type: "talent", prerequisites: "T 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Blademaster", cost: 500, type: "talent", prerequisites: "WS 30, Melee Weapon Training (any)" },
        { name: "Deadeye Shot", cost: 500, type: "talent", prerequisites: "BS 30" },
        { name: "Energy Cache", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
        { name: "Furious Assault", cost: 500, type: "talent", prerequisites: "WS 35" },
        { name: "The Flesh is Weak 4", cost: 500, type: "talent", prerequisites: "The Flesh is Weak 3" },
        { name: "Rite of Pure Thought", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
      ]},
      { rank: 7, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Command", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Rogue Traders)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dodge +20", cost: 200, type: "skill", prerequisites: "Dodge +10" },
        { name: "Drive (Walker)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Evaluate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Intimidate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Navigation (Stellar)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Numerology)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Crushing Blow", cost: 200, type: "talent", prerequisites: "S 40" },
        { name: "Good Reputation (Adeptus Mechanicus)", cost: 200, type: "talent", prerequisites: "Fel 50, Peer (Adeptus Mechanicus)" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "The Flesh is Weak 5", cost: 500, type: "talent", prerequisites: "The Flesh is Weak 4" },
        { name: "Mechadendrite Use (Medicae)", cost: 500, type: "talent", prerequisites: "Mechanicus Implants" },
      ]},
      { rank: 8, advances: [
        { name: "Command +10", cost: 200, type: "skill", prerequisites: "Command" },
        { name: "Common Lore (Rogue Traders) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Rogue Traders)" },
        { name: "Evaluate +10", cost: 200, type: "skill", prerequisites: "Evaluate" },
        { name: "Navigation (Stellar) +10", cost: 200, type: "skill", prerequisites: "Navigation (Stellar)" },
        { name: "Scholastic Lore (Numerology) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Numerology)" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Tech-Use)", cost: 200, type: "talent", prerequisites: "" },
        { name: "The Flesh is Weak 6", cost: 500, type: "talent", prerequisites: "The Flesh is Weak 5" },
        { name: "Void Tactician", cost: 500, type: "talent", prerequisites: "Int 35" },
      ]},
    ],
  },

  // ── MISSIONARY ────────────────────────────────────────────────────────────
  missionary: {
    id: "missionary",
    name: "Missionary",
    description: "Emissary of the Emperor's word. Healer, inspirer, and purger of heresy beyond the Imperium's light.",
    rankNames: [
      "Novice",           // 1
      "Initiate",         // 2
      "Missionary",       // 3
      "Confessor",        // 4
      "Deacon",           // 5
      "Archdeacon",       // 6
      "High Confessor",   // 7
      "Arch-Confessor",   // 8
    ],
    startingSkills: ["Common Lore (Imperial Creed)","Common Lore (Imperium)","Forbidden Lore (Heresy)","Medicae","Scholastic Lore (Imperial Creed)","Speak Language (High Gothic)","Speak Language (Low Gothic)"],
    startingTalents: ["Basic Weapon Training (Universal)","Melee Weapon Training (Universal)","Pure Faith","Unshakeable Faith"],
    startingGear: "Good-Craftsmanship chainsword or best-Craftsmanship staff. Good-Craftsmanship flamer or best-Craftsmanship lasgun. Best-Craftsmanship guard flak armour, Ecclesiarchal robes, aquila pendant, sepulchre, censer and incense, micro-bead.",
    characteristicAdvances: {
      ws:  [100, 250, 500, 750],
      bs:  [500, 750, 1000, 2500],
      str: [250, 500, 750, 1000],
      t:   [250, 500, 750, 1000],
      ag:  [250, 500, 750, 1000],
      int: [500, 750, 1000, 2500],
      per: [250, 500, 750, 1000],
      wp:  [100, 250, 500, 750],
      fel: [100, 250, 500, 750],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Charm", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Ecclesiarchy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Creed)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperium)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Heresy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Medicae", cost: 100, type: "skill", prerequisites: "" },
        { name: "Performer (Choose One)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Imperial Creed)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Ecclesiarchy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Melee Weapon Training (Primitive)", cost: 100, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Unshakeable Faith", cost: 200, type: "talent", prerequisites: "" },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Flame Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Pure Faith", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Blather", cost: 200, type: "skill", prerequisites: "" },
        { name: "Charm +10", cost: 200, type: "skill", prerequisites: "Charm" },
        { name: "Common Lore (Imperial Creed) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Creed)" },
        { name: "Common Lore (Imperium) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium)" },
        { name: "Deceive", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Forbidden Lore (Heresy) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Heresy)" },
        { name: "Medicae +10", cost: 200, type: "skill", prerequisites: "Medicae" },
        { name: "Scholastic Lore (Imperial Creed) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Imperial Creed)" },
        { name: "Armour of Contempt", cost: 200, type: "talent", prerequisites: "WP 40" },
        { name: "Frenzy", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hatred (Pirates)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Orthoproxy", cost: 200, type: "talent", prerequisites: "" },
        { name: "Resistance (Psychic Techniques)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Cleanse and Purify", cost: 500, type: "talent", prerequisites: "Flame Weapon Training (Universal)" },
        { name: "Crushing Blow", cost: 500, type: "talent", prerequisites: "S 40" },
        { name: "Divine Ministration", cost: 500, type: "talent", prerequisites: "Pure Faith" },
      ]},
      { rank: 3, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Blather +10", cost: 200, type: "skill", prerequisites: "Blather" },
        { name: "Charm +20", cost: 200, type: "skill", prerequisites: "Charm +10" },
        { name: "Climb", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Creed) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Creed) +10" },
        { name: "Common Lore (Imperium) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperium) +10" },
        { name: "Deceive +10", cost: 200, type: "skill", prerequisites: "Deceive" },
        { name: "Forbidden Lore (The Inquisition)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Heresy) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Heresy) +10" },
        { name: "Intimidate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Medicae +20", cost: 200, type: "skill", prerequisites: "Medicae +10" },
        { name: "Scholastic Lore (Imperial Creed) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Imperial Creed) +10" },
        { name: "Scrutiny", cost: 200, type: "skill", prerequisites: "" },
        { name: "Hatred (Mutants)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Iron Jaw", cost: 200, type: "talent", prerequisites: "T 40" },
        { name: "Paranoia", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Furious Assault", cost: 500, type: "talent", prerequisites: "WS 35" },
        { name: "Hatred (Choose One)", cost: 500, type: "talent", prerequisites: "" },
        { name: "True Grit", cost: 500, type: "talent", prerequisites: "T 40" },
      ]},
      { rank: 4, advances: [
        { name: "Blather +20", cost: 200, type: "skill", prerequisites: "Blather +10" },
        { name: "Carouse", cost: 200, type: "skill", prerequisites: "" },
        { name: "Climb +10", cost: 200, type: "skill", prerequisites: "Climb" },
        { name: "Deceive +20", cost: 200, type: "skill", prerequisites: "Deceive +10" },
        { name: "Intimidate +10", cost: 200, type: "skill", prerequisites: "Intimidate" },
        { name: "Scholastic Lore (Numerology)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scrutiny +10", cost: 200, type: "skill", prerequisites: "Scrutiny" },
        { name: "Trade (Voidfarer)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Hardy", cost: 200, type: "talent", prerequisites: "T 40" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Rapid Reload", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Battle Rage", cost: 500, type: "talent", prerequisites: "Frenzy" },
        { name: "Combat Master", cost: 500, type: "talent", prerequisites: "WS 30" },
        { name: "Into the Jaws of Hell", cost: 500, type: "talent", prerequisites: "Iron Discipline" },
        { name: "Jaded", cost: 500, type: "talent", prerequisites: "WP 30" },
        { name: "Sure Strike", cost: 500, type: "talent", prerequisites: "WS 30" },
        { name: "Swift Attack", cost: 500, type: "talent", prerequisites: "WS 35" },
      ]},
      { rank: 5, advances: [
        { name: "Carouse +10", cost: 200, type: "skill", prerequisites: "Carouse" },
        { name: "Climb +20", cost: 200, type: "skill", prerequisites: "Climb +10" },
        { name: "Forbidden Lore (The Inquisition) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (The Inquisition)" },
        { name: "Intimidate +20", cost: 200, type: "skill", prerequisites: "Intimidate +10" },
        { name: "Scholastic Lore (Numerology) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Numerology)" },
        { name: "Scrutiny +20", cost: 200, type: "skill", prerequisites: "Scrutiny +10" },
        { name: "Trade (Voidfarer) +10", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer)" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Double Team", cost: 200, type: "talent", prerequisites: "" },
        { name: "Nerves of Steel", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Air of Authority", cost: 500, type: "talent", prerequisites: "Fel 30" },
        { name: "Blademaster", cost: 500, type: "talent", prerequisites: "WS 30, Melee Weapon Training (any)" },
        { name: "Fearless", cost: 500, type: "talent", prerequisites: "" },
        { name: "Lightning Attack", cost: 500, type: "talent", prerequisites: "Swift Attack" },
        { name: "Master Orator", cost: 500, type: "talent", prerequisites: "Fel 30" },
      ]},
      { rank: 6, advances: [
        { name: "Carouse +20", cost: 200, type: "skill", prerequisites: "Carouse +10" },
        { name: "Ciphers (Underdeck)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Guard)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Navy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Numerology) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Numerology) +10" },
        { name: "Trade (Voidfarer) +20", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer) +10" },
        { name: "Good Reputation (Ecclesiarchy)", cost: 200, type: "talent", prerequisites: "Fel 50, Peer (Ecclesiarchy)" },
        { name: "Peer (Ecclesiarchy)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Unnatural Willpower (×2)", cost: 500, type: "talent", prerequisites: "WP 40, Pure Faith" },
        { name: "Wall of Steel", cost: 500, type: "talent", prerequisites: "Ag 35" },
      ]},
      { rank: 7, advances: [
        { name: "Charm +20 (if not gained)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Guard) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard)" },
        { name: "Common Lore (Imperial Navy) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy)" },
        { name: "Ciphers (Underdeck) +10", cost: 200, type: "skill", prerequisites: "Ciphers (Underdeck)" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Duty Unto Death", cost: 500, type: "talent", prerequisites: "WP 45" },
        { name: "Strong Minded", cost: 500, type: "talent", prerequisites: "WP 30, Resistance (Psychic Powers)" },
      ]},
      { rank: 8, advances: [
        { name: "Common Lore (Imperial Guard) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Guard) +10" },
        { name: "Common Lore (Imperial Navy) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy) +10" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Peer (Imperial Guard)", cost: 200, type: "talent", prerequisites: "Fel 30" },
      ]},
    ],
  },

  // ── NAVIGATOR ─────────────────────────────────────────────────────────────
  navigator: {
    id: "navigator",
    name: "Navigator",
    description: "Member of the Navis Nobilite. Mutant guide through the Immaterium, essential for warp travel.",
    rankNames: [
      "Novice Navigator",      // 1
      "Intermediate Navigator",// 2
      "Navigator",             // 3
      "Senior Navigator",      // 4
      "Master Navigator",      // 5
      "Navigator Prime",       // 6
      "Grand Navigator",       // 7
      "Peer of the Navis Nobilite", // 8
    ],
    startingSkills: ["Common Lore (Navis Nobilite)","Forbidden Lore (Navigators)","Forbidden Lore (Warp)","Literacy","Navigation (Stellar)","Navigation (Warp)","Psyniscience","Scholastic Lore (Astromancy)","Speak Language (High Gothic)","Speak Language (Low Gothic)"],
    startingTalents: ["Navigator","Pistol Weapon Training (Universal)"],
    startingGear: "Best-Craftsmanship hellpistol or hand cannon. Best-Craftsmanship metal staff. Best-Craftsmanship mesh armour, void suit, micro-bead, warp eye covering.",
    characteristicAdvances: {
      ws:  [500, 750, 1000, 2500],
      bs:  [500, 750, 1000, 2500],
      str: [500, 750, 1000, 2500],
      t:   [250, 500, 750, 1000],
      ag:  [250, 500, 750, 1000],
      int: [100, 250, 500, 750],
      per: [100, 250, 500, 750],
      wp:  [100, 250, 500, 750],
      fel: [250, 500, 750, 1000],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Ciphers (Navis Nobilite)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Navis Nobilite)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Navigators)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Warp)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Navigation (Stellar)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Navigation (Warp)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Psyniscience", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Cryptology)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Speak Language (Trader's Cant)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Navigator", cost: 500, type: "talent", prerequisites: "" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Charm", cost: 200, type: "skill", prerequisites: "" },
        { name: "Ciphers (Navis Nobilite) +10", cost: 200, type: "skill", prerequisites: "Ciphers (Navis Nobilite)" },
        { name: "Common Lore (Navis Nobilite) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Navis Nobilite)" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Forbidden Lore (Navigators) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Navigators)" },
        { name: "Forbidden Lore (Warp) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Warp)" },
        { name: "Navigation (Stellar) +10", cost: 200, type: "skill", prerequisites: "Navigation (Stellar)" },
        { name: "Navigation (Warp) +10", cost: 200, type: "skill", prerequisites: "Navigation (Warp)" },
        { name: "Psyniscience +10", cost: 200, type: "skill", prerequisites: "Psyniscience" },
        { name: "Scholastic Lore (Astromancy) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy)" },
        { name: "Scrutiny", cost: 200, type: "skill", prerequisites: "" },
        { name: "Resistance (Psychic Powers)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Total Recall", cost: 200, type: "talent", prerequisites: "" },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Warp Sense", cost: 500, type: "talent", prerequisites: "Navigator or Psy Rating, Per 30" },
      ]},
      { rank: 3, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Ciphers (Navis Nobilite) +20", cost: 200, type: "skill", prerequisites: "Ciphers (Navis Nobilite) +10" },
        { name: "Common Lore (Navis Nobilite) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Navis Nobilite) +10" },
        { name: "Charm +10", cost: 200, type: "skill", prerequisites: "Charm" },
        { name: "Common Lore (Koronus Expanse)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Dodge +20", cost: 200, type: "skill", prerequisites: "Dodge +10" },
        { name: "Forbidden Lore (Navigators) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Navigators) +10" },
        { name: "Forbidden Lore (Warp) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Warp) +10" },
        { name: "Navigation (Stellar) +20", cost: 200, type: "skill", prerequisites: "Navigation (Stellar) +10" },
        { name: "Navigation (Warp) +20", cost: 200, type: "skill", prerequisites: "Navigation (Warp) +10" },
        { name: "Psyniscience +20", cost: 200, type: "skill", prerequisites: "Psyniscience +10" },
        { name: "Scholastic Lore (Astromancy) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy) +10" },
        { name: "Scrutiny +10", cost: 200, type: "skill", prerequisites: "Scrutiny" },
        { name: "Peer (Navigators)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Improved Warp Sense", cost: 500, type: "talent", prerequisites: "Warp Sense" },
      ]},
      { rank: 4, advances: [
        { name: "Charm +20", cost: 200, type: "skill", prerequisites: "Charm +10" },
        { name: "Commerce", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (Koronus Expanse) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse)" },
        { name: "Scrutiny +20", cost: 200, type: "skill", prerequisites: "Scrutiny +10" },
        { name: "Evaluate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Armour of Contempt", cost: 200, type: "talent", prerequisites: "WP 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Strong Minded", cost: 500, type: "talent", prerequisites: "WP 30, Resistance (Psychic Powers)" },
      ]},
      { rank: 5, advances: [
        { name: "Barter", cost: 200, type: "skill", prerequisites: "" },
        { name: "Commerce +10", cost: 200, type: "skill", prerequisites: "Commerce" },
        { name: "Common Lore (Koronus Expanse) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse) +10" },
        { name: "Evaluate +10", cost: 200, type: "skill", prerequisites: "Evaluate" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Bastion of Iron Will", cost: 500, type: "talent", prerequisites: "Psy Rating, Strong Minded, WP 40" },
        { name: "Warp Lock", cost: 500, type: "talent", prerequisites: "WP 50, Bastion of Iron Will" },
      ]},
      { rank: 6, advances: [
        { name: "Barter +10", cost: 200, type: "skill", prerequisites: "Barter" },
        { name: "Commerce +20", cost: 200, type: "skill", prerequisites: "Commerce +10" },
        { name: "Evaluate +20", cost: 200, type: "skill", prerequisites: "Evaluate +10" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Good Reputation (Navis Nobilite)", cost: 200, type: "talent", prerequisites: "Fel 50, Peer (Navigators)" },
      ]},
      { rank: 7, advances: [
        { name: "Barter +20", cost: 200, type: "skill", prerequisites: "Barter +10" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
      ]},
      { rank: 8, advances: [
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Navigator Power", cost: 200, type: "talent", prerequisites: "" },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
      ]},
    ],
  },

  // ── SENESCHAL ─────────────────────────────────────────────────────────────
  seneschal: {
    id: "seneschal",
    name: "Seneschal",
    description: "Keeper of secret knowledge and subtle investigator. Master of information, trade, and the underworld.",
    rankNames: [
      "Factotum",         // 1
      "Agent",            // 2
      "Factor",           // 3
      "Senior Factor",    // 4
      "Seneschal",        // 5
      "Chief Seneschal",  // 6
      "High Seneschal",   // 7
      "Grand Seneschal",  // 8
    ],
    startingSkills: ["Barter","Commerce","Common Lore (Underworld)","Deceive","Evaluate","Forbidden Lore (Archeotech)","Inquiry","Literacy","Speak Language (Low Gothic)","Speak Language (Trader's Cant)"],
    startingTalents: ["Basic Weapon Training (Universal)","Pistol Weapon Training (Universal)"],
    startingGear: "Best-Craftsmanship hellpistol or inferno pistol. Best-Craftsmanship hellgun or best-Craftsmanship hunting rifle. Mesh armour, void suit, micro-bead, set of fine clothing, dataslate loaded with cargo manifests.",
    characteristicAdvances: {
      ws:  [500, 750, 1000, 2500],
      bs:  [250, 500, 750, 1000],
      str: [500, 750, 1000, 2500],
      t:   [500, 750, 1000, 2500],
      ag:  [100, 250, 500, 750],
      int: [100, 250, 500, 750],
      per: [100, 250, 500, 750],
      wp:  [250, 500, 750, 1000],
      fel: [100, 250, 500, 750],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Barter", cost: 100, type: "skill", prerequisites: "" },
        { name: "Commerce", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Underworld)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Deceive", cost: 100, type: "skill", prerequisites: "" },
        { name: "Evaluate", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Archeotech)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Inquiry", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Speak Language (Trader's Cant)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Speak Language (Low Gothic)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Ambidextrous", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Barter +10", cost: 200, type: "skill", prerequisites: "Barter" },
        { name: "Blather", cost: 200, type: "skill", prerequisites: "" },
        { name: "Ciphers (Underworld)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Commerce +10", cost: 200, type: "skill", prerequisites: "Commerce" },
        { name: "Common Lore (Koronus Expanse)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Deceive +10", cost: 200, type: "skill", prerequisites: "Deceive" },
        { name: "Evaluate +10", cost: 200, type: "skill", prerequisites: "Evaluate" },
        { name: "Forbidden Lore (Archeotech) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Archeotech)" },
        { name: "Gamble", cost: 200, type: "skill", prerequisites: "" },
        { name: "Inquiry +10", cost: 200, type: "skill", prerequisites: "Inquiry" },
        { name: "Jaded", cost: 200, type: "talent", prerequisites: "WP 30" },
        { name: "Quick Draw", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Commerce)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Primitive)", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 3, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Barter +20", cost: 200, type: "skill", prerequisites: "Barter +10" },
        { name: "Blather +10", cost: 200, type: "skill", prerequisites: "Blather" },
        { name: "Ciphers (Underworld) +10", cost: 200, type: "skill", prerequisites: "Ciphers (Underworld)" },
        { name: "Commerce +20", cost: 200, type: "skill", prerequisites: "Commerce +10" },
        { name: "Common Lore (Koronus Expanse) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse)" },
        { name: "Deceive +20", cost: 200, type: "skill", prerequisites: "Deceive +10" },
        { name: "Evaluate +20", cost: 200, type: "skill", prerequisites: "Evaluate +10" },
        { name: "Gamble +10", cost: 200, type: "skill", prerequisites: "Gamble" },
        { name: "Inquiry +20", cost: 200, type: "skill", prerequisites: "Inquiry +10" },
        { name: "Scrutiny", cost: 200, type: "skill", prerequisites: "" },
        { name: "Sleight of Hand", cost: 200, type: "skill", prerequisites: "" },
        { name: "Paranoia", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Talented (Evaluate)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hard Bargain", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 4, advances: [
        { name: "Blather +20", cost: 200, type: "skill", prerequisites: "Blather +10" },
        { name: "Ciphers (Underworld) +20", cost: 200, type: "skill", prerequisites: "Ciphers (Underworld) +10" },
        { name: "Common Lore (Koronus Expanse) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse) +10" },
        { name: "Forbidden Lore (Archeotech) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Archeotech) +10" },
        { name: "Gamble +20", cost: 200, type: "skill", prerequisites: "Gamble +10" },
        { name: "Intimidate", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Bureaucracy)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Scrutiny +10", cost: 200, type: "skill", prerequisites: "Scrutiny" },
        { name: "Sleight of Hand +10", cost: 200, type: "skill", prerequisites: "Sleight of Hand" },
        { name: "Trade (Voidfarer)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Peer (Underworld)", cost: 200, type: "talent", prerequisites: "Fel 30" },
        { name: "Into the Jaws of Hell", cost: 500, type: "talent", prerequisites: "Iron Discipline" },
        { name: "Master Orator", cost: 500, type: "talent", prerequisites: "Fel 30" },
      ]},
      { rank: 5, advances: [
        { name: "Intimidate +10", cost: 200, type: "skill", prerequisites: "Intimidate" },
        { name: "Scholastic Lore (Bureaucracy) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Bureaucracy)" },
        { name: "Scrutiny +20", cost: 200, type: "skill", prerequisites: "Scrutiny +10" },
        { name: "Sleight of Hand +20", cost: 200, type: "skill", prerequisites: "Sleight of Hand +10" },
        { name: "Trade (Voidfarer) +10", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer)" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Good Reputation (Underworld)", cost: 200, type: "talent", prerequisites: "Fel 50, Peer (Underworld)" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Hip Shooting", cost: 500, type: "talent", prerequisites: "BS 40, Ag 40" },
        { name: "Step Aside", cost: 500, type: "talent", prerequisites: "Ag 40, Dodge" },
      ]},
      { rank: 6, advances: [
        { name: "Intimidate +20", cost: 200, type: "skill", prerequisites: "Intimidate +10" },
        { name: "Scholastic Lore (Bureaucracy) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Bureaucracy) +10" },
        { name: "Trade (Voidfarer) +20", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer) +10" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Inquiry)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Gunslinger", cost: 500, type: "talent", prerequisites: "BS 40, Two-Weapon Wielder (Ballistic)" },
      ]},
      { rank: 7, advances: [
        { name: "Disguise", cost: 200, type: "skill", prerequisites: "" },
        { name: "Security", cost: 200, type: "skill", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Fearless", cost: 500, type: "talent", prerequisites: "" },
      ]},
      { rank: 8, advances: [
        { name: "Disguise +10", cost: 200, type: "skill", prerequisites: "Disguise" },
        { name: "Security +10", cost: 200, type: "skill", prerequisites: "Security" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
      ]},
    ],
  },

  // ── VOID-MASTER ───────────────────────────────────────────────────────────
  voidMaster: {
    id: "voidMaster",
    name: "Void-Master",
    description: "Pilot, gunner, and master of the void. Born to the spaces between stars, at home on the bridge.",
    rankNames: [
      "Able Crewman",    // 1
      "Voidsman",        // 2
      "Able Voidsman",   // 3
      "Senior Voidsman", // 4
      "Void-Master",     // 5
      "Senior Void-Master", // 6
      "Master of the Void", // 7
      "Grand Void-Master",  // 8
    ],
    startingSkills: ["Common Lore (Imperial Navy)","Common Lore (War)","Forbidden Lore (Xenos)","Navigation (Stellar)","Pilot (Space Craft)","Pilot (Flyers)","Scholastic Lore (Astromancy)","Speak Language (Low Gothic)"],
    startingTalents: ["Pistol Weapon Training (Universal)","Melee Weapon Training (Universal)","Nerves of Steel"],
    startingGear: "Best-Craftsmanship mono-sword or power sword. Best-Craftsmanship hand cannon or bolt pistol. Mesh armour, void suit, micro-bead.",
    characteristicAdvances: {
      ws:  [250, 500, 750, 1000],
      bs:  [100, 250, 500, 750],
      str: [500, 750, 1000, 2500],
      t:   [500, 750, 1000, 2500],
      ag:  [100, 250, 500, 750],
      int: [250, 500, 750, 1000],
      per: [100, 250, 500, 750],
      wp:  [250, 500, 750, 1000],
      fel: [500, 750, 1000, 2500],
    },
    ranks: [
      { rank: 1, advances: [
        { name: "Awareness", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (Imperial Navy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Common Lore (War)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Dodge", cost: 100, type: "skill", prerequisites: "" },
        { name: "Forbidden Lore (Xenos)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Literacy", cost: 100, type: "skill", prerequisites: "" },
        { name: "Navigation (Stellar)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Pilot (Space Craft)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Pilot (Flyers)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Scholastic Lore (Astromancy)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Military)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Secret Tongue (Rogue Trader)", cost: 100, type: "skill", prerequisites: "" },
        { name: "Nerves of Steel", cost: 200, type: "talent", prerequisites: "" },
        { name: "Pistol Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Melee Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "" },
        { name: "Void Accustomed", cost: 200, type: "talent", prerequisites: "" },
      ]},
      { rank: 2, advances: [
        { name: "Awareness +10", cost: 200, type: "skill", prerequisites: "Awareness" },
        { name: "Common Lore (Imperial Navy) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy)" },
        { name: "Common Lore (War) +10", cost: 200, type: "skill", prerequisites: "Common Lore (War)" },
        { name: "Dodge +10", cost: 200, type: "skill", prerequisites: "Dodge" },
        { name: "Forbidden Lore (Xenos) +10", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Xenos)" },
        { name: "Navigation (Stellar) +10", cost: 200, type: "skill", prerequisites: "Navigation (Stellar)" },
        { name: "Pilot (Space Craft) +10", cost: 200, type: "skill", prerequisites: "Pilot (Space Craft)" },
        { name: "Pilot (Flyers) +10", cost: 200, type: "skill", prerequisites: "Pilot (Flyers)" },
        { name: "Scholastic Lore (Astromancy) +10", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy)" },
        { name: "Tech-Use", cost: 200, type: "skill", prerequisites: "" },
        { name: "Catfall", cost: 200, type: "talent", prerequisites: "Ag 30" },
        { name: "Rapid Reaction", cost: 200, type: "talent", prerequisites: "Ag 40" },
        { name: "Rapid Reload", cost: 200, type: "talent", prerequisites: "" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Basic Weapon Training (Universal)", cost: 500, type: "talent", prerequisites: "" },
        { name: "Deadeye Shot", cost: 500, type: "talent", prerequisites: "BS 30" },
      ]},
      { rank: 3, advances: [
        { name: "Awareness +20", cost: 200, type: "skill", prerequisites: "Awareness +10" },
        { name: "Common Lore (Imperial Navy) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Imperial Navy) +10" },
        { name: "Common Lore (Koronus Expanse)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Common Lore (War) +20", cost: 200, type: "skill", prerequisites: "Common Lore (War) +10" },
        { name: "Dodge +20", cost: 200, type: "skill", prerequisites: "Dodge +10" },
        { name: "Navigation (Stellar) +20", cost: 200, type: "skill", prerequisites: "Navigation (Stellar) +10" },
        { name: "Navigation (Warp)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Pilot (Space Craft) +20", cost: 200, type: "skill", prerequisites: "Pilot (Space Craft) +10" },
        { name: "Pilot (Flyers) +20", cost: 200, type: "skill", prerequisites: "Pilot (Flyers) +10" },
        { name: "Scholastic Lore (Astromancy) +20", cost: 200, type: "skill", prerequisites: "Scholastic Lore (Astromancy) +10" },
        { name: "Tech-Use +10", cost: 200, type: "skill", prerequisites: "Tech-Use" },
        { name: "Forbidden Lore (Xenos) +20", cost: 200, type: "skill", prerequisites: "Forbidden Lore (Xenos) +10" },
        { name: "Hard Target", cost: 200, type: "talent", prerequisites: "Ag 40" },
        { name: "Marksman", cost: 200, type: "talent", prerequisites: "BS 35" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Crack Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Independent Targeting", cost: 500, type: "talent", prerequisites: "BS 40" },
      ]},
      { rank: 4, advances: [
        { name: "Common Lore (Koronus Expanse) +10", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse)" },
        { name: "Navigation (Warp) +10", cost: 200, type: "skill", prerequisites: "Navigation (Warp)" },
        { name: "Tech-Use +20", cost: 200, type: "skill", prerequisites: "Tech-Use +10" },
        { name: "Trade (Voidfarer)", cost: 200, type: "skill", prerequisites: "" },
        { name: "Blind Fighting", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Hip Shooting", cost: 200, type: "talent", prerequisites: "BS 40, Ag 40" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Mighty Shot", cost: 500, type: "talent", prerequisites: "BS 40" },
        { name: "Void Tactician", cost: 500, type: "talent", prerequisites: "Int 35" },
      ]},
      { rank: 5, advances: [
        { name: "Common Lore (Koronus Expanse) +20", cost: 200, type: "skill", prerequisites: "Common Lore (Koronus Expanse) +10" },
        { name: "Navigation (Warp) +20", cost: 200, type: "skill", prerequisites: "Navigation (Warp) +10" },
        { name: "Trade (Voidfarer) +10", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer)" },
        { name: "Jaded", cost: 200, type: "talent", prerequisites: "WP 30" },
        { name: "Light Sleeper", cost: 200, type: "talent", prerequisites: "Per 30" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Master & Commander", cost: 500, type: "talent", prerequisites: "Int 35, Fel 35" },
      ]},
      { rank: 6, advances: [
        { name: "Trade (Voidfarer) +20", cost: 200, type: "skill", prerequisites: "Trade (Voidfarer) +10" },
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Pilot)", cost: 200, type: "talent", prerequisites: "" },
      ]},
      { rank: 7, advances: [
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Fearless", cost: 500, type: "talent", prerequisites: "" },
        { name: "Into the Jaws of Hell", cost: 500, type: "talent", prerequisites: "Iron Discipline" },
      ]},
      { rank: 8, advances: [
        { name: "Sound Constitution", cost: 200, type: "talent", prerequisites: "", multiplier: 2 },
        { name: "Talented (Choose One)", cost: 200, type: "talent", prerequisites: "" },
        { name: "Lightning Reflexes", cost: 500, type: "talent", prerequisites: "" },
      ]},
    ],
  },
};

// ---------------------------------------------------------------------------
// Career system helpers
// ---------------------------------------------------------------------------

/**
 * Get all careers — core + any custom careers stored on the actor.
 * @param {Actor} actor
 * @returns {object} merged career map keyed by career id
 */
export function getAllCareers(actor) {
  const custom = actor?.system?.customCareers ?? {};
  return { ...CAREERS, ...custom };
}

/**
 * Get the career object for a given actor, or null if none is set.
 * @param {Actor} actor
 * @returns {object|null}
 */
export function getActorCareer(actor) {
  const careerId = actor?.system?.biography?.careerId;
  if (!careerId) return null;
  return getAllCareers(actor)[careerId] ?? null;
}

/**
 * Get the rank number (1-8) from spent XP.
 * @param {number} spent
 * @returns {number}
 */
export function rankFromXP(spent) {
  if (spent <  7000) return 1;
  if (spent < 10000) return 2;
  if (spent < 13000) return 3;
  if (spent < 17000) return 4;
  if (spent < 21000) return 5;
  if (spent < 25000) return 6;
  if (spent < 30000) return 7;
  return 8;
}

/**
 * Get the rank name for an actor based on their career and spent XP.
 * @param {Actor} actor
 * @returns {string}
 */
export function getRankName(actor) {
  const career = getActorCareer(actor);
  const rank   = rankFromXP(actor?.system?.experience?.spent ?? 0);
  return career?.rankNames?.[rank - 1] ?? `Rank ${rank}`;
}

/**
 * Get all advances available to an actor at their current and previous ranks.
 * @param {Actor} actor
 * @returns {Array} flat list of advance objects with isInCareer: true
 */
export function getAvailableAdvances(actor) {
  const career  = getActorCareer(actor);
  if (!career) return [];
  const rank    = rankFromXP(actor?.system?.experience?.spent ?? 0);
  const advances = [];
  for (let r = 1; r <= rank; r++) {
    const rankData = career.ranks.find(rd => rd.rank === r);
    if (!rankData) continue;
    for (const adv of rankData.advances) {
      advances.push({ ...adv, rank: r, isInCareer: true });
    }
  }
  return advances;
}

/**
 * Check whether a named advance is in-career for the actor.
 * @param {Actor} actor
 * @param {string} advanceName
 * @returns {boolean}
 */
export function isInCareer(actor, advanceName) {
  const available = getAvailableAdvances(actor);
  const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  return available.some(a => norm(a.name) === norm(advanceName));
}

/**
 * Compute the out-of-career XP cost multiplier (×1.5, rounded up to nearest 25).
 * @param {number} baseCost
 * @returns {number}
 */
export function outOfCareerCost(baseCost) {
  const raw = baseCost * 1.5;
  return Math.ceil(raw / 25) * 25;
}

/**
 * Get characteristic advance cost for an actor's career.
 * @param {Actor} actor
 * @param {string} charKey  e.g. "ws"
 * @param {number} level    0 = Simple, 1 = Intermediate, 2 = Trained, 3 = Expert
 * @returns {number|null}
 */
export function getCharAdvanceCost(actor, charKey, level) {
  const career = getActorCareer(actor);
  if (!career) return null;
  return career.characteristicAdvances?.[charKey]?.[level] ?? null;
}
