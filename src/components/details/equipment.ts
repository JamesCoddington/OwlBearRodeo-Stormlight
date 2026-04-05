import { renderTextareaField } from "../shared/textarea-field.ts";
import type { Store } from "../../state/store.ts";

export function renderEquipment(store: Store): HTMLElement {
  return renderTextareaField(
    "Armor & Equipment",
    store.get().armorEquipment,
    (v) => store.update({ armorEquipment: v }),
    "Armor, equipment, gear...",
  );
}
