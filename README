# Warhammer 40,000: Rogue Trader (Unofficial)
### A Foundry VTT Game System

> *"Sometimes, you consult the appropriate treaties on Tactica Imperialis and weigh every step. Sometimes though, you just fire your biggest cannon and save the day"*

An unofficial, fan-built implementation of the **Warhammer 40,000: Rogue Trader** tabletop roleplaying game by Fantasy Flight Games for [Foundry Virtual Tabletop](https://foundryvtt.com/).

---

## ⚠️ Legal Notice

This system is **unofficial and fan-made**. It is not affiliated with, endorsed by, or produced by Fantasy Flight Games, Games Workshop, or Cubicle 7. Warhammer 40,000: Rogue Trader is a trademark of Games Workshop Ltd. You will need a copy of the **Rogue Trader Core Rulebook** to play.

---

## Requirements

| | |
|---|---|
| Foundry VTT | v13 (minimum), v13.351 (verified) |
| Game System | This *is* the game system — no base system required |
| Rulebook | Warhammer 40,000: Rogue Trader Core Rulebook (FFG) |

---

## Installation

### Via Manifest URL
1. In Foundry Setup, go to **Game Systems → Install System**
2. Paste the manifest URL into the field at the bottom and click Install

### Manual Installation
1. Download the latest release zip from the Releases page
2. Extract to your Foundry user data folder at:
   ```
   {userData}/Data/systems/rogue-trader-unofficial/
   ```
   Ensure `system.json` sits at the root of that folder
3. Restart Foundry and enable the system when creating a new world

---

## Features

### Actor Types

**Explorer (Player Character)**
Full character sheet covering:
- All 9 characteristics (WS, BS, S, T, Ag, Int, Per, WP, Fel) with base, advance purchases, and modifiers — click any to roll a test
- Derived values calculated automatically: characteristic bonuses, movement from Agility Bonus, rank from XP spent
- Wounds, Fate Points (clickable pips), Insanity Points, Corruption Points, and Fatigue
- Armour Points auto-summed per hit location from all equipped armour items
- Six-tab layout: Main · Skills · Talents · Gear · Wounds & Conditions · Psychic · Biography
- Full Origin Path fields (Home World, Birthright, Lure of the Void, Trials & Travails, Motivation, Career)
- XP spend dialog with tabs for Characteristics, Skills, and manual entry
- Profit Factor acquisition roll button
- Psy Rating and psychic class tracking; psychic tab hidden automatically for non-psykers

**NPC / Adversary**
Compact sheet covering all 9 characteristics, Wounds, movement, armour points per location, Fear rating, size classification, traits/special rules textarea, weapons table, and GM notes.

**Voidship**
Full starship sheet covering:
- Core hull statistics: Speed, Manoeuvrability, Detection, Armour, Turret Rating, Ship Points
- Hull Integrity with animated health bar and pulsing CRIPPLED badge at 0
- Void Shield pips (blue glow when active, click to raise/lower)
- Crew Population and Morale with colour-coded bars; decreasing Hull Integrity automatically reduces both
- Power budget bar (auto-sums all component costs, turns red on overload)
- Space budget bar
- Five-tab layout: Overview · Weapons · Components · Crew & Morale · History
- Weapons management across six arcs (Prow, Dorsal, Port, Starboard, Keel, Aft)
- Essential and supplemental component tracking
- Complications (Machine Spirit Oddity, Past History) and Endeavour tracker

### Item Types

| Type | Description |
|---|---|
| **Weapon** | All classes (Pistol, Basic, Heavy, Melee, Thrown, Exotic) with RoF, damage formula, penetration, clip, reload, and qualities |
| **Armour** | Type, AP per hit location, max Agility, qualities |
| **Gear** | Quantity, weight, craftsmanship, availability |
| **Talent** | Prerequisites and source page reference |
| **Skill** | Governing characteristic, Basic/Advanced type, training level (+0/+10/+20) |
| **Psychic Power** | Discipline, minimum Psy Rating, action type, range, sustained flag |
| **Cybernetic** | Type (limb, sensory, cranial), craftsmanship |

### Dice & Roll System

All rolls use the core **d100 equal-or-under** system:

- **Characteristic / Skill Tests** — roll d100 vs. target number; Degrees of Success/Failure calculated automatically (floor of difference ÷ 10)
- **Automatic results** — 01–05 always succeeds; 96–00 always fails
- **Righteous Fury** — detected automatically on maximum die result during damage rolls; flagged prominently in the chat card
- **Opposed Tests** — both sides roll simultaneously; winner determined by success vs. failure, then DoS comparison, then raw characteristic as tiebreaker
- **Focus Power (Psychic)** — full three-mode system:
  - *Fettered* (PR÷2, no phenomena)
  - *Unfettered* (full PR, phenomena on doubles)
  - *Pushed* (PR +1 to +3/4, always rolls phenomena)
  - Psychic Phenomena table (25 entries, d100) and Perils of the Warp table (16 entries, d100) built in, triggered and resolved automatically
- **Profit Factor Acquisition** — full availability modifier table, Commerce test modifier, PF Strain on Scarce+ items (1d5 PF loss rolled and applied automatically)
- **Void Combat** — macrobattery and lance fire resolution with hits calculation, critical hit detection, and Void Shield absorption notes
- **Ship Tests** — one-click rolls for BS (firing), Pilot + Manoeuvrability, Scrutiny + Detection, Tech-Use, and Command

Every roll presents a modifier prompt before rolling and posts a styled chat card showing the roll, target, and outcome.

### Compendium Packs

| Pack | Contents |
|---|---|
| **RT: Weapons** | 12 core weapons (bolt, las, auto, plasma, melee, heavy) |
| **RT: Armour** | 8 armour types (flak, mesh, carapace, power, void suit, xenos hide) |
| **RT: Skills** | 48 skills — every core skill with correct governing characteristic and Basic/Advanced classification |
| **RT: Talents** | 50 talents with prerequisites and source page references |
| **RT: Macros** | 6 pre-built macros (see below) |

### Macros

All macros are available from the Macros compendium and as functions on `game.rogueTrader`:

| Macro | Hotkey Usage |
|---|---|
| **RT: Characteristic Test** | Select token → pick stat → modifier → roll |
| **RT: Opposed Test** | Select token, target one token → dialog → both roll simultaneously |
| **RT: Focus Power** | Select psyker token → power name → strength mode → roll with full phenomena resolution |
| **RT: Acquisition Roll** | Select token → availability, commerce modifier, situational modifier → PF roll |
| **RT: Spend XP** | Select token → full XP dialog (characteristics, skills, manual) |
| **RT: Generate Characteristics** | Rolls 2d10+25 nine times and posts all values to chat for character creation |

```js
// All macros also callable directly from the console or other macros:
game.rogueTrader.rollOpposed();
game.rogueTrader.rollFocusPower();
game.rogueTrader.rollAcquisition();
game.rogueTrader.rollCharacteristic();
game.rogueTrader.spendXP();
game.rogueTrader.generateCharacteristics();
```

---

### Initiative

Initiative in void combat and personal combat uses the standard RT rule: **Agility Bonus** (tens digit of Agility). Foundry's combat tracker is wired to use this automatically. Ties are broken by full Agility value.

---

## Known Limitations & Roadmap

- [ ] Automatic wound threshold effects (Lightly/Heavily/Critically Wounded penalties)
- [ ] Malignancy Test automation at Corruption thresholds
- [ ] Trauma Test automation at Insanity thresholds
- [ ] Critical Hit table (personal combat) built-in roller
- [ ] Navigator special abilities sheet section
- [ ] Astropath Transcendent soul-binding mechanics
- [ ] Ship-to-ship boarding combat tracker
- [ ] Warp travel and Navigation roll automation
- [ ] Translation support beyond English

---

## Acknowledgements

Built with reference to the **Warhammer 40,000: Rogue Trader Core Rulebook** (Fantasy Flight Games, 2009). All game mechanics belong to their respective rights holders. This system implementation is released under the MIT License — do whatever you like with the code, attribution appreciated.

*"The stars await, explorer. What will you find in the dark between them?"*