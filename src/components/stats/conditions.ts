import { el } from "../../utils/dom.ts";
import type { Store } from "../../state/store.ts";

export function renderConditions(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  // Conditions & Injuries
  const condLabel = el("div", { className: "field-label" }, "Conditions & Injuries");
  const condTextarea = el("textarea", {
    className: "textarea-field",
    placeholder: "Conditions, injuries...",
  });
  condTextarea.value = data.conditions;
  condTextarea.addEventListener("input", () => {
    store.update({ conditions: condTextarea.value });
  });

  // Expertises
  const expLabel = el("div", { className: "field-label" }, "Expertises");
  const expTextarea = el("textarea", {
    className: "textarea-field",
    placeholder: "Expertises...",
  });
  expTextarea.value = data.expertises;
  expTextarea.addEventListener("input", () => {
    store.update({ expertises: expTextarea.value });
  });

  store.subscribe(() => {
    const d = store.get();
    if (document.activeElement !== condTextarea) condTextarea.value = d.conditions;
    if (document.activeElement !== expTextarea) expTextarea.value = d.expertises;
  });

  container.append(condLabel, condTextarea, expLabel, expTextarea);
  return container;
}
