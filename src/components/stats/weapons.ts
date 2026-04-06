import { el } from "../../utils/dom.ts";
import type { Weapon } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

function weaponInput(
  weapon: Weapon,
  key: keyof Weapon,
  placeholder: string,
  onUpdate: (value: string) => void,
): HTMLInputElement {
  const input = el("input", {
    className: "field-input",
    type: "text",
    placeholder,
  });
  input.value = weapon[key];
  input.addEventListener("input", () => onUpdate(input.value));
  return input;
}

function labeledField(label: string, input: HTMLElement): HTMLElement {
  const wrapper = el("div");
  wrapper.appendChild(el("div", { className: "weapon-field-label" }, label));
  wrapper.appendChild(input);
  return wrapper;
}

export function renderWeapons(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const weapons = store.get().weapons;

    weapons.forEach((weapon, i) => {
      const card = el("div", { className: "weapon-entry" });

      function update(key: keyof Weapon, value: string): void {
        const updated = [...store.get().weapons];
        updated[i] = { ...updated[i], [key]: value };
        store.updateNested("weapons", updated);
      }

      // Top row: Name + Skill + remove button
      const topRow = el("div", { className: "weapon-top-row" });
      topRow.appendChild(weaponInput(weapon, "name", "Weapon name", (v) => update("name", v)));
      topRow.appendChild(weaponInput(weapon, "skill", "Skill", (v) => update("skill", v)));

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().weapons];
        updated.splice(i, 1);
        store.updateNested("weapons", updated);
        rebuild();
      });
      topRow.appendChild(removeBtn);
      card.appendChild(topRow);

      // Bottom row: Dmg, Crit, Traits
      const bottomRow = el("div", { className: "weapon-bottom-row" });
      bottomRow.appendChild(labeledField("Dmg", weaponInput(weapon, "dmg", "Dmg", (v) => update("dmg", v))));
      bottomRow.appendChild(labeledField("Traits", weaponInput(weapon, "traits", "Traits", (v) => update("traits", v))));
      card.appendChild(bottomRow);

      container.appendChild(card);
    });

    const addBtn = el("button", { className: "list-field-add weapon-add" }, "+ Add Weapon");
    addBtn.addEventListener("click", () => {
      const updated = [
        ...store.get().weapons,
        { name: "", skill: "", dmg: "", traits: "" },
      ];
      store.updateNested("weapons", updated);
      rebuild();
    });
    container.appendChild(addBtn);
  }

  rebuild();
  return container;
}
