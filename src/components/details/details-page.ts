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
  headerFields.appendChild(
    renderEditableField("Paths", data.paths, (v) => store.update({ paths: v }), "Character paths"),
  );
  headerFields.appendChild(
    renderEditableField("Ancestry", data.ancestry, (v) => store.update({ ancestry: v }), "Ancestry"),
  );
  headerFields.appendChild(
    renderEditableField("Player", data.playerName, (v) => store.update({ playerName: v }), "Player name"),
  );
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
  container.appendChild(
    renderCollapsible("Other Talents & Abilities", true, (body) => {
      body.appendChild(
        renderTextareaField(
          "",
          data.otherTalents,
          (v) => store.update({ otherTalents: v }),
          "Other talents and abilities...",
        ),
      );
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
}
