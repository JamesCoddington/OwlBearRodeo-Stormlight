import { el } from "../utils/dom.ts";
import type { Store } from "../state/store.ts";
import type { CharacterSheet } from "../models/character.ts";

function exportCharacter(store: Store): void {
  const character = store.get();
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = (character.characterName || "character") + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

function importCharacter(store: Store): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as CharacterSheet;
        if (!data.version || !data.attributes) {
          alert("Invalid character file.");
          return;
        }
        store.update(data);
      } catch {
        alert("Failed to read character file.");
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

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

  const actions = el("div", { className: "header-actions" });
  const importBtn = el("button", { className: "header-action-btn" }, "Import");
  const exportBtn = el("button", { className: "header-action-btn" }, "Export");
  importBtn.addEventListener("click", () => importCharacter(store));
  exportBtn.addEventListener("click", () => exportCharacter(store));
  actions.append(importBtn, exportBtn);

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

  header.append(nameInput, actions, levelBadge);

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
