import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import { renderTextareaField } from "../shared/textarea-field.ts";
import { renderCollapsible } from "../shared/collapsible.ts";
import { renderAppearance } from "./appearance.ts";
import { renderGoals } from "./goals.ts";
import { renderEquipment } from "./equipment.ts";
import { renderNotes } from "./notes.ts";
import type { Store } from "../../state/store.ts";

export function renderDetailsPage(container: HTMLElement, store: Store): void {
  const data = store.get();

  // Header fields
  const headerFields = el("div", { className: "details-header-fields" });
  const pathsField = renderEditableField("Paths", data.paths, (v) => store.update({ paths: v }), "Character paths");
  const ancestryField = renderEditableField("Ancestry", data.ancestry, (v) => store.update({ ancestry: v }), "Ancestry");
  const playerField = renderEditableField("Player", data.playerName, (v) => store.update({ playerName: v }), "Player name");
  headerFields.append(pathsField, ancestryField, playerField);
  container.appendChild(headerFields);

  // Appearance
  container.appendChild(renderAppearance(store));

  // Purpose, Obstacle, Goals
  container.appendChild(
    renderCollapsible("Purpose & Goals", true, (body) => {
      body.appendChild(renderGoals(store));
    }),
  );

  // Other talents
  let otherTalentsTextarea: HTMLTextAreaElement | null = null;
  container.appendChild(
    renderCollapsible("Other Talents & Abilities", true, (body) => {
      const otherWrapper = renderTextareaField(
        "",
        data.otherTalents,
        (v) => store.update({ otherTalents: v }),
        "Other talents and abilities...",
      );
      otherTalentsTextarea = otherWrapper.querySelector("textarea");
      body.appendChild(otherWrapper);
    }),
  );

  // Equipment
  container.appendChild(
    renderCollapsible("Armor & Equipment", true, (body) => {
      body.appendChild(renderEquipment(store));
    }),
  );

  // Notes
  container.appendChild(
    renderCollapsible("Notes & Connections", true, (body) => {
      body.appendChild(renderNotes(store));
    }),
  );

  const pathsInput = pathsField.querySelector("textarea") as HTMLTextAreaElement;
  const ancestryInput = ancestryField.querySelector("textarea") as HTMLTextAreaElement;
  const playerInput = playerField.querySelector("textarea") as HTMLTextAreaElement;

  store.subscribe(() => {
    const d = store.get();
    if (document.activeElement !== pathsInput) pathsInput.value = d.paths;
    if (document.activeElement !== ancestryInput) ancestryInput.value = d.ancestry;
    if (document.activeElement !== playerInput) playerInput.value = d.playerName;
    if (otherTalentsTextarea && document.activeElement !== otherTalentsTextarea) {
      otherTalentsTextarea.value = d.otherTalents;
    }
  });
}
