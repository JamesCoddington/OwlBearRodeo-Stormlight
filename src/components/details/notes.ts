import { el } from "../../utils/dom.ts";
import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderNotes(store: Store): HTMLElement {
  const container = el("div");
  const data = store.get();

  const marksWrapper = renderTextareaField("Marks", data.marks, (v) => store.update({ marks: v }), "Marks...");
  const notesWrapper = renderTextareaField("Notes", data.notes, (v) => store.update({ notes: v }), "Notes...");
  const connectionsWrapper = renderTextareaField("Connections", data.connections, (v) => store.update({ connections: v }), "Connections...");

  container.append(marksWrapper, notesWrapper, connectionsWrapper);

  const marksTextarea = marksWrapper.querySelector("textarea") as HTMLTextAreaElement;
  const notesTextarea = notesWrapper.querySelector("textarea") as HTMLTextAreaElement;
  const connectionsTextarea = connectionsWrapper.querySelector("textarea") as HTMLTextAreaElement;

  store.subscribe(() => {
    const d = store.get();
    if (document.activeElement !== marksTextarea) marksTextarea.value = d.marks;
    if (document.activeElement !== notesTextarea) notesTextarea.value = d.notes;
    if (document.activeElement !== connectionsTextarea) connectionsTextarea.value = d.connections;
  });

  return container;
}
