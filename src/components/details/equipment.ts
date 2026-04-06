import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderEquipment(store: Store): HTMLElement {
  const wrapper = renderTextareaField(
    "Armor & Equipment",
    store.get().armorEquipment,
    (v) => store.update({ armorEquipment: v }),
    "Armor, equipment, gear...",
  );
  const textarea = wrapper.querySelector("textarea") as HTMLTextAreaElement;
  store.subscribe(() => {
    if (document.activeElement !== textarea) textarea.value = store.get().armorEquipment;
  });
  return wrapper;
}
