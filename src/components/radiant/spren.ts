import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Store } from "../../state/store.ts";

export function renderSpren(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  const title = el("div", { className: "section-title" }, "Spren");
  container.appendChild(title);

  const grid = el("div", { className: "spren-info" });
  grid.appendChild(
    renderEditableField("Name", data.sprenName, (v) => store.update({ sprenName: v }), "Spren name"),
  );
  grid.appendChild(
    renderEditableField("Bond Range", data.sprenBondRange, (v) => store.update({ sprenBondRange: v }), "Range"),
  );
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
  return container;
}
