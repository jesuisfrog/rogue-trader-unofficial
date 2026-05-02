/**
 * rogue-trader-unofficial | career-dialog.js
 *
 * Three dialogs:
 *
 * 1. CareerSelectionDialog  — pick a career during character creation,
 *                             applies starting skills, talents, and stat bonuses
 *
 * 2. CareerTabApp           — the Career tab rendered inside the character sheet
 *                             showing rank name, available advances, and a
 *                             custom career editor
 *
 * 3. CustomCareerEditorDialog — build a homebrew career with the same structure
 *                               as a core career (stored on the actor)
 */

import {
  CAREERS,
  getAllCareers,
  getActorCareer,
  rankFromXP,
  getRankName,
  getAvailableAdvances,
  isInCareer,
  outOfCareerCost,
  getCharAdvanceCost,
} from "../careers.js";

const SYSTEM_ID = "rogue-trader-unofficial";

const CHAR_ABBR = {
  ws: "WS", bs: "BS", str: "S", t: "T",
  ag: "Ag", int: "Int", per: "Per", wp: "WP", fel: "Fel",
};

const CHAR_FULL = {
  ws: "Weapon Skill", bs: "Ballistic Skill", str: "Strength",
  t: "Toughness",     ag: "Agility",          int: "Intelligence",
  per: "Perception",  wp: "Willpower",         fel: "Fellowship",
};

// ── XP rank thresholds ───────────────────────────────────────────────────────
const RANK_XP = [5000, 7000, 10000, 13000, 17000, 21000, 25000, 30000];

// ============================================================================
// 1. CAREER SELECTION DIALOG
// ============================================================================

export class CareerSelectionDialog extends Application {

  constructor(actor, options = {}) {
    super(options);
    this._actor    = actor;
    this._selected = actor.system.biography?.careerId ?? null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id:        `${SYSTEM_ID}-career-select`,
      title:     "Select Career Path",
      template:  `systems/${SYSTEM_ID}/templates/dialogs/career-select.hbs`,
      width:     640,
      height:    520,
      resizable: true,
      classes:   ["rogue-trader", `${SYSTEM_ID}-dialog`],
    });
  }

  getData() {
    const all     = getAllCareers(this._actor);
    const careers = Object.values(all).map(c => ({
      id:          c.id,
      name:        c.name,
      description: c.description,
      selected:    c.id === this._selected,
      rankNames:   c.rankNames,
      startingSkills:  c.startingSkills?.join(", ") ?? "",
      startingTalents: c.startingTalents?.join(", ") ?? "",
    }));

    return {
      careers,
      selectedCareer: this._selected ? all[this._selected] : null,
      isNew: !this._actor.system.biography?.careerId,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".career-card").on("click", (e) => {
      const id = e.currentTarget.dataset.careerId;
      this._selected = id;
      html.find(".career-card").removeClass("selected");
      e.currentTarget.classList.add("selected");
      // Update preview panel
      const career = getAllCareers(this._actor)[id];
      html.find(".career-preview-name").text(career.name);
      html.find(".career-preview-desc").text(career.description);
      html.find(".career-preview-skills").text(career.startingSkills?.join(", ") ?? "—");
      html.find(".career-preview-talents").text(career.startingTalents?.join(", ") ?? "—");
      html.find(".career-preview-gear").text(career.startingGear ?? "—");
      html.find("[data-action='confirm']").prop("disabled", false);
    });

    html.find("[data-action='confirm']").on("click", () => this._onConfirm());
    html.find("[data-action='cancel']").on("click", () => this.close());
    html.find("[data-action='custom']").on("click", () => {
      this.close();
      new CustomCareerEditorDialog(this._actor).render(true);
    });
  }

  async _onConfirm() {
    if (!this._selected) return;

    const career    = getAllCareers(this._actor)[this._selected];
    const isNew     = !this._actor.system.biography?.careerId;
    const oldCareerId = this._actor.system.biography?.careerId;

    // Confirm if changing an existing career
    if (!isNew && oldCareerId !== this._selected) {
      const ok = await Dialog.confirm({
        title:   "Change Career?",
        content: `<p>Changing careers will <strong>not</strong> remove previously purchased advances but will change which future advances are in-career. Are you sure?</p>`,
      });
      if (!ok) return;
    }

    const updates = {
      "system.biography.careerId":   this._selected,
      "system.biography.careerName": career.name,
      "system.biography.career":     career.name,
    };

    // Apply starting bonuses only on first-time career selection
    if (isNew && career.startingSkills) {
      ui.notifications.info(
        `Career set to ${career.name}. Starting skills and talents listed in the career description — add them manually via the Skills and Talents tabs or drag from compendiums.`
      );
    }

    await this._actor.update(updates);
    ui.notifications.info(`Career path set to: ${career.name}.`);
    this.close();

    // Re-render any open actor sheets
    this._actor.sheet?.render(false);
  }
}

// ============================================================================
// 2. CUSTOM CAREER EDITOR
// ============================================================================

export class CustomCareerEditorDialog extends Application {

  constructor(actor, existingId = null, options = {}) {
    super(options);
    this._actor      = actor;
    this._existingId = existingId;

    // Seed with blank or existing career
    if (existingId) {
      const existing = getAllCareers(actor)[existingId];
      this._draft = foundry.utils.deepClone(existing);
    } else {
      this._draft = {
        id:          "",
        name:        "",
        description: "",
        rankNames:   ["","","","","","","",""],
        startingSkills:   [],
        startingTalents:  [],
        startingGear:     "",
        characteristicAdvances: {
          ws: [100,250,500,750], bs: [100,250,500,750],
          str:[100,250,500,750], t:  [100,250,500,750],
          ag: [100,250,500,750], int:[100,250,500,750],
          per:[100,250,500,750], wp: [100,250,500,750],
          fel:[100,250,500,750],
        },
        ranks: Array.from({length: 8}, (_, i) => ({ rank: i+1, advances: [] })),
      };
    }
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id:        `${SYSTEM_ID}-custom-career`,
      title:     "Custom Career Editor",
      template:  `systems/${SYSTEM_ID}/templates/dialogs/custom-career.hbs`,
      width:     700,
      height:    600,
      resizable: true,
      classes:   ["rogue-trader", `${SYSTEM_ID}-dialog`],
      tabs: [{ navSelector: ".career-editor-tabs", contentSelector: ".career-editor-body", initial: "basics" }],
    });
  }

  getData() {
    return {
      draft:      this._draft,
      charKeys:   Object.entries(CHAR_FULL).map(([k, v]) => ({ key: k, label: v, abbr: CHAR_ABBR[k] })),
      rankNums:   [1,2,3,4,5,6,7,8],
      isNew:      !this._existingId,
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Live update draft from basic fields
    html.find("[data-draft]").on("input change", (e) => {
      const key = e.currentTarget.dataset.draft;
      const val = e.currentTarget.value;
      foundry.utils.setProperty(this._draft, key, val);
    });

    // Rank name fields
    html.find(".rank-name-input").on("input", (e) => {
      const idx = parseInt(e.currentTarget.dataset.rankIdx, 10);
      this._draft.rankNames[idx] = e.currentTarget.value;
    });

    // Characteristic advance costs
    html.find(".char-advance-input").on("change", (e) => {
      const key   = e.currentTarget.dataset.char;
      const level = parseInt(e.currentTarget.dataset.level, 10);
      const val   = parseInt(e.currentTarget.value, 10) || 100;
      if (!this._draft.characteristicAdvances[key]) this._draft.characteristicAdvances[key] = [100,250,500,750];
      this._draft.characteristicAdvances[key][level] = val;
    });

    // Add advance to a rank
    html.find("[data-action='add-advance']").on("click", (e) => {
      const rank = parseInt(e.currentTarget.dataset.rank, 10);
      const rankData = this._draft.ranks.find(r => r.rank === rank);
      if (rankData) {
        rankData.advances.push({ name: "", cost: 100, type: "skill", prerequisites: "", multiplier: 1 });
        this.render(false);
      }
    });

    // Remove advance
    html.on("click", "[data-action='remove-advance']", (e) => {
      const rank = parseInt(e.currentTarget.dataset.rank, 10);
      const idx  = parseInt(e.currentTarget.dataset.idx, 10);
      const rankData = this._draft.ranks.find(r => r.rank === rank);
      if (rankData) {
        rankData.advances.splice(idx, 1);
        this.render(false);
      }
    });

    // Advance field editing
    html.on("change input", ".advance-field", (e) => {
      const rank  = parseInt(e.currentTarget.dataset.rank, 10);
      const idx   = parseInt(e.currentTarget.dataset.idx, 10);
      const field = e.currentTarget.dataset.field;
      const val   = e.currentTarget.type === "number"
        ? parseInt(e.currentTarget.value, 10) || 0
        : e.currentTarget.value;
      const rankData = this._draft.ranks.find(r => r.rank === rank);
      if (rankData?.advances?.[idx]) rankData.advances[idx][field] = val;
    });

    // Starting skills / talents (textarea, newline-separated)
    html.find("[data-starting='skills']").on("change", (e) => {
      this._draft.startingSkills = e.currentTarget.value.split("\n").map(s => s.trim()).filter(Boolean);
    });

    html.find("[data-starting='talents']").on("change", (e) => {
      this._draft.startingTalents = e.currentTarget.value.split("\n").map(s => s.trim()).filter(Boolean);
    });

    html.find("[data-action='save']").on("click", () => this._onSave());
    html.find("[data-action='cancel']").on("click", () => this.close());
  }

  async _onSave() {
    if (!this._draft.name?.trim()) {
      ui.notifications.warn("Career must have a name.");
      return;
    }

    // Auto-generate id from name if blank
    if (!this._draft.id) {
      this._draft.id = this._draft.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
    }

    const customCareers = foundry.utils.deepClone(this._actor.system.customCareers ?? {});
    customCareers[this._draft.id] = this._draft;

    await this._actor.update({ "system.customCareers": customCareers });
    ui.notifications.info(`Custom career "${this._draft.name}" saved.`);
    this.close();
    this._actor.sheet?.render(false);
  }
}

// ============================================================================
// 3. CAREER TAB DATA HELPER
// (Used by actor-sheet.js to build career tab context data)
// ============================================================================

/**
 * Build the full data object for the Career tab.
 * @param {Actor} actor
 * @returns {object}
 */
export function buildCareerTabData(actor) {
  const sys        = actor.system;
  const spent      = sys.experience?.spent ?? 0;
  const rank       = rankFromXP(spent);
  const career     = getActorCareer(actor);
  const all        = getAllCareers(actor);
  const rankName   = getRankName(actor);

  // Next rank threshold
  const nextThreshold = RANK_XP[rank] ?? null;
  const xpToNextRank  = nextThreshold ? Math.max(0, nextThreshold - spent) : null;

  // Build available advance list grouped by rank
  const advancesByRank = [];
  if (career) {
    for (let r = 1; r <= rank; r++) {
      const rankData = career.ranks.find(rd => rd.rank === r);
      if (!rankData) continue;
      advancesByRank.push({
        rank:     r,
        rankName: career.rankNames[r - 1] ?? `Rank ${r}`,
        advances: rankData.advances.map(adv => ({
          ...adv,
          isInCareer: true,
        })),
      });
    }
  }

  // Characteristic advance costs for this career
  const charAdvances = career
    ? Object.entries(CHAR_FULL).map(([key, label]) => {
        const costs  = career.characteristicAdvances?.[key] ?? [100,250,500,750];
        const char   = sys.characteristics?.[key];
        const bought = char?.advances ?? 0;
        return {
          key, label, abbr: CHAR_ABBR[key],
          bought,
          costs: costs.map((cost, i) => ({
            level:     i,
            levelName: ["Simple","Intermediate","Trained","Expert"][i],
            cost,
            purchased: i < bought,
            next:      i === bought,
            locked:    i > bought,
          })),
        };
      })
    : [];

  return {
    career,
    allCareers: Object.values(all).map(c => ({
      id: c.id, name: c.name, selected: c.id === career?.id,
    })),
    rank,
    rankName,
    nextThreshold,
    xpToNextRank,
    advancesByRank,
    charAdvances,
    hasCareer:    !!career,
    customCareers: Object.values(sys.customCareers ?? {}),
  };
}

// ============================================================================
// EXPORT for actor-sheet.js
// ============================================================================

export {
  CAREERS,
  getAllCareers,
  getActorCareer,
  rankFromXP,
  getRankName,
  getAvailableAdvances,
  isInCareer,
  outOfCareerCost,
  getCharAdvanceCost,
};
