import type { CharacterSheet } from "./character.ts";

export function createDefaultCharacter(): CharacterSheet {
  return {
    version: 1,

    characterName: "",
    level: 1,
    paths: "",
    ancestry: "",
    playerName: "",

    attributes: {
      strength: 0,
      speed: 0,
      physicalDefense: 10,

      intellect: 0,
      willpower: 0,
      cognitiveDefense: 10,

      awareness: 0,
      presence: 0,
      spiritualDefense: 10,
    },

    health: { current: 0, max: 0 },
    focus: { current: 0, max: 0 },
    investiture: { current: 0, max: 0 },
    deflect: 0,

    physicalSkills: [
      { name: "Agility", linkedAttribute: "spd", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Athletics", linkedAttribute: "str", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Heavy Weaponry", linkedAttribute: "str", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Light Weaponry", linkedAttribute: "spd", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Stealth", linkedAttribute: "spd", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Thievery", linkedAttribute: "spd", ranks: 0, bonusRanks: 0, starRanks: 0 },
    ],
    cognitiveSkills: [
      { name: "Crafting", linkedAttribute: "int", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Deduction", linkedAttribute: "int", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Discipline", linkedAttribute: "wil", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Intimidation", linkedAttribute: "wil", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Lore", linkedAttribute: "int", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Medicine", linkedAttribute: "int", ranks: 0, bonusRanks: 0, starRanks: 0 },
    ],
    spiritualSkills: [
      { name: "Deception", linkedAttribute: "pre", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Insight", linkedAttribute: "awa", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Leadership", linkedAttribute: "pre", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Perception", linkedAttribute: "awa", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Persuasion", linkedAttribute: "pre", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "Survival", linkedAttribute: "awa", ranks: 0, bonusRanks: 0, starRanks: 0 },
    ],
    customSkills: [
      { name: "", linkedAttribute: "", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "", linkedAttribute: "", ranks: 0, bonusRanks: 0, starRanks: 0 },
      { name: "", linkedAttribute: "", ranks: 0, bonusRanks: 0, starRanks: 0 },
    ],

    derivedStats: {
      liftingCapacity: "",
      movement: 0,
      recoveryDie: "",
      sensesRange: "",
    },

    conditions: "",
    expertises: "",
    weapons: [],
    talents: [],

    appearance: "",
    purpose: "",
    obstacle: "",
    goals: [],
    otherTalents: "",
    armorEquipment: "",
    marks: "",
    notes: "",
    connections: "",

    radiantOrder: "",
    ideals: [
      "Life before death. Strength before weakness. Journey before destination.",
      "",
      "",
      "",
      "",
    ],
    sprenName: "",
    sprenPersonality: "",
    sprenBondRange: "",
    surges: [
      { name: "", effect: "", activation: "", mod: "", size: "", die: "", talents: [] },
      { name: "", effect: "", activation: "", mod: "", size: "", die: "", talents: [] },
    ],
  };
}
