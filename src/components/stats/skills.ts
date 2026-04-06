import { el } from "../../utils/dom.ts";
import type { Skill, CustomSkill } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

const MAX_BUBBLES = 5;
const MAX_STARS = 3;

interface SkillControls {
  totalEl: HTMLInputElement;
  bubblesEl: HTMLElement;
  starsEl: HTMLElement;
  sync: (ranks: number, bonusRanks: number, starRanks: number) => void;
}

function renderSkillControls(
  initialRanks: number,
  initialBonusRanks: number,
  initialStarRanks: number,
  onBonusChange: (bonusRanks: number) => void,
  onStarChange: (starRanks: number) => void,
): SkillControls {
  let currentRanks = initialRanks;
  let currentBonus = initialBonusRanks;
  let currentStars = initialStarRanks;

  // Total display (read-only): ranks + bonusRanks + starRanks
  const totalEl = el("input", {
    className: "number-input skill-ranks",
    type: "number",
    title: "Base (from attribute) + circle pips + star pips",
  }) as HTMLInputElement;
  totalEl.readOnly = true;

  // Circle bubble pips
  const bubblesEl = el("div", { className: "skill-bubbles" });
  const bubbleEls: HTMLElement[] = [];

  // Star pips
  const starsEl = el("div", { className: "skill-stars" });
  const starEls: HTMLElement[] = [];

  function updateDisplay(ranks: number, bonus: number, stars: number): void {
    totalEl.value = String(ranks + bonus + stars);
    bubbleEls.forEach((b, i) => b.classList.toggle("filled", i < Math.min(bonus, MAX_BUBBLES)));
    starEls.forEach((s, i) => s.classList.toggle("filled", i < Math.min(stars, MAX_STARS)));
  }

  for (let i = 1; i <= MAX_BUBBLES; i++) {
    const bubble = el("button", { className: "skill-bubble", type: "button" });
    bubble.addEventListener("click", () => {
      currentBonus = currentBonus === i ? i - 1 : i;
      updateDisplay(currentRanks, currentBonus, currentStars);
      onBonusChange(currentBonus);
    });
    bubbleEls.push(bubble);
    bubblesEl.appendChild(bubble);
  }

  for (let i = 1; i <= MAX_STARS; i++) {
    const star = el("button", { className: "skill-star", type: "button" }, "★");
    star.addEventListener("click", () => {
      currentStars = currentStars === i ? i - 1 : i;
      updateDisplay(currentRanks, currentBonus, currentStars);
      onStarChange(currentStars);
    });
    starEls.push(star);
    starsEl.appendChild(star);
  }

  updateDisplay(initialRanks, initialBonusRanks, initialStarRanks);

  return {
    totalEl,
    bubblesEl,
    starsEl,
    sync(ranks: number, bonusRanks: number, starRanks: number) {
      currentRanks = ranks;
      currentBonus = bonusRanks;
      currentStars = starRanks;
      updateDisplay(ranks, bonusRanks, starRanks);
    },
  };
}

function renderSkillRow(
  skill: Skill,
  onBonusChange: (bonusRanks: number) => void,
  onStarChange: (starRanks: number) => void,
  getLatest: () => { ranks: number; bonusRanks: number; starRanks: number },
): HTMLElement {
  const row = el("div", { className: "skill-row" });
  const name = el("span", { className: "skill-name" }, skill.name);
  const attr = el("span", { className: "skill-attr" }, skill.linkedAttribute);
  const { totalEl, bubblesEl, starsEl, sync } = renderSkillControls(
    skill.ranks,
    skill.bonusRanks,
    skill.starRanks,
    onBonusChange,
    onStarChange,
  );

  row.append(name, attr, totalEl, bubblesEl, starsEl);

  (row as unknown as { syncValue(): void }).syncValue = () => {
    const { ranks, bonusRanks, starRanks } = getLatest();
    sync(ranks, bonusRanks, starRanks);
  };

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
  const rows: (HTMLElement & { syncValue(): void })[] = [];

  skills.forEach((skill, i) => {
    const row = renderSkillRow(
      skill,
      (bonusRanks) => {
        const updated = [...store.get()[storeKey]];
        updated[i] = { ...updated[i], bonusRanks };
        store.updateNested(storeKey, updated);
      },
      (starRanks) => {
        const updated = [...store.get()[storeKey]];
        updated[i] = { ...updated[i], starRanks };
        store.updateNested(storeKey, updated);
      },
      () => {
        const s = store.get()[storeKey][i];
        return { ranks: s.ranks, bonusRanks: s.bonusRanks, starRanks: s.starRanks };
      },
    ) as unknown as HTMLElement & { syncValue(): void };
    rows.push(row);
    grid.appendChild(row);
  });

  store.subscribe(() => {
    for (const row of rows) row.syncValue();
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

    const { totalEl, bubblesEl, starsEl, sync } = renderSkillControls(
      skill.ranks,
      skill.bonusRanks,
      skill.starRanks,
      (bonusRanks) => {
        const updated = [...store.get().customSkills];
        updated[i] = { ...updated[i], bonusRanks };
        store.updateNested("customSkills", updated);
      },
      (starRanks) => {
        const updated = [...store.get().customSkills];
        updated[i] = { ...updated[i], starRanks };
        store.updateNested("customSkills", updated);
      },
    );

    store.subscribe(() => {
      const s = store.get().customSkills[i];
      sync(s.ranks, s.bonusRanks, s.starRanks);
    });

    row.append(nameInput, attrInput, totalEl, bubblesEl, starsEl);
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
