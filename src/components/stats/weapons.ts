import { el } from "../../utils/dom.ts";
import type { Weapon } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

const WEAPON_FIELDS: { key: keyof Weapon; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "skill", label: "Skill" },
  { key: "dmg", label: "Dmg" },
  { key: "crit", label: "Crit" },
  { key: "traits", label: "Traits" },
];

export function renderWeapons(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const weapons = store.get().weapons;

    // Header
    const headerRow = el("div", { className: "weapon-row" });
    for (const f of WEAPON_FIELDS) {
      headerRow.appendChild(el("span", { className: "weapon-header" }, f.label));
    }
    container.appendChild(headerRow);

    // Rows
    weapons.forEach((weapon, i) => {
      const row = el("div", { className: "weapon-row" });
      for (const f of WEAPON_FIELDS) {
        const input = el("input", {
          className: "field-input",
          type: "text",
        });
        input.value = weapon[f.key];
        input.addEventListener("input", () => {
          const updated = [...store.get().weapons];
          updated[i] = { ...updated[i], [f.key]: input.value };
          store.updateNested("weapons", updated);
        });
        row.appendChild(input);
      }

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().weapons];
        updated.splice(i, 1);
        store.updateNested("weapons", updated);
        rebuild();
      });
      row.appendChild(removeBtn);

      container.appendChild(row);
    });

    const addBtn = el("button", { className: "list-field-add weapon-add" }, "+ Add Weapon");
    addBtn.addEventListener("click", () => {
      const updated = [
        ...store.get().weapons,
        { name: "", skill: "", dmg: "", crit: "", traits: "" },
      ];
      store.updateNested("weapons", updated);
      rebuild();
    });
    container.appendChild(addBtn);
  }

  rebuild();
  return container;
}
