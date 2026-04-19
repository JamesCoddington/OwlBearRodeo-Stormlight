import { el } from "../../utils/dom.ts";
import type { Condition, Expertise } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

function autoResize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function listInput(
  value: string,
  placeholder: string,
  onUpdate: (value: string) => void,
): HTMLTextAreaElement {
  const textarea = el("textarea", {
    className: "field-input field-input-grow",
    placeholder,
    rows: "1",
  }) as HTMLTextAreaElement;
  textarea.value = value;
  textarea.addEventListener("input", () => {
    autoResize(textarea);
    onUpdate(textarea.value);
  });
  requestAnimationFrame(() => autoResize(textarea));
  return textarea;
}

function labeledField(label: string, input: HTMLElement): HTMLElement {
  const wrapper = el("div");
  wrapper.appendChild(el("div", { className: "weapon-field-label" }, label));
  wrapper.appendChild(input);
  return wrapper;
}

export function renderExpertises(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const expertises = store.get().expertises;

    expertises.forEach((expertise, i) => {
      const row = el("div", { className: "expertise-row" });

      const typeInput = listInput(expertise.type, "Type", (v) => {
        const updated = [...store.get().expertises];
        updated[i] = { ...updated[i], type: v };
        store.updateNested("expertises", updated);
      });

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().expertises];
        updated.splice(i, 1);
        store.updateNested("expertises", updated);
        rebuild();
      });

      row.append(typeInput, removeBtn);
      container.appendChild(row);
    });

    const addBtn = el("button", { className: "list-field-add expertise-add" }, "+ Add Expertise");
    addBtn.addEventListener("click", () => {
      const updated: Expertise[] = [...store.get().expertises, { type: "" }];
      store.updateNested("expertises", updated);
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

export function renderConditions(store: Store): HTMLElement {
  const container = el("div");

  function rebuild(): void {
    container.innerHTML = "";
    const conditions = store.get().conditions;

    conditions.forEach((condition, i) => {
      const card = el("div", { className: "condition-entry" });

      function update(key: keyof Condition, value: string): void {
        const updated = [...store.get().conditions];
        updated[i] = { ...updated[i], [key]: value };
        store.updateNested("conditions", updated);
      }

      const topRow = el("div", { className: "condition-top-row" });
      topRow.appendChild(labeledField("Type", listInput(condition.type, "Type", (v) => update("type", v))));
      topRow.appendChild(labeledField("Time", listInput(condition.time, "Time", (v) => update("time", v))));

      const removeBtn = el("button", { className: "list-field-remove" }, "\u00D7");
      removeBtn.addEventListener("click", () => {
        const updated = [...store.get().conditions];
        updated.splice(i, 1);
        store.updateNested("conditions", updated);
        rebuild();
      });
      topRow.appendChild(removeBtn);
      card.appendChild(topRow);

      const descRow = el("div", { className: "condition-desc-row" });
      descRow.appendChild(labeledField("Description", listInput(condition.description, "Description", (v) => update("description", v))));
      card.appendChild(descRow);

      container.appendChild(card);
    });

    const addBtn = el("button", { className: "list-field-add condition-add" }, "+ Add Condition");
    addBtn.addEventListener("click", () => {
      const updated: Condition[] = [...store.get().conditions, { type: "", time: "", description: "" }];
      store.updateNested("conditions", updated);
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
