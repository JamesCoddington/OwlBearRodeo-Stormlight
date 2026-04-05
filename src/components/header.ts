import { el } from "../utils/dom.ts";
import type { Store } from "../state/store.ts";

export function renderHeader(store: Store): HTMLElement {
  const header = el("div", { className: "app-header" });

  const nameInput = el("input", {
    className: "char-name",
    type: "text",
    placeholder: "Character Name",
  });
  nameInput.value = store.get().characterName;
  nameInput.addEventListener("input", () => {
    store.update({ characterName: nameInput.value });
  });

  const levelBadge = el("div", { className: "level-badge" });
  const levelLabel = el("span", {}, "Lvl");
  const levelInput = el("input", {
    className: "level-input number-input",
    type: "number",
  });
  levelInput.value = String(store.get().level);
  levelInput.addEventListener("input", () => {
    store.update({ level: parseInt(levelInput.value) || 1 });
  });
  levelBadge.append(levelLabel, levelInput);

  header.append(nameInput, levelBadge);

  store.subscribe(() => {
    const data = store.get();
    if (document.activeElement !== nameInput) {
      nameInput.value = data.characterName;
    }
    if (document.activeElement !== levelInput) {
      levelInput.value = String(data.level);
    }
  });

  return header;
}
