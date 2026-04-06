import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import { renderCollapsible } from "../shared/collapsible.ts";
import { renderAttributes } from "./attributes.ts";
import { renderResources } from "./resources.ts";
import { renderSkills } from "./skills.ts";
import { renderDerived } from "./derived.ts";
import { renderWeapons } from "./weapons.ts";
import { renderTalents } from "./talents.ts";
import { renderConditions } from "./conditions.ts";
import type { Attributes } from "../../models/character.ts";
import type { Skill, CustomSkill } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

// Maps each Attributes key to the abbreviation used in skill.linkedAttribute
const attrKeyToAbbrev: Partial<Record<keyof Attributes, string>> = {
  strength: "str",
  speed: "spd",
  intellect: "int",
  willpower: "wil",
  awareness: "awa",
  presence: "pre",
};

function cascadeAttributeToSkills(store: Store, nextAttrs: Attributes): void {
  const prev = store.get().attributes;

  // Derive defenses: each group's two scores + 10
  const derived: Partial<Attributes> = {
    physicalDefense:  nextAttrs.strength  + nextAttrs.speed     + 10,
    cognitiveDefense: nextAttrs.intellect + nextAttrs.willpower + 10,
    spiritualDefense: nextAttrs.awareness + nextAttrs.presence  + 10,
  };

  const finalAttrs: Attributes = { ...nextAttrs, ...derived };

  // Find which score attributes actually changed
  const changedAbbrevs = new Map<string, number>();
  for (const [key, abbrev] of Object.entries(attrKeyToAbbrev) as [keyof Attributes, string][]) {
    if (prev[key] !== nextAttrs[key]) {
      changedAbbrevs.set(abbrev, nextAttrs[key] as number);
    }
  }

  const current = store.get();

  function updateSkillList<T extends Skill | CustomSkill>(skills: T[]): T[] {
    return skills.map((skill) => {
      const newScore = changedAbbrevs.get(skill.linkedAttribute);
      return newScore !== undefined ? { ...skill, ranks: Math.min(newScore, 5) } : skill;
    });
  }

  // Max focus = 2 + willpower
  const focusMax = 2 + nextAttrs.willpower;
  // Max investiture = 2 + higher of awareness or presence
  const investitureMax = 2 + Math.max(nextAttrs.awareness, nextAttrs.presence);

  store.update({
    attributes: finalAttrs,
    focus: { ...current.focus, max: focusMax },
    investiture: { ...current.investiture, max: investitureMax },
    physicalSkills: updateSkillList(current.physicalSkills),
    cognitiveSkills: updateSkillList(current.cognitiveSkills),
    spiritualSkills: updateSkillList(current.spiritualSkills),
    customSkills: updateSkillList(current.customSkills),
  });
}

export function renderStatsPage(container: HTMLElement, store: Store): void {
  const data = store.get();

  // Header fields: paths, ancestry, player name
  const headerFields = el("div", { className: "stats-header-fields" });
  headerFields.appendChild(
    renderEditableField("Paths", data.paths, (v) => store.update({ paths: v }), "Character paths"),
  );
  headerFields.appendChild(
    renderEditableField("Ancestry", data.ancestry, (v) => store.update({ ancestry: v }), "Ancestry"),
  );
  headerFields.appendChild(
    renderEditableField("Player", data.playerName, (v) => store.update({ playerName: v }), "Player name"),
  );
  container.appendChild(headerFields);

  // Attributes
  container.appendChild(
    renderAttributes(store, (attrs) => cascadeAttributeToSkills(store, attrs)),
  );

  // Resources
  container.appendChild(renderResources(store));

  // Derived stats
  container.appendChild(
    renderCollapsible("Derived Stats", true, (body) => {
      body.appendChild(renderDerived(store));
    }),
  );

  // Skills
  container.appendChild(
    renderCollapsible("Skills", true, (body) => {
      body.appendChild(renderSkills(store));
    }),
  );

  // Conditions & Expertises
  container.appendChild(
    renderCollapsible("Conditions & Expertises", false, (body) => {
      body.appendChild(renderConditions(store));
    }),
  );

  // Weapons
  container.appendChild(
    renderCollapsible("Weapons", false, (body) => {
      body.appendChild(renderWeapons(store));
    }),
  );

  // Talents
  container.appendChild(
    renderCollapsible("Talents", false, (body) => {
      body.appendChild(renderTalents(store));
    }),
  );
}
