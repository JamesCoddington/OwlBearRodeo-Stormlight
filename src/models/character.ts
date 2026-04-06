export interface Attributes {
  strength: number;
  speed: number;
  physicalDefense: number;

  intellect: number;
  willpower: number;
  cognitiveDefense: number;

  awareness: number;
  presence: number;
  spiritualDefense: number;
}

export interface Resource {
  current: number;
  max: number;
}

export interface Skill {
  name: string;
  linkedAttribute: string;
  ranks: number;
  bonusRanks: number;
  starRanks: number;
}

export interface CustomSkill {
  name: string;
  linkedAttribute: string;
  ranks: number;
  bonusRanks: number;
  starRanks: number;
}

export interface DerivedStats {
  liftingCapacity: string;
  movement: number;
  recoveryDie: string;
  sensesRange: string;
}

export interface Weapon {
  name: string;
  skill: string;
  dmg: string;
  traits: string;
}

export interface Talent {
  name: string;
  description: string;
}

export interface Surge {
  name: string;
  effect: string;
  activation: string;
  mod: string;
  size: string;
  die: string;
  talents: string[];
}

export interface CharacterSheet {
  version: number;

  // Header
  characterName: string;
  level: number;
  paths: string;
  ancestry: string;
  playerName: string;

  // Attributes
  attributes: Attributes;

  // Resources
  health: Resource;
  focus: Resource;
  investiture: Resource;
  deflect: number;

  // Skills
  physicalSkills: Skill[];
  cognitiveSkills: Skill[];
  spiritualSkills: Skill[];
  customSkills: CustomSkill[];

  // Derived
  derivedStats: DerivedStats;

  // Misc stats page
  conditions: string;
  expertises: string;
  weapons: Weapon[];
  talents: Talent[];

  // Details page
  appearance: string;
  purpose: string;
  obstacle: string;
  goals: string[];
  otherTalents: string;
  armorEquipment: string;
  marks: string;
  notes: string;
  connections: string;

  // Radiant page
  radiantOrder: string;
  ideals: string[];
  sprenName: string;
  sprenPersonality: string;
  sprenBondRange: string;
  surges: [Surge, Surge];
}
