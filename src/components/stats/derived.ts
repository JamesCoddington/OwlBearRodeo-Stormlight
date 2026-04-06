import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Store } from "../../state/store.ts";

export function renderDerived(store: Store): HTMLElement {
  const data = store.get();
  const grid = el("div", { className: "derived-grid" });

  const liftingField = renderEditableField("Lifting", data.derivedStats.liftingCapacity, (v) => {
    store.updateNested("derivedStats", { ...store.get().derivedStats, liftingCapacity: v });
  });
  const movementField = renderEditableField("Movement", String(data.derivedStats.movement), (v) => {
    store.updateNested("derivedStats", { ...store.get().derivedStats, movement: parseInt(v) || 0 });
  });
  const recoveryField = renderEditableField("Recovery", data.derivedStats.recoveryDie, (v) => {
    store.updateNested("derivedStats", { ...store.get().derivedStats, recoveryDie: v });
  });
  const sensesField = renderEditableField("Senses", data.derivedStats.sensesRange, (v) => {
    store.updateNested("derivedStats", { ...store.get().derivedStats, sensesRange: v });
  });

  grid.append(liftingField, movementField, recoveryField, sensesField);

  const liftingInput = liftingField.querySelector("textarea") as HTMLTextAreaElement;
  const movementInput = movementField.querySelector("textarea") as HTMLTextAreaElement;
  const recoveryInput = recoveryField.querySelector("textarea") as HTMLTextAreaElement;
  const sensesInput = sensesField.querySelector("textarea") as HTMLTextAreaElement;

  store.subscribe(() => {
    const d = store.get().derivedStats;
    if (document.activeElement !== liftingInput) liftingInput.value = d.liftingCapacity;
    if (document.activeElement !== movementInput) movementInput.value = String(d.movement);
    if (document.activeElement !== recoveryInput) recoveryInput.value = d.recoveryDie;
    if (document.activeElement !== sensesInput) sensesInput.value = d.sensesRange;
  });

  return grid;
}
