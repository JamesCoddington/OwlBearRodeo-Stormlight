import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderAppearance(store: Store): HTMLElement {
  return renderTextareaField(
    "Appearance",
    store.get().appearance,
    (v) => store.update({ appearance: v }),
    "Describe your character's appearance...",
  );
}
