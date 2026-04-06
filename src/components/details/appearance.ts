import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderAppearance(store: Store): HTMLElement {
  const wrapper = renderTextareaField(
    "Appearance",
    store.get().appearance,
    (v) => store.update({ appearance: v }),
    "Describe your character's appearance...",
  );
  const textarea = wrapper.querySelector("textarea") as HTMLTextAreaElement;
  store.subscribe(() => {
    if (document.activeElement !== textarea) textarea.value = store.get().appearance;
  });
  return wrapper;
}
