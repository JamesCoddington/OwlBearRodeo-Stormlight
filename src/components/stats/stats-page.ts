import { el } from "../../utils/dom.ts";
import { renderEditableField } from "../shared/editable-field.ts";
import { renderCollapsible } from "../shared/collapsible.ts";
import { renderAttributes } from "./attributes.ts";
import { renderResources } from "./resources.ts";
import { renderSkills } from "./skills.ts";
import { renderDerived } from "./derived.ts";
import { renderWeapons } from "./weapons.ts";
import { renderTalents } from "./talents.ts";
import { renderConditions } from "./conditions.ts";
import type { Store } from "../../state/store.ts";

export function renderStatsPage(container: HTMLElement, store: Store): void {
  const data = store.get();

  // Header fields: paths, ancestry, player name
  const headerFields = el("div", { className: "stats-header-fields" });
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

  // Attributes
  container.appendChild(
    renderAttributes(data.attributes, (attrs) => store.update({ attributes: attrs })),
  );

  // Resources
  container.appendChild(renderResources(store));

  // Derived stats
  container.appendChild(
    renderCollapsible("Derived Stats", true, (body) => {
      body.appendChild(renderDerived(store));
    }),
  );

  // Skills
  container.appendChild(
    renderCollapsible("Skills", true, (body) => {
      body.appendChild(renderSkills(store));
    }),
  );

  // Conditions & Expertises
  container.appendChild(
    renderCollapsible("Conditions & Expertises", false, (body) => {
      body.appendChild(renderConditions(store));
    }),
  );

  // Weapons
  container.appendChild(
    renderCollapsible("Weapons", false, (body) => {
      body.appendChild(renderWeapons(store));
    }),
  );

  // Talents
  container.appendChild(
    renderCollapsible("Talents", false, (body) => {
      body.appendChild(renderTalents(store));
    }),
  );
}
