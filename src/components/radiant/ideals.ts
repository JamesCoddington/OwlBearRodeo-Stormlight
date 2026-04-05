import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import type { Store } from "../../state/store.ts";

const IDEAL_LABELS = ["1st", "2nd", "3rd", "4th", "5th"];

export function renderIdeals(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  // Radiant Order
  container.appendChild(
    renderEditableField("Order", data.radiantOrder, (v) => store.update({ radiantOrder: v }), "Radiant Order"),
  );

  const title = el("div", { className: "section-title" }, "Ideals");
  container.appendChild(title);

  const list = el("div", { className: "ideals-list" });

  data.ideals.forEach((ideal, i) => {
    const row = el("div", { className: "ideal-row" });
    const num = el("span", { className: "ideal-number" }, IDEAL_LABELS[i]);

    const input = el("input", {
      className: "field-input",
      type: "text",
      placeholder: i === 0 ? "" : `${IDEAL_LABELS[i]} Ideal...`,
    });
    input.value = ideal;

    if (i === 0) {
      input.readOnly = true;
    } else {
      input.addEventListener("input", () => {
        const updated = [...store.get().ideals];
        updated[i] = input.value;
        store.updateNested("ideals", updated);
      });
    }

    row.append(num, input);
    list.appendChild(row);
  });

  container.appendChild(list);
  return container;
}
