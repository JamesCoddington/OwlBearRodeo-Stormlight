import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Store } from "../../state/store.ts";

export function renderSpren(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  const title = el("div", { className: "section-title" }, "Spren");
  container.appendChild(title);

  const grid = el("div", { className: "spren-info" });
  const nameField = renderEditableField("Name", data.sprenName, (v) => store.update({ sprenName: v }), "Spren name");
  const bondField = renderEditableField("Bond Range", data.sprenBondRange, (v) => store.update({ sprenBondRange: v }), "Range");
  grid.append(nameField, bondField);
  container.appendChild(grid);

  // Personality textarea
  const persLabel = el("div", { className: "field-label" }, "Personality");
  const persTextarea = el("textarea", {
    className: "textarea-field",
    placeholder: "Spren personality...",
  });
  persTextarea.value = data.sprenPersonality;
  persTextarea.addEventListener("input", () => {
    store.update({ sprenPersonality: persTextarea.value });
  });

  container.append(persLabel, persTextarea);

  const nameInput = nameField.querySelector("textarea") as HTMLTextAreaElement;
  const bondInput = bondField.querySelector("textarea") as HTMLTextAreaElement;
  store.subscribe(() => {
    const d = store.get();
    if (document.activeElement !== nameInput) nameInput.value = d.sprenName;
    if (document.activeElement !== bondInput) bondInput.value = d.sprenBondRange;
    if (document.activeElement !== persTextarea) persTextarea.value = d.sprenPersonality;
  });

  return container;
}
