import { el } from "../../utils/dom.ts";
import { renderResourceBar } from "../shared/resource-bar.ts";
import { renderNumberInput } from "../shared/number-input.ts";
import type { Resource } from "../../models/character.ts";
import type { Store } from "../../state/store.ts";

export function renderResources(store: Store): HTMLElement {
  const section = el("div", { className: "resources-section" });
  const data = store.get();

  section.appendChild(
    renderResourceBar("Health", "health", data.health, (r: Resource) =>
      store.update({ health: r }),
    ),
  );
  section.appendChild(
    renderResourceBar("Focus", "focus", data.focus, (r: Resource) =>
      store.update({ focus: r }),
    ),
  );
  section.appendChild(
    renderResourceBar("Investiture", "investiture", data.investiture, (r: Resource) =>
      store.update({ investiture: r }),
    ),
  );

  const deflectRow = el("div", { className: "deflect-row" });
  const deflectLabel = el("span", { className: "resource-label" }, "Deflect");
  const deflectInput = renderNumberInput(data.deflect, (v) =>
    store.update({ deflect: v }),
  );
  deflectRow.append(deflectLabel, deflectInput);
  section.appendChild(deflectRow);

  return section;
}
