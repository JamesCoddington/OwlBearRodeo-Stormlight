import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Store } from "../../state/store.ts";

export function renderDerived(store: Store): HTMLElement {
  const data = store.get();
  const grid = el("div", { className: "derived-grid" });

  grid.appendChild(
    renderEditableField("Lifting", data.derivedStats.liftingCapacity, (v) => {
      store.updateNested("derivedStats", { ...store.get().derivedStats, liftingCapacity: v });
    }),
  );
  grid.appendChild(
    renderEditableField("Movement", String(data.derivedStats.movement), (v) => {
      store.updateNested("derivedStats", { ...store.get().derivedStats, movement: parseInt(v) || 0 });
    }),
  );
  grid.appendChild(
    renderEditableField("Recovery", data.derivedStats.recoveryDie, (v) => {
      store.updateNested("derivedStats", { ...store.get().derivedStats, recoveryDie: v });
    }),
  );
  grid.appendChild(
    renderEditableField("Senses", data.derivedStats.sensesRange, (v) => {
      store.updateNested("derivedStats", { ...store.get().derivedStats, sensesRange: v });
    }),
  );

  return grid;
}
