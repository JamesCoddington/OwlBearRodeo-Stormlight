import { el } from "../../utils/dom.ts";
import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderNotes(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  container.appendChild(
    renderTextareaField("Marks", data.marks, (v) => store.update({ marks: v }), "Marks..."),
  );
  container.appendChild(
    renderTextareaField("Notes", data.notes, (v) => store.update({ notes: v }), "Notes..."),
  );
  container.appendChild(
    renderTextareaField("Connections", data.connections, (v) => store.update({ connections: v }), "Connections..."),
  );

  return container;
}
