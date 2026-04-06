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
  const focusBar = renderResourceBar("Focus", "focus", data.focus, (r: Resource) =>
    store.update({ focus: r }),
  );
  // Focus max is auto-calculated (2 + Willpower) — make it read-only and keep it synced
  const focusMaxInput = focusBar.querySelector<HTMLInputElement>(".resource-max");
  if (focusMaxInput) {
    focusMaxInput.readOnly = true;
    focusMaxInput.title = "Auto-calculated: 2 + Willpower";
    store.subscribe(() => {
      const latest = String(store.get().focus.max);
      if (focusMaxInput.value !== latest) focusMaxInput.value = latest;
    });
  }
  section.appendChild(focusBar);
  const investitureBar = renderResourceBar("Investiture", "investiture", data.investiture, (r: Resource) =>
    store.update({ investiture: r }),
  );
  // Investiture max is auto-calculated (2 + higher of Awareness or Presence)
  const investitureMaxInput = investitureBar.querySelector<HTMLInputElement>(".resource-max");
  if (investitureMaxInput) {
    investitureMaxInput.readOnly = true;
    investitureMaxInput.title = "Auto-calculated: 2 + higher of Awareness or Presence";
    store.subscribe(() => {
      const latest = String(store.get().investiture.max);
      if (investitureMaxInput.value !== latest) investitureMaxInput.value = latest;
    });
  }
  section.appendChild(investitureBar);

  const deflectRow = el("div", { className: "deflect-row" });
  const deflectLabel = el("span", { className: "resource-label" }, "Deflect");
  const deflectInput = renderNumberInput(data.deflect, (v) =>
    store.update({ deflect: v }),
  );
  deflectRow.append(deflectLabel, deflectInput);
  section.appendChild(deflectRow);

  return section;
}
