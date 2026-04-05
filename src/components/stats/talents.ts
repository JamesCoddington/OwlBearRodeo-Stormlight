import { el } from "../../utils/dom.ts";
import type { Store } from "../../state/store.ts";

export function renderTalents(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const talents = store.get().talents;

    talents.forEach((talent, i) => {
      const row = el("div", { className: "talent-row" });

      const nameInput = el("input", {
        className: "field-input",
        type: "text",
        placeholder: "Talent name",
      });
      nameInput.value = talent.name;
      nameInput.addEventListener("input", () => {
        const updated = [...store.get().talents];
        updated[i] = { ...updated[i], name: nameInput.value };
        store.updateNested("talents", updated);
      });

      const descInput = el("input", {
        className: "field-input",
        type: "text",
        placeholder: "Description",
      });
      descInput.value = talent.description;
      descInput.addEventListener("input", () => {
        const updated = [...store.get().talents];
        updated[i] = { ...updated[i], description: descInput.value };
        store.updateNested("talents", updated);
      });

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().talents];
        updated.splice(i, 1);
        store.updateNested("talents", updated);
        rebuild();
      });

      row.append(nameInput, descInput, removeBtn);
      container.appendChild(row);
    });

    const addBtn = el("button", { className: "list-field-add talent-add" }, "+ Add Talent");
    addBtn.addEventListener("click", () => {
      const updated = [
        ...store.get().talents,
        { name: "", description: "" },
      ];
      store.updateNested("talents", updated);
      rebuild();
    });
    container.appendChild(addBtn);
  }

  rebuild();
  return container;
}
