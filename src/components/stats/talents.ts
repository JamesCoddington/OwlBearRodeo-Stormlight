import { el } from "../../utils/dom.ts";
import type { Store } from "../../state/store.ts";

function autoResize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

export function renderTalents(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const talents = store.get().talents;

    talents.forEach((talent, i) => {
      const row = el("div", { className: "talent-row" });

      const nameInput = el("textarea", {
        className: "field-input field-input-grow",
        placeholder: "Talent name",
        rows: "1",
      }) as HTMLTextAreaElement;
      nameInput.value = talent.name;
      nameInput.addEventListener("input", () => {
        autoResize(nameInput);
        const updated = [...store.get().talents];
        updated[i] = { ...updated[i], name: nameInput.value };
        store.updateNested("talents", updated);
      });
      requestAnimationFrame(() => autoResize(nameInput));

      const descInput = el("textarea", {
        className: "field-input field-input-grow",
        placeholder: "Description",
        rows: "1",
      }) as HTMLTextAreaElement;
      descInput.value = talent.description;
      descInput.addEventListener("input", () => {
        autoResize(descInput);
        const updated = [...store.get().talents];
        updated[i] = { ...updated[i], description: descInput.value };
        store.updateNested("talents", updated);
      });
      requestAnimationFrame(() => autoResize(descInput));

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
  store.subscribe(() => {
    if (!container.contains(document.activeElement)) rebuild();
  });
  return container;
}
