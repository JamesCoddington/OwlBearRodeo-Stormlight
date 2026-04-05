import { el } from "../../utils/dom.ts";
import { renderNumberInput } from "../shared/number-input.ts";
import type { Skill, CustomSkill } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

function renderSkillRow(skill: Skill, onChange: (ranks: number) => void): HTMLElement {
  const row = el("div", { className: "skill-row" });
  const name = el("span", { className: "skill-name" }, skill.name);
  const attr = el("span", { className: "skill-attr" }, skill.linkedAttribute);
  const ranksInput = renderNumberInput(skill.ranks, onChange, "skill-ranks");
  row.append(name, attr, ranksInput);
  return row;
}

function renderSkillGroup(
  title: string,
  skills: Skill[],
  storeKey: "physicalSkills" | "cognitiveSkills" | "spiritualSkills",
  store: Store,
): HTMLElement {
  const wrapper = el("div");
  const titleEl = el("div", { className: "section-title" }, title);
  const grid = el("div", { className: "skills-grid" });

  skills.forEach((skill, i) => {
    grid.appendChild(
      renderSkillRow(skill, (ranks) => {
        const updated = [...store.get()[storeKey]];
        updated[i] = { ...updated[i], ranks };
        store.updateNested(storeKey, updated);
      }),
    );
  });

  wrapper.append(titleEl, grid);
  return wrapper;
}

function renderCustomSkills(store: Store): HTMLElement {
  const wrapper = el("div");
  const title = el("div", { className: "section-title" }, "Custom Skills");

  const data = store.get();
  data.customSkills.forEach((skill: CustomSkill, i: number) => {
    const row = el("div", { className: "custom-skill-row" });

    const nameInput = el("input", {
      className: "field-input custom-skill-name",
      type: "text",
      placeholder: "Skill name",
    });
    nameInput.value = skill.name;
    nameInput.addEventListener("input", () => {
      const updated = [...store.get().customSkills];
      updated[i] = { ...updated[i], name: nameInput.value };
      store.updateNested("customSkills", updated);
    });

    const attrInput = el("input", {
      className: "field-input custom-skill-attr",
      type: "text",
      placeholder: "attr",
    });
    attrInput.value = skill.linkedAttribute;
    attrInput.addEventListener("input", () => {
      const updated = [...store.get().customSkills];
      updated[i] = { ...updated[i], linkedAttribute: attrInput.value };
      store.updateNested("customSkills", updated);
    });

    const ranksInput = renderNumberInput(skill.ranks, (ranks) => {
      const updated = [...store.get().customSkills];
      updated[i] = { ...updated[i], ranks };
      store.updateNested("customSkills", updated);
    }, "skill-ranks");

    row.append(nameInput, attrInput, ranksInput);
    wrapper.appendChild(row);
  });

  wrapper.prepend(title);
  return wrapper;
}

export function renderSkills(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  container.appendChild(
    renderSkillGroup("Physical Skills", data.physicalSkills, "physicalSkills", store),
  );
  container.appendChild(
    renderSkillGroup("Cognitive Skills", data.cognitiveSkills, "cognitiveSkills", store),
  );
  container.appendChild(
    renderSkillGroup("Spiritual Skills", data.spiritualSkills, "spiritualSkills", store),
  );
  container.appendChild(renderCustomSkills(store));

  return container;
}
