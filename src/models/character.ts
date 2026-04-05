export interface AttributePair {
  score: number;
  defense: number;
}

export interface Attributes {
  strength: AttributePair;
  speed: AttributePair;
  intellect: AttributePair;
  willpower: AttributePair;
  awareness: AttributePair;
  presence: AttributePair;
}

export interface Resource {
  current: number;
  max: number;
}

export interface Skill {
  name: string;
  linkedAttribute: string;
  ranks: number;
}

export interface CustomSkill {
  name: string;
  linkedAttribute: string;
  ranks: number;
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
  crit: string;
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
