import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import { renderListField } from "../shared/list-field.ts";
import type { Store } from "../../state/store.ts";

export function renderGoals(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  // Purpose & Obstacle
  const poGrid = el("div", { className: "purpose-obstacle" });
  poGrid.appendChild(
    renderEditableField("Purpose", data.purpose, (v) => store.update({ purpose: v }), "Your purpose"),
  );
  poGrid.appendChild(
    renderEditableField("Obstacle", data.obstacle, (v) => store.update({ obstacle: v }), "Your obstacle"),
  );
  container.appendChild(poGrid);

  // Goals
  const goalsTitle = el("div", { className: "section-title" }, "Goals");
  container.appendChild(goalsTitle);
  container.appendChild(
    renderListField(
      [...data.goals],
      (items) => store.update({ goals: items }),
      "Enter a goal...",
    ),
  );

  return container;
}
